import useCreateQueryString from '@/app/hooks/useCreateQueryString'
import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useCurrencyFromUrl() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const input = searchParams.get('inputCurrency')
  const output = searchParams.get('outputCurrency')

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

  return { input, output, handleReplace, handleReplaceAll }
}
