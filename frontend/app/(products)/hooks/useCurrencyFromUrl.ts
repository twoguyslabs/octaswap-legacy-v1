import useCreateQueryString from '@/app/hooks/useCreateQueryString'
import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function useCurrencyFromUrl() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const inputCurrency = searchParams.get('inputCurrency')
  const outputCurrency = searchParams.get('outputCurrency')

  const handleReplace = (queryString: string, currency: Currency | undefined) => {
    const { token, native } = splitCurrencyType(currency)
    router.replace(pathname + '?' + createQueryString(queryString, token?.address || native?.symbol))
  }

  const handleReplaceAll = (
    queryStringA: string,
    queryStringB: string,
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
  ) => {
    const { token: tokenA, native: nativeA } = splitCurrencyType(currencyA)
    const { token: tokenB, native: nativeB } = splitCurrencyType(currencyB)

    const current = new URLSearchParams(searchParams.toString())

    current.set(queryStringA, (tokenA?.address as string) || (nativeA?.symbol as string))
    current.set(queryStringB, (tokenB?.address as string) || (nativeB?.symbol as string))

    router.replace(pathname + '?' + current.toString())
  }

  useEffect(() => {
    if (inputCurrency && outputCurrency) {
      setInput(inputCurrency)
      setOutput(outputCurrency)
    }
  }, [inputCurrency, outputCurrency])

  return { input, output, handleReplace, handleReplaceAll }
}
