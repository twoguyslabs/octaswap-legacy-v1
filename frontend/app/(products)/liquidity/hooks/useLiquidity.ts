import { Currency } from '@/constants/currency'
import useLiquidityRate from './useLiquidityRate'
import useAllowance from '../../hooks/useAllowance'
import { ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import useApprove from '../../hooks/useApprove'
import useLiquidityType from './useLiquidityType'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'

export default function useLiquidity(
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  slippage: number,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  deadline: number,
) {
  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)

  const { quoteIn, quoteOut, isFetchingQuoteIn, isFetchingQuoteOut, quoteInPerOne, quoteOutPerOne } = useLiquidityRate(
    inputAmount,
    outputAmount,
    currencyA,
    currencyB,
  )

  const isRouterAllowanceA = useAllowance(addressA, ROUTER_ADDRESS, inputAmount || quoteIn)
  const isRouterAllowanceB = useAllowance(addressB, ROUTER_ADDRESS, outputAmount || quoteOut)

  const {
    isApprovePayload: isApprovePayloadA,
    handleOnApprove: handleOnApproveA,
    isApproving: isApprovingA,
    isApproveTxSuccess: isApproveTxSuccessA,
  } = useApprove(addressA, ROUTER_ADDRESS, inputAmount || quoteIn)

  const {
    isApprovePayload: isApprovePayloadB,
    handleOnApprove: handleOnApproveB,
    isApproving: isApprovingB,
    isApproveTxSuccess: isApproveTxSuccessB,
  } = useApprove(addressB, ROUTER_ADDRESS, outputAmount || quoteOut)

  const { isLiquidityType, isAddingLiquidity, handleOnAdd } = useLiquidityType(
    currencyA,
    currencyB,
    inputAmount,
    outputAmount,
    quoteIn,
    quoteOut,
    slippage,
    deadline,
  )

  return {
    quoteIn,
    quoteOut,
    isFetchingQuoteIn,
    isFetchingQuoteOut,
    quoteInPerOne,
    quoteOutPerOne,
    isRouterAllowanceA,
    isRouterAllowanceB,
    isApprovePayloadA,
    isApprovePayloadB,
    isApprovingA,
    isApprovingB,
    isApproveTxSuccessA,
    isApproveTxSuccessB,
    isLiquidityType,
    isAddingLiquidity,
    handleOnApproveA,
    handleOnApproveB,
    handleOnAdd,
  }
}
