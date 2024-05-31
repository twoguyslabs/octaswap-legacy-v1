import { Currency } from '@/constants/currency'
import { checkDuplicateCurrency, searchCurrencyInputBy } from '@/lib/utils'
import { useEffect, useState } from 'react'
import useUnofficialToken from './useUnofficialToken'
import useFetchTokenList from './useFetchTokenList'
import { native } from '@/constants/native'
import useAddedToken from './useAddedToken'

export default function useCurrencyList(input?: string) {
  const [list, setList] = useState<Currency[]>()

  const defaultTokenList = useFetchTokenList() ?? []

  const { addedToken: addedTokenList, setAddedToken: setAddedTokenList } = useAddedToken()
  const { mergedList, newAddedList } = checkDuplicateCurrency(defaultTokenList, addedTokenList)

  const currencyList = [native, ...mergedList]

  const result = searchCurrencyInputBy(currencyList, input)
  const token = useUnofficialToken(input as `0x${string}`)

  useEffect(() => {
    if (newAddedList.length) {
      setAddedTokenList(newAddedList)
    }
  }, [JSON.stringify(newAddedList), setAddedTokenList])

  useEffect(() => {
    if (Array.isArray(result)) {
      setList(result)
    }
  }, [JSON.stringify(result)])

  useEffect(() => {
    if (token) {
      setList([token])
    }
  }, [token])

  return list
}
