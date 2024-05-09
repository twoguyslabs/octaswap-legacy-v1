import { foundry } from 'viem/chains'
import { ChainId } from './chainId'

interface Currency {
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
  balance: bigint | number | string
}

enum NativeLogo {
  ETH = '/eth-logo.svg',
  OCTA = 'https://silver-rare-partridge-940.mypinata.cloud/ipfs/QmRhm9i5nnrf6jqS78Sa1MeYR7A1ex9zB6ULsCcebZGvPh',
}

const CHAIN_ID_TO_LOGO = {
  [foundry.id]: NativeLogo.ETH,
  [ChainId.OCTA_SPACE]: NativeLogo.OCTA,
} as const

export { type Currency, CHAIN_ID_TO_LOGO }
