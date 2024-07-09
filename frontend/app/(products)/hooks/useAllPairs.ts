import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/octaswapFactory'
import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import usePairIndex from './usePairIndex'

export default function useAllPairs() {
  const [allPairs, setAllPairs] = useState<`0x${string}`[]>([])

  const { pairIndex, setPairIndex } = usePairIndex()

  const factoryConfig = {
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
  } as const

  const { data: totalPairs } = useReadContract({
    ...factoryConfig,
    functionName: 'allPairsLength',
  })

  const { data: pairAddress } = useReadContract({
    ...factoryConfig,
    functionName: 'allPairs',
    args: [BigInt(pairIndex)],
  })

  useEffect(() => {
    if (totalPairs && pairAddress && pairIndex < totalPairs) {
      setAllPairs([...allPairs, pairAddress])
      setPairIndex((pi) => pi + 1)
    }
  }, [pairIndex, totalPairs, pairAddress, allPairs, setPairIndex])

  return allPairs
}
