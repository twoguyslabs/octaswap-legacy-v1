import { Currency } from '@/constants/currency'
import { parseEther } from 'viem'
import { useReadContract } from 'wagmi'
import useAddresses from '../../hooks/useCurrencyAddresses'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import useWrappedPair from '../../hooks/useWrappedPair'

export default function useSwapRate(
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
) {
  const { addressA, addressB } = useAddresses(currencyA, currencyB)

  const input = typeof inputAmount === 'string' ? parseEther(inputAmount) : inputAmount
  const output = typeof outputAmount === 'string' ? parseEther(outputAmount) : outputAmount

  const isWrappedPair = useWrappedPair(currencyA, currencyB)

  const config = {
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
  } as const

  const { data: getAmountsIn } = useReadContract({
    ...config,
    functionName: 'getAmountsIn',
    args: [output, [addressA, addressB]],
    query: {
      enabled: !!output && !isWrappedPair,
    },
  })

  const { data: getAmountsOut } = useReadContract({
    ...config,
    functionName: 'getAmountsOut',
    args: [input, [addressA, addressB]],
    query: {
      enabled: !!input && !isWrappedPair,
    },
  })

  const amountsIn = isWrappedPair ? output : getAmountsIn?.[0]
  const amountsOut = isWrappedPair ? input : getAmountsOut?.[1]

  return { amountsIn, amountsOut }
}
