import useAddress from '@/app/hooks/useAddress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { formatEther } from 'viem'
import { useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

interface WithdrawStatsProps {
  text: string
  value: string
}

function WithdrawStats({ text, value }: WithdrawStatsProps) {
  return (
    <div>
      <p className='text-sm text-gray-500'>{text}</p>
      <p className={cn('text-xl font-bold', text === 'Total Value (Staked + Rewards)' && 'text-green-600')}>{value}</p>
    </div>
  )
}

export default function Withdraw() {
  const address = useAddress()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const { data: isStaking } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'isStaking',
    args: [address],
  })

  const { data: stakeOf } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'stakeOf',
    args: [address],
  })

  const { data: earned } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'earned',
    args: [address],
  })

  const [tier, amountStaked, updatedAt] = stakeOf ?? []

  const staked = formatEther(amountStaked ?? BigInt(0))
  const pendingRewards = Number(formatEther(earned ?? BigInt(0)))
  const totalValue = (Number(staked) + pendingRewards).toFixed(6)

  const lockDuration = Number(tier?.lockDuration ?? 0)
  const lastUpdatedAt = Number(updatedAt ?? 0)
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)

  const lockDurationInSeconds = Math.max(0, lastUpdatedAt + lockDuration - currentTimeInSeconds)
  const lockDurationInDays = Math.ceil(lockDurationInSeconds / (24 * 60 * 60))

  const elapsedTime = currentTimeInSeconds - lastUpdatedAt
  const progressPercentage = Math.min(100, Math.max(0, (elapsedTime / lockDuration) * 100))

  const { data: withdrawConfig } = useSimulateContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'withdraw',
    args: [address],
  })

  const { writeContract: writeWithdraw, data: withdrawData } = useWriteContract()

  const { isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawData,
  })

  const handleWithdraw = async () => {
    if (!isStaking || lockDurationInSeconds > 0) {
      alert('You cannot withdraw at this time. Please wait until the lock period ends.')
      return
    }

    setIsWithdrawing(true)
    try {
      // @ts-ignore
      await writeWithdraw(withdrawConfig?.request)
    } catch (error) {
      console.error('Error during withdrawal:', error)
      alert('Failed to withdraw tokens. Please try again.')
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle>Your Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <WithdrawStats text='Current Tier' value={isStaking ? (tier?.name as string) : '-'} />
            <WithdrawStats text='Staked Amount' value={isStaking ? staked : '-'} />
            <WithdrawStats text='Total Value (Staked + Rewards)' value={isStaking ? totalValue : '-'} />
            <div>
              <p className='text-sm font-medium'>Lock Duration Remaining</p>
              <Progress value={isStaking ? progressPercentage : 0} className='mt-2' />
              <p className='mt-1 text-sm'>{isStaking ? lockDurationInDays : '0'} days left</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle>Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <p className='text-sm'>
              You can withdraw your staked tokens and rewards after the lock period ends. Early withdrawal is not
              available for this staking program.
            </p>
            <Button
              onClick={handleWithdraw}
              className='w-full'
              disabled={!isStaking || lockDurationInSeconds > 0 || isWithdrawing || isWithdrawLoading}
            >
              {isWithdrawing || isWithdrawLoading ? 'Withdrawing...' : 'Withdraw Stake + Rewards'}
            </Button>
            {isWithdrawSuccess && (
              <p className='text-sm text-green-600'>Withdrawal successful! Your tokens have been transferred.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
