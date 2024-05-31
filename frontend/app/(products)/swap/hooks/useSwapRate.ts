import { Currency } from '@/constants/currency'
import { NATIVE_TO_WRAPPED } from '@/constants/wrapped'
import { splitCurrencyType } from '@/lib/utils'
import { parseEther } from 'viem'
import { useChainId, useReadContract, useReadContracts } from 'wagmi'
import useAddresses from '../../hooks/useCurrencyAddresses'
import { DECIMALS } from '@/constants/decimals'
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

  const { data: getAmountsIn, isFetching: isFetchingAmountsIn } = useReadContract({
    ...config,
    functionName: 'getAmountsIn',
    args: [output, [addressA, addressB]],
    query: {
      enabled: !!output && !isWrappedPair,
    },
  })

  const { data: getAmountsOut, isFetching: isFetchingAmountsOut } = useReadContract({
    ...config,
    functionName: 'getAmountsOut',
    args: [input, [addressA, addressB]],
    query: {
      enabled: !!input && !isWrappedPair,
    },
  })

  const amountsIn = isWrappedPair ? output : getAmountsIn?.[0]
  const amountsOut = isWrappedPair ? input : getAmountsOut?.[1]

  return { amountsIn, amountsOut, isFetchingAmountsIn, isFetchingAmountsOut }
}
