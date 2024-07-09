import useAddress from '@/app/hooks/useAddress'
import { PAIR_ERC_ABI } from '@/contracts/pairerc'
import { useReadContract } from 'wagmi'

export default function useErcPairBalance(pairAddress: `0x${string}` | undefined) {
  const address = useAddress()

  const { data: pairBalance } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'balanceOf',
    args: [address],
  })

  return pairBalance
}
