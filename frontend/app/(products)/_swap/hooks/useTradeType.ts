import { Currency } from '@/constants/currency'
import { NATIVE_TO_WRAPPED } from '@/constants/wrapped'
import { splitCurrencyType } from '@/lib/utils'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useAccount, useChainId, useReadContract, useReadContracts, useSimulateContract, useWriteContract } from 'wagmi'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useAddress from '../../../hooks/useAddress'
import useWrapped from '../../hooks/useWrapped'
import { WOCTA_ADDRESS, WOCTA_ABI } from '@/contracts/wocta'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import { toast } from 'sonner'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import useFeeOnTransfer from './useFeeOnTransfer'

export default function useTradeType(
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  amountsIn: bigint | undefined,
  amountsOut: bigint | undefined,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  slippage: number,
  deadline: number,
) {
  const address = useAddress()
  const wrapped = useWrapped()

  const { input: inputUrl, output: outputUrl } = useCurrencyFromUrl()

  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)

  const config = {
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
  } as const

  const input = typeof inputAmount === 'string' ? parseEther(inputAmount) : inputAmount
  const output = typeof outputAmount === 'string' ? parseEther(outputAmount) : outputAmount

  const amountInMax = amountsIn ? amountsIn + (amountsIn * BigInt(slippage)) / BigInt(100) : BigInt(0)
  const amountOutMin = amountsOut ? amountsOut - (amountsOut * BigInt(slippage)) / BigInt(100) : BigInt(0)

  const txDeadline = parseEther(String(deadline))

  const isFeeOnTransfer = useFeeOnTransfer(addressA, address)

  const { data: swapExactTokensForTokensSupportingFeeOnTransferTokens } = useSimulateContract({
    ...config,
    functionName: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    args: [input, amountOutMin, [addressA, addressB], address, txDeadline],
    query: {
      enabled: addressA !== wrapped && addressB !== wrapped,
    },
  })

  const { data: swapExactETHForTokensSupportingFeeOnTransferTokens } = useSimulateContract({
    ...config,
    functionName: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    args: [amountOutMin, [addressA, addressB], address, txDeadline],
    value: input,
  })

  const { data: swapExactTokensForETHSupportingFeeOnTransferTokens } = useSimulateContract({
    ...config,
    functionName: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    args: [input, amountOutMin, [addressA, addressB], address, txDeadline],
  })

  const { data: swapExactTokensForTokens } = useSimulateContract({
    ...config,
    functionName: 'swapExactTokensForTokens',
    args: [input, amountOutMin, [addressA, addressB], address, txDeadline],
    query: {
      enabled: addressA !== wrapped && addressB !== wrapped,
    },
  })

  const { data: swapExactETHForTokens } = useSimulateContract({
    ...config,
    functionName: 'swapExactETHForTokens',
    args: [amountOutMin, [addressA, addressB], address, txDeadline],
    value: input,
  })

  const { data: swapExactTokensForETH } = useSimulateContract({
    ...config,
    functionName: 'swapExactTokensForETH',
    args: [input, amountOutMin, [addressA, addressB], address, txDeadline],
  })

  const { data: swapTokensForExactTokens } = useSimulateContract({
    ...config,
    functionName: 'swapTokensForExactTokens',
    args: [output, amountInMax, [addressA, addressB], address, txDeadline],
    query: {
      enabled: addressA !== wrapped && addressB !== wrapped,
    },
  })

  const { data: swapTokensForExactETH } = useSimulateContract({
    ...config,
    functionName: 'swapTokensForExactETH',
    args: [output, amountInMax, [addressA, addressB], address, txDeadline],
  })

  const { data: swapETHForExactTokens } = useSimulateContract({
    ...config,
    functionName: 'swapETHForExactTokens',
    args: [amountInMax, [addressA, addressB], address, txDeadline],
    value: output,
  })

  const { data: wrapOcta } = useSimulateContract({
    abi: WOCTA_ABI,
    address: WOCTA_ADDRESS,
    functionName: 'deposit',
    value: input,
    query: {
      enabled: !!input,
    },
  })

  const { data: unwrapOcta } = useSimulateContract({
    abi: WOCTA_ABI,
    address: WOCTA_ADDRESS,
    functionName: 'withdraw',
    args: [input],
    query: {
      enabled: !!input,
    },
  })

  const nativeWrapped = inputUrl === currencyA?.symbol && outputUrl === wrapped ? wrapOcta : unwrapOcta

  const tradeType =
    // swapExactTokensForTokensSupportingFeeOnTransferTokens ||
    // swapExactETHForTokensSupportingFeeOnTransferTokens ||
    // swapExactTokensForETHSupportingFeeOnTransferTokens ||
    swapExactTokensForTokens ||
    swapExactETHForTokens ||
    swapExactTokensForETH ||
    swapTokensForExactTokens ||
    swapTokensForExactETH ||
    swapTokensForExactTokens ||
    swapETHForExactTokens ||
    nativeWrapped

  const isTradeType = !!tradeType?.request

  const { writeContractAsync, isPending: isSwapping } = useWriteContract()

  const handleOnTrade = () => {
    // @ts-ignore
    const swap = writeContractAsync(tradeType?.request)

    toast.promise(swap, {
      loading: 'Swapping',
      success: () => `Swapping In progress, please wait...`,
      error: `Swapping error`,
      description: `${currencyA?.symbol} <> ${currencyB?.symbol}`,
      className: 'rounded-lg',
    })
  }

  return { isTradeType, handleOnTrade, isSwapping }
}
