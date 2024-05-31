interface Base {
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
}

interface Token extends Base {
  address: string
}

type Currency = Token | Base

interface CurrencyState {
  selectorState: boolean
  currency?: Currency
}

export { type Base, type Token, type Currency, type CurrencyState }
