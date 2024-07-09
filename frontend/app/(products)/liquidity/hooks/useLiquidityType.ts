import { Currency } from '@/constants/currency'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import { useSimulateContract, useWriteContract } from 'wagmi'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import { parseEther } from 'viem'
import useAddress from '@/app/hooks/useAddress'
import useWrapped from '../../hooks/useWrapped'
import { toast } from 'sonner'

export default function useLiquidityType(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  quoteIn: bigint | undefined,
  quoteOut: bigint | undefined,
  slippage: number,
  deadline: number,
) {
  const address = useAddress()
  const wrapped = useWrapped()

  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)

  const input = typeof inputAmount === 'string' ? parseEther(inputAmount) : inputAmount
  const output = typeof outputAmount === 'string' ? parseEther(outputAmount) : outputAmount

  // const amountAMin = quoteIn ? quoteIn - (quoteIn * BigInt(slippage)) / BigInt(100) : BigInt(0)
  // const amountBMin = quoteOut ? quoteOut - (quoteOut * BigInt(slippage)) / BigInt(100) : BigInt(0)

  const txDeadline = parseEther(String(deadline))

  const toAddWithETH =
    addressA === wrapped
      ? {
          token: addressB,
          tokenAmount: (quoteOut ?? BigInt(0)) || output,
          tokenAmountMin: BigInt(0),
          ethAmount: input || quoteIn,
          ethAmountMin: BigInt(0),
        }
      : {
          token: addressA,
          tokenAmount: (quoteIn ?? BigInt(0)) || input,
          tokenAmountMin: BigInt(0),
          ethAmount: output || quoteOut,
          ethAmountMin: BigInt(0),
        }

  const config = {
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
  } as const

  const { data: addLiquidity } = useSimulateContract({
    ...config,
    functionName: 'addLiquidity',
    args: [
      addressA,
      addressB,
      input || (quoteIn ?? BigInt(0)),
      output || (quoteOut ?? BigInt(0)),
      BigInt(0),
      BigInt(0),
      address,
      txDeadline,
    ],
    query: {
      enabled: addressA !== wrapped && addressB !== wrapped,
    },
  })

  const { data: addLiquidityETH } = useSimulateContract({
    ...config,
    functionName: 'addLiquidityETH',
    args: [
      toAddWithETH.token,
      toAddWithETH.tokenAmount,
      toAddWithETH.tokenAmountMin,
      toAddWithETH.ethAmountMin,
      address,
      txDeadline,
    ],
    value: toAddWithETH.ethAmount,
  })

  const liquidityType = addLiquidity || addLiquidityETH
  const isLiquidityType = !!liquidityType?.request

  const { writeContractAsync, isPending: isAddingLiquidity } = useWriteContract()

  const handleOnAdd = () => {
    // @ts-ignore
    const addLiquidity = writeContractAsync(liquidityType?.request)

    toast.promise(addLiquidity, {
      loading: 'Adding',
      success: () => `Adding In progress, please wait...`,
      error: `Adding liquidity error`,
      description: `${currencyA?.symbol} <> ${currencyB?.symbol}`,
      className: 'rounded-lg',
    })
  }

  return { isLiquidityType, isAddingLiquidity, handleOnAdd }
}
