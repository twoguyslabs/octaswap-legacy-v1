import useAddress from '@/app/hooks/useAddress'
import { OCS_ADDRESS } from '@/contracts/ocs'
import { STAKING_ABI, STAKING_ADDRESS } from '@/contracts/staking'
import { useEffect, useState } from 'react'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { useOcsPrice } from '../../hooks/usePrice'

export default function useStakingData() {
  const address = useAddress()
  const ocsPrice = useOcsPrice()

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'isStaking',
        args: [address],
      },
      {
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'stakeOf',
        args: [address],
      },
      {
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'earned',
        args: [address],
      },
      {
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'totalUsers',
      },
      {
        abi: erc20Abi,
        address: OCS_ADDRESS,
        functionName: 'balanceOf',
        args: [STAKING_ADDRESS],
      },
    ],
  })

  if (isLoading || error || !data) {
    return { isLoading, error, data: null }
  }

  const [isStaking, stakeOf, earned, totalUsers, totalStaked] = data

  return {
    isLoading: false,
    error: null,
    data: {
      isStaking,
      tier: stakeOf?.result?.[0],
      amountStaked: stakeOf?.result?.[1],
      updatedAt: stakeOf?.result?.[2],
      earned: earned?.result,
      totalUsers,
      totalStaked,
      ocsPrice,
    },
  }
}
