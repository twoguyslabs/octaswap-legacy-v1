import { Currency } from '@/constants/currency'
import useSlippage from '../../hooks/useSlippage'
import useDeadline from '../../hooks/useDeadline'
import useTradeType from './useTradeType'
import { parseEther } from 'viem'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useSwapRate from './useSwapRate'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useWriteContract } from 'wagmi'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import { ROUTER_ADDRESS } from '@/contracts/octaswapRouter'

export default function useSwap(
  inputAmount: string | bigint,
  outputAmount: string | bigint,
  slippage: number,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  deadline: number,
) {
  const { amountsIn, amountsOut } = useSwapRate(inputAmount, outputAmount, currencyA, currencyB)

  const isRouterAllowance = useAllowance(currencyA, ROUTER_ADDRESS, inputAmount || amountsIn)
  const { isApprovePayload, handleOnApprove, isApproving, isApproveTxSuccess } = useApprove(
    currencyA,
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
