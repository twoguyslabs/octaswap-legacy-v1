import { CurrencyState } from '@/constants/currency'
import { useEffect, useState } from 'react'
import useCurrencyList from './useCurrencyList'

export default function useCurrency(input?: string) {
  const [currencyInput, setCurrencyInput] = useState('')
  const [currency, setCurrency] = useState<CurrencyState>({ selectorState: false })

  const currencyList = useCurrencyList()

  const initCurrency = currencyList?.find(
    (curr) => curr.symbol === currencyInput || ('address' in curr && curr.address === currencyInput),
  )

  useEffect(() => {
    if (input) {
      setCurrencyInput(input)
    } else {
      setCurrencyInput('')
    }
  }, [input])

  useEffect(() => {
    if (initCurrency) {
      setCurrency((c) => ({ ...c, currency: initCurrency }))
    } else {
      setCurrency({ selectorState: false })
    }
  }, [initCurrency])

  return { currency, setCurrency }
}
