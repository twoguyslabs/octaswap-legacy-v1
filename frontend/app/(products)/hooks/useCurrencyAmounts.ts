import { useState } from 'react'
import usePair from './usePair'
import { Currency } from '@/constants/currency'
import usePairReserves from './usePairReserves'

export default function useCurrencyAmounts(currencyA?: Currency | undefined, currencyB?: Currency | undefined) {
  const [inputAmount, setInputAmount] = useState<string | bigint>('')
  const [outputAmount, setOutputAmount] = useState<string | bigint>('')

  const { isPairAddress, pairAddress } = usePair(currencyA, currencyB)
  const { reserve0, reserve1 } = usePairReserves({ pairAddress })

  const isValidAmount = (amount: string | bigint): boolean => {
    if (typeof amount === 'bigint') {
      return true
    }

    const regex = /^[0-9.]*$/
    return regex.test(amount)
  }

  const handleInputAmount = (amount: string | bigint) => {
    if (!isValidAmount(amount)) {
      console.error('Invalid input amount')
      return
    }

    if (isPairAddress && reserve0 && reserve1 && outputAmount) {
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

    if (isPairAddress && reserve0 && reserve1 && inputAmount) {
      setInputAmount('')
      setOutputAmount(amount)
    } else {
      setOutputAmount(amount)
    }
  }

  return { inputAmount, outputAmount, setInputAmount: handleInputAmount, setOutputAmount: handleOutputAmount }
}
