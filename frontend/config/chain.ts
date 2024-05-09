import { type Chain } from 'viem'

const octaspace = {
  id: 800001,
  name: 'Octa Space',
  nativeCurrency: { name: 'Octa Space', symbol: 'OCTA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.octa.space/'] },
  },
  blockExplorers: {
    default: {
      name: 'Octa Explorer',
      url: 'https://scan.octa.space',
    },
  },
} as const satisfies Chain

export { octaspace }
