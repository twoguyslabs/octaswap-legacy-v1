import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { foundry } from 'wagmi/chains'
import { octaspace } from './config/chain'

const NODE_ENV = process.env.NODE_ENV
export const isDevelopment = NODE_ENV === 'development'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const metadata = {
  name: 'OctaSwap',
  description: 'OctaSwap AMM. Farm. Staking. Launchpad',
  url: 'https://octaswap.io',
  icons: ['https://silver-rare-partridge-940.mypinata.cloud/ipfs/QmRhm9i5nnrf6jqS78Sa1MeYR7A1ex9zB6ULsCcebZGvPh'],
}

const chains = isDevelopment ? ([foundry] as const) : ([octaspace] as const)

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
