import { PAIR_ERC_ABI } from '@/contracts/pairerc'
import { useReadContract } from 'wagmi'

export default function usePairTotalSupply(pairAddress: `0x${string}` | undefined) {
  const { data: totalSupply } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 500,
    },
  })

  const pairTotalSupply = totalSupply ?? BigInt(0)

  return pairTotalSupply
}
