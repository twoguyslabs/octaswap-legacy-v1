import useAddress from '@/app/hooks/useAddress'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { useEffect, useState } from 'react'
import { erc20Abi, formatEther } from 'viem'
import { useReadContract } from 'wagmi'

const OCS_ADDRESS = '0xffb6b2e7d567eddea5f83f42eff1e83163e5aa55'

interface OverviewStatsProps {
  text: string
  value: string
}

function OverviewStats({ text, value }: OverviewStatsProps) {
  return (
    <div>
      <p className='text-sm text-gray-500'>{text}</p>
      <p className='text-xl font-bold'>{value}</p>
    </div>
  )
}

export default function Overview() {
  const address = useAddress()
  const [ocsPrice, setOcsPrice] = useState(0)

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

  const { data: totalUsers } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'totalUsers',
  })

  const { data: totalStaked } = useReadContract({
    abi: erc20Abi,
    address: OCS_ADDRESS,
    functionName: 'balanceOf',
    args: [STAKING_ADDRESS],
  })

  useEffect(() => {
    async function fetchPrice() {
      const response = await fetch(
        `https://api.geckoterminal.com/api/v2/simple/networks/octaspace/token_price/${OCS_ADDRESS}`,
      )
      const data = await response.json()
      setOcsPrice(data.data.attributes.token_prices[OCS_ADDRESS])
    }
    fetchPrice()
  }, [])

  const [tier, amountStaked, updatedAt] = stakeOf ?? []

  const apy = Number(tier?.rewardsRate) / 100
  const staked = formatEther(amountStaked ?? BigInt(0))
  const pendingRewards = Number(formatEther(earned ?? BigInt(0))).toFixed(7)
  const lockDurationInSeconds = Number(tier?.lockDuration)
  const lastUpdatedTimestamp = Number(updatedAt)
  const currentTimestamp = Math.floor(Date.now() / 1000)

  const remainingLockDuration = Math.max(0, lastUpdatedTimestamp + lockDurationInSeconds - currentTimestamp)
  const remainingLockDays = Math.ceil(remainingLockDuration / (24 * 60 * 60))

  const elapsedTime = currentTimestamp - lastUpdatedTimestamp
  const progressPercentage = Math.min(100, Math.max(0, (elapsedTime / lockDurationInSeconds) * 100))

  const formattedTotalUsers = Number(totalUsers).toString()
  const formattedTotalStaked = formatEther(totalStaked ?? BigInt(0))
  const tvl = (+formattedTotalStaked * ocsPrice).toFixed(0)

  return (
    <div className='space-y-6'>
      <Card className='shadow-lg'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-2xl font-bold'>Your Stake</h2>
          <div className='grid grid-cols-2 gap-y-4'>
            <OverviewStats text='Current Tier' value={isStaking ? (tier?.name as string) : '-'} />
            <OverviewStats text='APY' value={isStaking ? `${apy}%` : '-'} />
            <OverviewStats text='Staked Amount' value={isStaking ? staked : '-'} />
            <OverviewStats text='Pending Rewards' value={isStaking ? pendingRewards : '-'} />
          </div>
          <div className='mt-4'>
            <p className='mb-2 text-sm text-gray-500'>Lock Duration Remaining</p>
            <Progress value={isStaking ? progressPercentage : 0} />
            <p className='mt-2 text-sm'>{isStaking ? remainingLockDays : '0'} days left</p>
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-lg'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-2xl font-bold'>Global Staking</h2>
          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <OverviewStats text='Total Users Staking' value={formattedTotalUsers} />
            <OverviewStats text='Total Staked Tokens' value={formattedTotalStaked} />
            <OverviewStats text='Total Value Locked' value={`$${tvl}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
