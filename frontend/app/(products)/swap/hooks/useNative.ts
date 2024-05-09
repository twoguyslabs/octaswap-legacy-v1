import { CHAIN_ID_TO_LOGO, Currency } from '@/constants/native'
import { useAccount, useBalance } from 'wagmi'

export function useNative() {
  const { chain, address } = useAccount()
  const { data } = useBalance({ address })

  const chainId = chain?.id ?? 0
  const decimals = chain?.nativeCurrency.decimals ?? 18
  const name = chain?.nativeCurrency.name ?? ''
  const symbol = chain?.nativeCurrency.symbol ?? ''
  const logoURI = CHAIN_ID_TO_LOGO[chainId as keyof typeof CHAIN_ID_TO_LOGO]
  const balance = data?.value ?? BigInt(0)

  const native: Currency = {
    chainId,
    decimals,
    name,
    symbol,
    logoURI,
    balance,
  }

  return native
}
