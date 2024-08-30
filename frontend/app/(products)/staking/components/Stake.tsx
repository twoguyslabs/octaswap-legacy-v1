import useAddress from '@/app/hooks/useAddress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OCS_ADDRESS } from '@/contracts/ocs'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { useMemo, useState } from 'react'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { BaseError, useReadContract, useWriteContract } from 'wagmi'
import { useOcsPrice } from '../../hooks/usePrice'
import useApprove from '../../hooks/useApprove'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'

function StakingInformation() {
  return (
    <div className='bg-primary/10 border-primary rounded-lg border p-4'>
      <div className='text-primary text-sm'>
        Staking Information:
        <ul className='mt-2 list-inside list-disc space-y-1'>
          <li>Your tokens will be locked for the duration of the selected tier.</li>
          <li>Early unstaking is not available. Please choose your tier carefully.</li>
          <li>After the lock period ends, you can withdraw your staked amount plus earned rewards.</li>
          <li>
            Match the <span className='font-bold'>value</span> to minimum and maximum stake amounts. Please check before
            staking.
          </li>
        </ul>
      </div>
    </div>
  )
}

function TierDetail({ text, value }: { text: string; value: string | number | undefined }) {
  return (
    <p className='text-sm'>
      {text} : <span className='font-medium'>{value}</span>
    </p>
  )
}

function TierSelect({
  tiers,
  tierIndex,
  setTierIndex,
}: {
  tiers: Tier[] | undefined
  tierIndex: number
  setTierIndex: (index: number) => void
}) {
  return (
    <Select value={tierIndex.toString()} onValueChange={(value) => setTierIndex(Number(value))}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a tier' />
      </SelectTrigger>
      <SelectContent>
        {tiers?.map((tier, index) => (
          <SelectItem key={index} value={(index + 1).toString()}>
            {tier.name} - {Number(tier.rewardsRate) / 100}% APY
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function Stake() {
  const { toast } = useToast()

  const address = useAddress()
  const ocsPrice = useOcsPrice()

  const [tierIndex, setTierIndex] = useState(1)
  const [amount, setAmount] = useState('')

  const tIndex = tierIndex - 1

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'getTiers',
  })

  const { data: allowance, isLoading: isLoadingAllowance } = useReadContract({
    abi: erc20Abi,
    address: OCS_ADDRESS,
    functionName: 'allowance',
    args: [address, STAKING_ADDRESS],
  })

  const isAllowance = allowance ? allowance >= parseEther(amount) : false

  const { handleOnApprove, isApproving } = useApprove(OCS_ADDRESS, STAKING_ADDRESS, amount)

  const { writeContract, error: stakeError, isPending: isStaking } = useWriteContract()

  const handleOnStake = () => {
    if (!isAllowance) {
      handleOnApprove()
    } else {
      writeContract({
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'stake',
        args: [tIndex, parseEther(ocsPrice.toString()), address, parseEther(amount)],
      })
    }
  }

  const selectedTier = tiers?.[tIndex]

  const stakingInfo = useMemo(() => {
    if (!selectedTier) return null

    const apy = Number(selectedTier.rewardsRate) / 100
    const lockDuration = Number(selectedTier.lockDuration) / 86400
    const minAmount = formatEther(selectedTier.minAmount)
    const maxAmount = formatEther(selectedTier.maxAmount)

    return {
      apy,
      lockDuration,
      minAmount,
      maxAmount,
    }
  }, [selectedTier])

  const isLoading = isLoadingTiers || isLoadingAllowance

  const isButtonDisabled = isApproving || isStaking || !amount || !tierIndex

  function getButtonText() {
    if (isApproving) return 'Approving...'
    if (isStaking) return 'Staking...'
    if (!isAllowance) return 'Approve'
    return 'Stake'
  }

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <Card className='shadow-lg'>
          <CardHeader>
            <Skeleton className='h-8 w-1/3 bg-gray-300 dark:bg-gray-700' />
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <Skeleton className='h-10 w-full bg-gray-300 dark:bg-gray-700' />
              <Skeleton className='h-40 w-full bg-gray-300 dark:bg-gray-700' />
              <Skeleton className='h-10 w-full bg-gray-300 dark:bg-gray-700' />
              <Skeleton className='h-40 w-full bg-gray-300 dark:bg-gray-700' />
              <Skeleton className='h-12 w-full bg-gray-300 dark:bg-gray-700' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-3xl'>Stake Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <TierSelect tiers={tiers as Tier[]} tierIndex={tierIndex} setTierIndex={setTierIndex} />

            {tierIndex && (
              <div className='rounded-lg border bg-gray-50 p-4 dark:bg-gray-900'>
                <h3 className='mb-2 text-xl font-bold'>Tier Details</h3>
                <TierDetail text='APY' value={`${stakingInfo?.apy}%`} />
                <TierDetail text='Lock Duration' value={`${stakingInfo?.lockDuration} days`} />
                <TierDetail text='Min Amount' value={`$${stakingInfo?.minAmount}`} />
                <TierDetail text='Max Amount' value={`$${stakingInfo?.maxAmount}`} />
              </div>
            )}
            {stakeError && (
              <Alert variant='destructive'>
                <AlertTitle className='font-bold'>Stake Error</AlertTitle>
                <AlertDescription>{(stakeError as BaseError).shortMessage}</AlertDescription>
              </Alert>
            )}
            <div className='space-y-2'>
              <Input
                type='string'
                placeholder='Enter amount to stake'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='text-lg'
              />
              <p className='pl-3'>Value: ${+amount * ocsPrice}</p>
            </div>
            <StakingInformation />
            <Button className='w-full py-3 text-lg' onClick={handleOnStake} disabled={isButtonDisabled}>
              {getButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
