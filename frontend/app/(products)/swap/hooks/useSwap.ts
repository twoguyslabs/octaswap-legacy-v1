import { Currency } from '@/constants/currency'
import useTradeType from './useTradeType'
import useSwapRate from './useSwapRate'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import { ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'

export default function useSwap(
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  slippage: number,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  deadline: number,
) {
  const { addressA } = useCurrencyAddresses(currencyA, currencyB)

  const { amountsIn, amountsOut } = useSwapRate(inputAmount, outputAmount, currencyA, currencyB)

  const isRouterAllowance = useAllowance(addressA, ROUTER_ADDRESS, inputAmount || amountsIn)

  const { isApprovePayload, handleOnApprove, isApproving, isApproveTxSuccess } = useApprove(
    addressA,
    ROUTER_ADDRESS,
    inputAmount || amountsIn,
  )

  const { isTradeType, handleOnTrade, isSwapping } = useTradeType(
    inputAmount,
    outputAmount,
    amountsIn,
    amountsOut,
    currencyA,
    currencyB,
    slippage,
    deadline,
  )

  return {
    amountsIn,
    amountsOut,
    isRouterAllowance,
    isApprovePayload,
    isApproving,
    isApproveTxSuccess,
    isTradeType,
    isSwapping,
    handleOnApprove,
    handleOnSwap: handleOnTrade,
  }
}
