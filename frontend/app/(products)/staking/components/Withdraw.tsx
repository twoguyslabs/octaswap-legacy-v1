import { useMemo } from 'react'
import { formatEther } from 'viem'
import { BaseError, useWriteContract } from 'wagmi'
import { CoinsIcon, GiftIcon, MedalIcon } from 'lucide-react'
import useAddress from '@/app/hooks/useAddress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { calculateLockDuration, cn } from '@/lib/utils'
import useStakingData from '../hooks/useStakingData'
import LockDuration from './LockDuration'

interface WithdrawStatsProps {
  text: string
  value: string | undefined
  icon?: React.ReactNode
}

function WithdrawStats({ text, value, icon }: WithdrawStatsProps) {
  return (
    <div className='bg-secondary/50 flex items-center space-x-3 rounded-lg p-3'>
      {icon && <div className='text-primary p-1'>{icon}</div>}
      <div>
        <p className='text-muted-foreground text-sm'>{text}</p>
        <p className={cn('text-xl font-bold', text === 'Staked + Rewards' && 'text-green-400')}>
          {value ? value : '-'}
        </p>
      </div>
    </div>
  )
}

function Withdrawal({
  withdrawError,
  handleWithdraw,
  isButtonDisabled,
  getButtonText,
}: {
  withdrawError: BaseError | null
  handleWithdraw: () => void
  isButtonDisabled: boolean
  getButtonText: () => string
}) {
  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-3xl'>Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {withdrawError && (
            <Alert variant='destructive'>
              <AlertTitle className='font-bold'>Withdraw Error</AlertTitle>
              <AlertDescription>{withdrawError.shortMessage}</AlertDescription>
            </Alert>
          )}
          <p className='text-muted-foreground text-sm'>
            You can withdraw your staked tokens and rewards after the lock period ends. Early withdrawal is not
            available for this staking program.
          </p>
          <Button onClick={handleWithdraw} className='w-full' disabled={isButtonDisabled}>
            {getButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function YourStake({
  tier,
  staked,
  totalValue,
  remainingLockDays,
  progressPercentage,
}: {
  tier: string | undefined
  staked: string | undefined
  totalValue: string | undefined
  remainingLockDays: number | undefined
  progressPercentage: number | undefined
}) {
  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-3xl'>Your Stake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <WithdrawStats text='Current Tier' value={tier} icon={<MedalIcon className='h-7 w-7' />} />
            <WithdrawStats text='Staked Amount' value={staked} icon={<CoinsIcon className='h-7 w-7' />} />
          </div>
          <WithdrawStats text='Staked + Rewards' value={totalValue} icon={<GiftIcon className='h-7 w-7' />} />
        </div>
        <LockDuration remainingLockDays={remainingLockDays ?? 0} progressPercentage={progressPercentage ?? 0} />
      </CardContent>
    </Card>
  )
}

export default function Withdraw() {
  const address = useAddress()
  const { data, isLoading, error } = useStakingData()

  const withdrawInfo = useMemo(() => {
    if (!data || !data.isStaking || !data.amountStaked || !data.earned) return null

    const { tier, amountStaked, earned, updatedAt } = data
    const staked = formatEther(amountStaked)
    const pendingRewards = Number(formatEther(earned))
    const totalValue = (Number(staked) + pendingRewards).toFixed(7)

    const { remainingLockDays, progressPercentage } = calculateLockDuration(
      Number(tier?.lockDuration),
      Number(updatedAt),
    )

    return {
      tier: tier?.name,
      staked,
      totalValue,
      remainingLockDays,
      progressPercentage,
      canWithdraw: remainingLockDays <= 0,
    }
  }, [data])

  const { writeContract, error: withdrawError, isPending: isWithdrawing } = useWriteContract()

  const handleWithdraw = async () => {
    writeContract({
      abi: STAKING_ABI,
      address: STAKING_ADDRESS,
      functionName: 'withdraw',
      args: [address],
    })
  }

  const isButtonDisabled = isWithdrawing || !withdrawInfo?.canWithdraw

  function getButtonText() {
    if (isWithdrawing) return 'Withdrawing...'
    if (!withdrawInfo?.canWithdraw) return 'Locked'
    return 'Withdraw Stake + Rewards'
  }

  if (isLoading) return <div className='flex h-64 items-center justify-center'>Loading...</div>
  if (error) return <div className='text-red-500'>Error: {error.message}</div>

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      <YourStake
        tier={withdrawInfo?.tier}
        staked={withdrawInfo?.staked}
        totalValue={withdrawInfo?.totalValue}
        remainingLockDays={withdrawInfo?.remainingLockDays}
        progressPercentage={withdrawInfo?.progressPercentage}
      />
      <Withdrawal
        withdrawError={withdrawError as BaseError}
        handleWithdraw={handleWithdraw}
        isButtonDisabled={isButtonDisabled}
        getButtonText={getButtonText}
      />
    </div>
  )
}
