import { PAIR_ABI } from '@/contracts/pair'
import { useReadContract } from 'wagmi'

export default function usePairTokens(pairAddress: `0x${string}`) {
  const pairConfig = {
    abi: PAIR_ABI,
    address: pairAddress,
  } as const

  const { data: token0 } = useReadContract({
    ...pairConfig,
    functionName: 'token0',
  })

  const { data: token1 } = useReadContract({
    ...pairConfig,
    functionName: 'token1',
  })

  return { token0, token1 }
}
