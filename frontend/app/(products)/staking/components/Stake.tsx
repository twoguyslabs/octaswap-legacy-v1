import useAddress from '@/app/hooks/useAddress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { useEffect, useState } from 'react'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

const OCS_ADDRESS = '0xffb6b2e7d567eddea5f83f42eff1e83163e5aa55'

interface Tier {
  name: string
  minAmount: bigint
  maxAmount: bigint
  lockDuration: bigint
  rewardsRate: bigint
}

export default function Stake() {
  const address = useAddress()
  const [selectedTier, setSelectedTier] = useState('Beginner')
  const [amount, setAmount] = useState('')
  const [ocsPrice, setOcsPrice] = useState(0)

  const { data: getTiers } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'getTiers',
  })

  const tiers: Record<string, Tier> =
    getTiers?.reduce(
      (acc, tier) => {
        acc[tier.name] = tier
        return acc
      },
      {} as Record<string, Tier>,
    ) || {}

  const selectedTierData = tiers[selectedTier]
  const apy = selectedTierData ? Number(selectedTierData.rewardsRate) / 100 : 0
  const lockDuration = selectedTierData ? Number(selectedTierData.lockDuration) / 86400 : 0
  const minAmount = selectedTierData ? formatEther(selectedTierData.minAmount) : '0'
  const maxAmount = selectedTierData ? formatEther(selectedTierData.maxAmount) : '0'

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(
          `https://api.geckoterminal.com/api/v2/simple/networks/octaspace/token_price/${OCS_ADDRESS}`,
        )
        const data = await response.json()
        setOcsPrice(data.data.attributes.token_prices[OCS_ADDRESS])
      } catch (error) {
        console.error('Failed to fetch OCS price:', error)
      }
    }
    fetchPrice()
  }, [])

  const selectedTierIndex = getTiers?.findIndex((item) => item.name === selectedTier) ?? 0

  const { data: stakingAllowance } = useReadContract({
    abi: erc20Abi,
    address: OCS_ADDRESS,
    functionName: 'allowance',
    args: [address, STAKING_ADDRESS],
  })

  const { data: approveConfig } = useSimulateContract({
    abi: erc20Abi,
    address: OCS_ADDRESS,
    functionName: 'approve',
    args: [STAKING_ADDRESS, parseEther(amount || '0')],
  })

  const { data: stakeConfig } = useSimulateContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'stake',
    args: [selectedTierIndex, parseEther(ocsPrice.toString()), address, parseEther(amount || '0')],
  })

  const { writeContract: writeApprove, data: approveData } = useWriteContract()
  const { writeContract: writeStake, data: stakeData } = useWriteContract()

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveData,
  })

  const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeData,
  })

  useEffect(() => {
    if (isApproveSuccess) {
      handleStake(true)
    }
  }, [isApproveSuccess])

  useEffect(() => {
    if (isStakeSuccess) {
      alert('Tokens staked successfully!')
      setAmount('')
    }
  }, [isStakeSuccess])

  const handleStake = async (skipAllowanceCheck = false) => {
    if (!address || !amount || isNaN(parseFloat(amount))) {
      alert('Please enter a valid amount to stake.')
      return
    }

    const amountToStake = parseEther(amount)

    if (!skipAllowanceCheck && (stakingAllowance ?? BigInt(0)) < amountToStake) {
      try {
        //@ts-ignore
        await writeApprove(approveConfig?.request)
      } catch (error) {
        console.error('Error during approval:', error)
        alert('Failed to approve tokens for staking.')
      }
    } else {
      try {
        //@ts-ignore
        await writeStake(stakeConfig?.request)
      } catch (error) {
        console.error('Error during staking:', error)
        alert('Failed to stake tokens.')
      }
    }
  }

  return (
    <div className='space-y-8'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Stake Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a tier' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tiers).map(([key, tier]) => (
                  <SelectItem key={key} value={key}>
                    {tier.name} - {Number(tier.rewardsRate) / 100}% APY
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTier && (
              <div className='rounded-lg border bg-gray-50 p-4 dark:bg-gray-900'>
                <h3 className='mb-2 text-lg font-bold'>{selectedTierData?.name} Tier Details</h3>
                <p className='text-sm'>
                  APY: <span className='font-medium'>{apy}%</span>
                </p>
                <p className='text-sm'>
                  Lock Period: <span className='font-medium'>{lockDuration} days</span>
                </p>
                <p className='text-sm'>
                  Minimum Stake: <span className='font-medium'>${minAmount}</span>
                </p>
                <p className='text-sm'>
                  Maximum Stake: <span className='font-medium'>${maxAmount}</span>
                </p>
              </div>
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

            <div className='bg-primary/10 border-primary rounded-lg border p-4'>
              <div className='text-primary text-sm'>
                Staking Information:
                <ul className='mt-2 list-inside list-disc space-y-1'>
                  <li>Your tokens will be locked for the duration of the selected tier.</li>
                  <li>Early unstaking is not available. Please choose your tier carefully.</li>
                  <li>After the lock period ends, you can withdraw your staked amount plus earned rewards.</li>
                  <li>
                    Match the <span className='font-bold'>value</span> to minimum and maximum stake amounts. Please
                    check before staking.
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={() => handleStake()}
              className='w-full py-3 text-lg'
              disabled={isApproveLoading || isStakeLoading}
            >
              {isApproveLoading
                ? 'Approving...'
                : isStakeLoading
                  ? 'Staking...'
                  : stakingAllowance && stakingAllowance >= parseEther(amount || '0')
                    ? 'Stake'
                    : 'Approve'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
