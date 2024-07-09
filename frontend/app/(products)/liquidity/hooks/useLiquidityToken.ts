import { Currency } from '@/constants/currency'
import usePair from '../../hooks/usePair'
import usePairReserves from '../../hooks/usePairReserves'
import usePairTotalSupply from '../../hooks/usePairTotalSupply'
import { formatEther, parseEther } from 'viem'
import { useReadContract } from 'wagmi'
import { PAIR_ERC_ABI } from '@/contracts/pairerc'
import useAddress from '@/app/hooks/useAddress'

export default function useLiquidityToken(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  amountA: string | bigint | undefined,
  amountB: string | bigint | undefined,
) {
  const address = useAddress()

  const inputAmount = typeof amountA === 'bigint' ? formatEther(amountA) : amountA
  const outputAmount = typeof amountB === 'bigint' ? formatEther(amountB) : amountB

  const { pairAddress, isPairAddress } = usePair(currencyA, currencyB)
  const { reserve0, reserve1 } = usePairReserves({ currencyA, currencyB })
  const pairTotalSupply = usePairTotalSupply(pairAddress)

  const newlyMintedLp = Math.sqrt(Number(inputAmount) * Number(outputAmount))

  const mintExistingLp = Math.min(
    (Number(inputAmount) * Number(formatEther(pairTotalSupply))) / Number(formatEther(reserve0)),
    (Number(outputAmount) * Number(formatEther(pairTotalSupply))) / Number(formatEther(reserve1)),
  )

  const totalLiquidityTokenToAdd = !!amountA && !!amountB ? (isPairAddress ? mintExistingLp : newlyMintedLp) : 0

  const { data: myPairLiquidityToken } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      refetchInterval: 500,
    },
  })

  return { totalLiquidityTokenToAdd, myPairLiquidityToken }
}
