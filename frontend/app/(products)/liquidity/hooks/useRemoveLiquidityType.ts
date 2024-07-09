import { Currency } from '@/constants/currency'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import { useSimulateContract, useWriteContract } from 'wagmi'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useAddress from '@/app/hooks/useAddress'
import { parseEther } from 'viem'
import useWrapped from '../../hooks/useWrapped'
import { toast } from 'sonner'

export default function useRemoveLiquidityType(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  liquidityToken: bigint | undefined,
) {
  const address = useAddress()
  const wrapped = useWrapped()

  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)

  const tokenToRemoveWithEth = addressA === wrapped ? addressB : addressA
  const liquidity = liquidityToken ?? BigInt(0)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes from now

  const config = {
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
  } as const

  const { data: removeLiquidity } = useSimulateContract({
    ...config,
    functionName: 'removeLiquidity',
    args: [addressA, addressB, liquidity, BigInt(0), BigInt(0), address, BigInt(deadline)],
  })

  const { data: removeLiquidityETH } = useSimulateContract({
    ...config,
    functionName: 'removeLiquidityETH',
    args: [tokenToRemoveWithEth, liquidity, BigInt(0), BigInt(0), address, BigInt(deadline)],
  })

  const removeLiquidityType = removeLiquidity || removeLiquidityETH
  const isRemoveLiquidityType = !!removeLiquidityType?.request

  const { writeContractAsync, isPending: isRemovingLiquidity } = useWriteContract()

  const handleOnRemove = () => {
    // @ts-ignore
    const removeLiquidity = writeContractAsync(removeLiquidityType?.request)

    toast.promise(removeLiquidity, {
      loading: 'Removing',
      success: () => `Removing In progress, please wait...`,
      error: `Removing liquidity error`,
      description: `${currencyA?.symbol} <> ${currencyB?.symbol}`,
      className: 'rounded-lg',
    })
  }

  return { isRemoveLiquidityType, isRemovingLiquidity, handleOnRemove }
}
