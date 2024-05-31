import { Button } from '@/components/ui/button'
import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import useWrapped from '../../hooks/useWrapped'
import useCurrencyAddresses from '../../hooks/useCurrencyAddresses'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import usePair from '../../hooks/usePair'

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
  const wrapped = useWrapped()

  const {
    nativeA: nativeInput,
    nativeB: nativeOutput,
    tokenA: tokenInput,
    tokenB: tokenOutput,
  } = useCurrencyAddresses(inputCurrency, outputCurrency)

  const { isPairAddress } = usePair(inputCurrency, outputCurrency)

  const isNativeWrappedPair =
    (nativeInput && tokenOutput?.address === wrapped) || (nativeOutput && tokenInput?.address === wrapped)

  const getDisabledState = () => {
    if (isRouterAllowance) {
      return !isTradeType || isSwapping || !isPairAddress
    } else {
      return !isApprovePayload || isApproving || !isPairAddress
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
    if (isNativeWrappedPair) {
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
