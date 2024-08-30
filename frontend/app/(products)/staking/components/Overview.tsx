import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import useStakingData from '../hooks/useStakingData'
import { calculateLockDuration, cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpRight, Users, Coins, DollarSign, MedalIcon } from 'lucide-react'
import LockDuration from './LockDuration'

interface StatsProps {
  icon: React.ReactNode
  text: string
  value: string | undefined
}

interface GlobalInfo {
  formattedTotalUsers: string
  formattedTotalStaked: string
  tvl: string
}

function GlobalStakingStats({ icon, text, value }: StatsProps) {
  return (
    <div className='bg-secondary/50 flex items-center gap-x-2 rounded-lg p-3 last:col-span-full'>
      <div className='text-primary p-1'>{icon}</div>
      <div>
        <p className='text-muted-foreground text-sm'>{text}</p>
        <p className='text-xl font-bold'>{value}</p>
      </div>
    </div>
  )
}

function YourStakeStats({ text, value, icon }: StatsProps) {
  return (
    <div className='bg-secondary/50 flex items-center gap-x-2 rounded-lg p-3'>
      <div className='text-primary p-1'>{icon}</div>
      <div>
        <p className='text-muted-foreground text-sm'>{text}</p>
        <p className={cn('text-xl font-bold', text === 'Pending Rewards' && 'text-yellow-400')}>
          {value ? value : '-'}
        </p>
      </div>
    </div>
  )
}

function GlobalStaking({ globalInfo }: { globalInfo: GlobalInfo | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-3xl'>Global Staking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2'>
          <GlobalStakingStats
            text='Total Users Staking'
            value={globalInfo?.formattedTotalUsers}
            icon={<Users className='h-7 w-7' />}
          />
          <GlobalStakingStats
            text='Total Value Locked'
            value={`$${globalInfo?.tvl}`}
            icon={<DollarSign className='h-7 w-7' />}
          />
          <GlobalStakingStats
            text='Total Staked Tokens'
            value={globalInfo?.formattedTotalStaked}
            icon={<Coins className='h-7 w-7' />}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function YourStake({
  tier,
  isStaking,
  apy,
  staked,
  pendingRewards,
  remainingLockDays,
  progressPercentage,
}: {
  tier: Tier | undefined
  isStaking: boolean | undefined
  apy: number | undefined
  staked: string | undefined
  pendingRewards: string | undefined
  remainingLockDays: number | undefined
  progressPercentage: number | undefined
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-3xl'>Your Stake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2'>
          <YourStakeStats text='Current Tier' value={tier?.name} icon={<MedalIcon className='h-7 w-7' />} />
          <YourStakeStats
            text='APY'
            value={isStaking ? `${apy}%` : apy?.toString()}
            icon={<ArrowUpRight className='h-7 w-7' />}
          />
          <YourStakeStats text='Staked Amount' value={staked} icon={<Coins className='h-7 w-7' />} />
          <YourStakeStats text='Pending Rewards' value={pendingRewards} icon={<DollarSign className='h-7 w-7' />} />
        </div>
        <LockDuration remainingLockDays={remainingLockDays ?? 0} progressPercentage={progressPercentage ?? 0} />
      </CardContent>
    </Card>
  )
}

export default function Overview() {
  const { data, isLoading, error } = useStakingData()

  const { isStaking, tier, amountStaked, earned, updatedAt, totalUsers, totalStaked, ocsPrice } = data || {}

  const stakingInfo = useMemo(() => {
    if (!isStaking || !tier || !amountStaked || !earned || !updatedAt) return null

    const apy = Number(tier.rewardsRate) / 100
    const staked = formatEther(amountStaked)
    const pendingRewards = Number(formatEther(earned)).toFixed(7)

    const { remainingLockDays, progressPercentage } = calculateLockDuration(
      Number(tier.lockDuration),
      Number(updatedAt),
    )

    return {
      apy,
      staked,
      pendingRewards,
      remainingLockDays,
      progressPercentage,
    }
  }, [isStaking, tier, amountStaked, earned, updatedAt])

  const globalInfo = useMemo(() => {
    if (!totalUsers?.result || !totalStaked?.result || !ocsPrice) return null

    const formattedTotalUsers = Number(totalUsers?.result).toString()
    const formattedTotalStaked = formatEther(totalStaked?.result)
    const tvl = (+formattedTotalStaked * ocsPrice).toFixed(0)

    return {
      formattedTotalUsers,
      formattedTotalStaked,
      tvl,
    }
  }, [totalUsers, totalStaked, ocsPrice])

  if (isLoading)
    return (
      <div className='space-y-6'>
        <Card>
          <CardContent className='p-6'>
            <Skeleton className='mb-4 h-8 w-1/3 bg-gray-300 dark:bg-gray-700' />
            <div className='grid gap-4 sm:grid-cols-2'>
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className='h-20 w-full bg-gray-300 dark:bg-gray-700' />
              ))}
            </div>
            <Skeleton className='mt-6 h-4 w-full bg-gray-300 dark:bg-gray-700' />
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <Skeleton className='mb-4 h-8 w-1/3 bg-gray-300 dark:bg-gray-700' />
            <div className='space-y-4'>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className='h-20 w-full bg-gray-300 dark:bg-gray-700' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )

  if (error) return <div className='text-destructive'>Error: {error.message}</div>

  return (
    <div className='space-y-6'>
      <YourStake
        tier={tier}
        isStaking={isStaking?.result}
        apy={stakingInfo?.apy}
        staked={stakingInfo?.staked}
        pendingRewards={stakingInfo?.pendingRewards}
        remainingLockDays={stakingInfo?.remainingLockDays}
        progressPercentage={stakingInfo?.progressPercentage}
      />
      <GlobalStaking globalInfo={globalInfo} />
    </div>
  )
}
