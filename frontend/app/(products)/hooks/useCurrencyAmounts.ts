import { useState } from 'react'
import usePair from './usePair'
import { Currency } from '@/constants/currency'

export default function useCurrencyAmounts(currencyA?: Currency | undefined, currencyB?: Currency | undefined) {
  const [inputAmount, setInputAmount] = useState<string | bigint>('')
  const [outputAmount, setOutputAmount] = useState<string | bigint>('')

  const { isPairAddress } = usePair(currencyA, currencyB)

  const isValidAmount = (amount: string | bigint): boolean => {
    if (typeof amount === 'bigint') {
      return true // Assume bigint values are always valid
    }

    const regex = /^[0-9.]*$/
    return regex.test(amount)
  }

  const handleInputAmount = (amount: string | bigint) => {
    if (!isValidAmount(amount)) {
      console.error('Invalid input amount')
      return // Exit the function if the amount is not valid
    }

    if (isPairAddress && outputAmount) {
      setOutputAmount('')
      setInputAmount(amount)
    } else {
      setInputAmount(amount)
    }
  }

  const handleOutputAmount = (amount: string | bigint) => {
    if (!isValidAmount(amount)) {
      console.error('Invalid input amount')
      return // Exit the function if the amount is not valid
    }

    if (isPairAddress && inputAmount) {
      setInputAmount('')
      setOutputAmount(amount)
    } else {
      setOutputAmount(amount)
    }
  }

  return { inputAmount, outputAmount, setInputAmount: handleInputAmount, setOutputAmount: handleOutputAmount }
}
