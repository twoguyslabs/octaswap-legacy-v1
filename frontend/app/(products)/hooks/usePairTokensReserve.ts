import { formatEther } from 'viem'
import usePoolShare from '../_liquidity/hooks/usePoolShare'
import useErcPairBalance from './useErcPairBalance'
import usePairReserves from './usePairReserves'

export default function usePairTokensReserve(pairAddress: `0x${string}` | undefined) {
  const pairBalance = useErcPairBalance(pairAddress) ?? BigInt(0)
  const { reserve0, reserve1 } = usePairReserves({ pairAddress })
  const poolShare = usePoolShare(pairAddress, Number(formatEther(pairBalance)))

  const token0Reserve = poolShare * Number(formatEther(reserve0))
  const token1Reserve = poolShare * Number(formatEther(reserve1))

  return { token0Reserve, token1Reserve }
}
