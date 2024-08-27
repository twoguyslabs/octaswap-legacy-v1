import { Currency } from '@/constants/currency'
import { useReadContract } from 'wagmi'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import { parseEther } from 'viem'
import { sortCurrency } from '@/lib/utils'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import usePairReserves from '../../hooks/usePairReserves'
import usePair from '../../hooks/usePair'

export default function useLiquidityRate(
  amountA: string | bigint,
  amountB: string | bigint,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
) {
  const { isPairAddress } = usePair(currencyA, currencyB)
  const { reserve0: reserveIn, reserve1: reserveOut } = usePairReserves({ currencyA, currencyB })

  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)
  const { reserve0, reserve1 } = sortCurrency(reserveIn, addressA, reserveOut, addressB)

  const amtA = typeof amountA === 'string' ? parseEther(amountA) : amountA
  const amtB = typeof amountB === 'string' ? parseEther(amountB) : amountB

  const {
    data: quoteIn,
    refetch: refetchQuoteIn,
    isFetching: isFetchingQuoteIn,
  } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amtB, reserve1, reserve0],
    query: {
      enabled: isPairAddress && !!amtB,
    },
  })

  const {
    data: quoteOut,
    refetch: refetchQuoteOut,
    isFetching: isFetchingQuoteOut,
  } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amtA, reserve0, reserve1],
    query: {
      enabled: isPairAddress && !!amtA,
    },
  })

  const { data: quoteInPerOne } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserve1, reserve0],
  })

  const { data: quoteOutPerOne } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserve0, reserve1],
  })

  return {
    quoteIn,
    quoteOut,
    refetchQuoteIn,
    refetchQuoteOut,
    isFetchingQuoteIn,
    isFetchingQuoteOut,
    quoteInPerOne,
    quoteOutPerOne,
  }
}
