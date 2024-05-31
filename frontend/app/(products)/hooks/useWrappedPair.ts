import { Currency } from '@/constants/currency'
import useCurrencyAddresses from './useCurrencyAddresses'
import useWrapped from './useWrapped'

export default function useWrappedPair(inputCurrency: Currency | undefined, outputCurrency: Currency | undefined) {
  const wrapped = useWrapped()

  const {
    nativeA: nativeInput,
    nativeB: nativeOutput,
    tokenA: tokenInput,
    tokenB: tokenOutput,
  } = useCurrencyAddresses(inputCurrency, outputCurrency)

  const isWrappedPair =
    (nativeInput && tokenOutput?.address === wrapped) || (nativeOutput && tokenInput?.address === wrapped)

  return isWrappedPair
}
