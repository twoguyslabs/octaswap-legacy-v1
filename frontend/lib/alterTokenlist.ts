import { Currency } from '@/constants/native'
import tokenlist from '../tokenlist.json'

export function alterTokenlist(): Currency[] {
  return tokenlist.tokens.map(({ address, ...tokens }) => ({
    ...tokens,
    balance: BigInt(0),
  }))
}
