import useAddress from '@/app/hooks/useAddress'
import { Currency } from '@/constants/currency'
import usePair from '../../hooks/usePair'
import { useReadContract } from 'wagmi'
import { PAIR_ERC_ABI } from '@/contracts/pairerc'
import { formatEther, zeroAddress } from 'viem'
import usePairTotalSupply from '../../hooks/usePairTotalSupply'

export default function usePoolShare(pairAddress: `0x${string}` | undefined, liquidityToken: number) {
  const isPairAddress = pairAddress !== zeroAddress
  const pairTotalSupply = usePairTotalSupply(pairAddress)

  const poolShare = isPairAddress
    ? liquidityToken / Number(formatEther(pairTotalSupply))
    : liquidityToken / liquidityToken

  return poolShare
}
