import { Button } from '@/components/ui/button'
import { Currency } from '@/constants/currency'
import usePair from '../../hooks/usePair'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useWrapped from '../../hooks/useWrapped'

export default function LiquidityButton({
  inputCurrency,
  outputCurrency,
  isRouterAllowanceA,
  isRouterAllowanceB,
  isApprovePayloadA,
  isApprovePayloadB,
  isApprovingA,
  isApprovingB,
  isLiquidityType,
  isAddingLiquidity,
  onHandleApproveA,
  onHandleApproveB,
  onHandleAdd,
}: {
  inputCurrency: Currency | undefined
  outputCurrency: Currency | undefined
  isRouterAllowanceA: boolean
  isRouterAllowanceB: boolean
  isApprovePayloadA: boolean
  isApprovePayloadB: boolean
  isApprovingA: boolean
  isApprovingB: boolean
  isLiquidityType: boolean
  isAddingLiquidity: boolean
  onHandleApproveA: () => void
  onHandleApproveB: () => void
  onHandleAdd: () => void
}) {
  const wrapped = useWrapped()
  const { isPairAddress } = usePair(inputCurrency, outputCurrency)
  const { addressA, addressB } = useCurrencyAddresses(inputCurrency, outputCurrency)

  const getDisabledState = () => {
    if (isRouterAllowanceA && isRouterAllowanceB) {
      return !isLiquidityType || isAddingLiquidity
    } else if (addressA === wrapped) {
      return !isApprovePayloadB || isApprovingB
    } else if (addressB === wrapped) {
      return !isApprovePayloadA || isApprovingA
    } else {
      return !isApprovePayloadA || isApprovingA || !isApprovePayloadB || isApprovingB
    }
  }

  const getOnClick = () => {
    if (isPairAddress) {
      if (isRouterAllowanceA && isRouterAllowanceB) {
        return onHandleAdd
      } else {
        return isRouterAllowanceA ? onHandleApproveB : onHandleApproveA
      }
    } else {
      if (isRouterAllowanceA && isRouterAllowanceB) {
        return onHandleAdd
      } else {
        return isRouterAllowanceA ? onHandleApproveB : onHandleApproveA
      }
    }
  }

  const getButtonText = () => {
    if (isPairAddress) {
      if (isRouterAllowanceA && isRouterAllowanceB) {
        return 'Add liquidity'
      } else {
        return isRouterAllowanceA ? `Approve ${outputCurrency?.symbol}` : `Approve ${inputCurrency?.symbol}`
      }
    } else {
      if (isRouterAllowanceA && isRouterAllowanceB) {
        return 'Add liquidity'
      } else {
        return isRouterAllowanceA ? `Approve ${outputCurrency?.symbol}` : `Approve ${inputCurrency?.symbol}`
      }
    }
  }

  const disabledState = getDisabledState()
  const onClick = getOnClick()
  const buttonText = getButtonText()

  return (
    <Button className='w-full' disabled={disabledState} onClick={onClick}>
      {buttonText}
    </Button>
  )
}
