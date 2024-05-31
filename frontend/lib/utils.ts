import { Base, Currency, Token } from '@/constants/currency'
import { DECIMALS } from '@/constants/decimals'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isAddress, parseEther } from 'viem'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function nFormatter(num: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

function splitCurrenciesByType(currencyList: Currency[]) {
  const native: Base = currencyList.filter(
    (currency) => currency instanceof Object && !('address' in currency),
  )[0] as Base

  const tokens: Token[] = currencyList.filter((currency) => 'address' in currency) as Token[]

  return { native, tokens }
}

function sortCurrencyList(currencyList: Currency[]): Currency[] {
  const { native, tokens } = splitCurrenciesByType(currencyList)
  tokens?.sort((a, b) => a.name.localeCompare(b.name))

  return [native, ...tokens]
}

function searchCurrencyByString(searchInput: string, currencyList: Currency[]) {
  const currency = currencyList.filter((currency) => {
    const input = searchInput.toLowerCase()
    const name = currency.name.toLowerCase()
    const symbol = currency.symbol.toLowerCase()

    return name.includes(input) || symbol.includes(input)
  })

  return currency
}

function searchCurrencyInputBy(currencyList: Currency[], input?: string) {
  const { tokens } = splitCurrenciesByType(currencyList)

  if (input) {
    const tokenInList = tokens.filter((token) => token.address === input)
    if (tokenInList.length) {
      return tokenInList
    } else {
      return searchCurrencyByString(input, currencyList)
    }
  } else {
    return sortCurrencyList(currencyList)
  }
}

function checkDuplicateCurrency(defaultList: Currency[], addedList: Currency[]) {
  const duplicates: Currency[] = []
  const mergedList: Currency[] = [...defaultList]
  const newAddedList: Currency[] = []

  const { tokens: defaultListTokens } = splitCurrenciesByType(defaultList)
  const { tokens: addedListTokens } = splitCurrenciesByType(addedList)

  const addressInDefaultList = new Set(defaultListTokens.map((token) => token.address))

  for (const addedToken of addedListTokens) {
    if (addressInDefaultList.has(addedToken.address)) {
      duplicates.push(addedToken)
    } else {
      mergedList.push(addedToken)
      newAddedList.push(addedToken)
    }
  }

  return { mergedList, newAddedList }
}

function splitCurrencyType(currency: Currency | undefined) {
  let token
  let native

  if (currency) {
    if ('address' in currency) {
      token = currency
    } else {
      native = currency
    }
  }

  return { token, native }
}

export {
  cn,
  nFormatter,
  splitCurrenciesByType,
  sortCurrencyList,
  searchCurrencyByString,
  searchCurrencyInputBy,
  checkDuplicateCurrency,
  splitCurrencyType,
}
