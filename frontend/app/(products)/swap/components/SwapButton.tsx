import { Button } from '@/components/ui/button'
import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import useWrapped from '../../hooks/useWrapped'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import usePair from '../../hooks/usePair'
import useWrappedPair from '../../hooks/useWrappedPair'

export default function SwapButton({
  inputCurrency,
  outputCurrency,
  isRouterAllowance,
  isApprovePayload,
  isApproving,
  isApproveTxSuccess,
  isTradeType,
  isSwapping,
  onApprove,
  onSwap,
}: {
  inputCurrency: Currency | undefined
  outputCurrency: Currency | undefined
  isRouterAllowance: boolean
  isApprovePayload: boolean
  isApproving: boolean
  isApproveTxSuccess: boolean
  isTradeType: boolean
  isSwapping: boolean
  onApprove: () => void
  onSwap: () => void
}) {
  const { nativeA: nativeInput } = useCurrencyAddresses(inputCurrency, outputCurrency)

  const isWrappedPair = useWrappedPair(inputCurrency, outputCurrency)
  const { isPairAddress } = usePair(inputCurrency, outputCurrency)

  const isPair = isWrappedPair ? false : !isPairAddress

  const getDisabledState = () => {
    if (isRouterAllowance) {
      return !isTradeType || isSwapping || isPair
    } else {
      return !isApprovePayload || isApproving || isPair
    }
  }

  const getOnClick = () => {
    if (isRouterAllowance) {
      return onSwap
    } else {
      return onApprove
    }
  }

  const getButtonText = () => {
    if (isWrappedPair) {
      if (nativeInput) {
        return 'Wrap'
      } else {
        return 'Unwrap'
      }
    } else if (!isPairAddress) {
      return 'No liquidity'
    } else {
      return isRouterAllowance ? 'Swap' : 'Approve'
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
