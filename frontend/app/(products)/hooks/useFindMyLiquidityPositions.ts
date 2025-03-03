import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import useAllPairs from './useAllPairs'
import useErcPairBalance from './useErcPairBalance'
import usePairIndex from './usePairIndex'
import usePoolShare from '../_liquidity/hooks/usePoolShare'
import { erc20Abi, formatEther } from 'viem'
import usePairTokens from './usePairTokens'
import usePairTokensReserve from './usePairTokensReserve'

export default function useFindMyliquidityPosition() {
  const [myLiquidityPositions, setMyLiquidityPositions] = useState<LiquidityPosition[]>([])

  const { pairIndex, setPairIndex } = usePairIndex()
  const allPairs = useAllPairs()

  const totalPairs = allPairs.length
  const pairAddress = allPairs[pairIndex]

  const { token0, token1 } = usePairTokens(pairAddress)
  const pairBalance = useErcPairBalance(pairAddress)
  const poolShare = usePoolShare(pairAddress, Number(formatEther(pairBalance ?? BigInt(0))))
  const { token0Reserve: myReserveA, token1Reserve: myReserveB } = usePairTokensReserve(pairAddress)

  const { data: token0Symbol } = useReadContract({
    abi: erc20Abi,
    address: token0,
    functionName: 'symbol',
  })

  const { data: token1Symbol } = useReadContract({
    abi: erc20Abi,
    address: token1,
    functionName: 'symbol',
  })

  useEffect(() => {
    if (
      pairAddress &&
      pairBalance &&
      token0 &&
      token1 &&
      token0Symbol &&
      token1Symbol &&
      myReserveA &&
      myReserveB &&
      poolShare
    ) {
      setMyLiquidityPositions([
        ...myLiquidityPositions,
        {
          pairAddress,
          totalPoolTokens: pairBalance,
          token0Address: token0,
          token1Address: token1,
          token0Symbol: token0Symbol,
          token1Symbol: token1Symbol,
          pooledToken0: myReserveA,
          pooledToken1: myReserveB,
          poolShare,
        },
      ])

      if (pairIndex < totalPairs) {
        setPairIndex((pi) => pi + 1)
      }
    } else if (typeof pairBalance === 'bigint' && pairBalance === BigInt(0)) {
      if (pairIndex < totalPairs) {
        setPairIndex((pi) => pi + 1)
      }
    }
  }, [
    pairIndex,
    totalPairs,
    pairBalance,
    myLiquidityPositions,
    setPairIndex,
    pairAddress,
    token0,
    token1,
    myReserveA,
    myReserveB,
    poolShare,
    token0Symbol,
    token1Symbol,
  ])

  return myLiquidityPositions
}
