import { foundry } from 'viem/chains'
import { ChainId } from './chainId'
import { Currency, Base } from './currency'
import { config } from '@/wagmi.config'

const { id, nativeCurrency } = config.chains[0]

enum NativeLogo {
  ETH = 'https://silver-rare-partridge-940.mypinata.cloud/ipfs/Qmc4x67RgKR5ySWadqPqgJdYLWga89gj1XN3tPFV3PvEjY',
  OCTA = 'https://silver-rare-partridge-940.mypinata.cloud/ipfs/Qmc4x67RgKR5ySWadqPqgJdYLWga89gj1XN3tPFV3PvEjY',
}

const CHAIN_ID_TO_LOGO = {
  [foundry.id]: NativeLogo.ETH,
  [ChainId.OCTA_SPACE]: NativeLogo.OCTA,
} as const

const native: Base = {
  chainId: id,
  decimals: nativeCurrency.decimals,
  name: nativeCurrency.name,
  symbol: nativeCurrency.symbol,
  logoURI: CHAIN_ID_TO_LOGO[id as keyof typeof CHAIN_ID_TO_LOGO],
}

export { native, CHAIN_ID_TO_LOGO }
