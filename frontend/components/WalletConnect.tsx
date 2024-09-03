'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { darkTheme, getDefaultConfig, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { octaspace } from '@/config/chain'
import { WagmiProvider } from 'wagmi'
import { useTheme } from 'next-themes'

const config = getDefaultConfig({
  appName: 'OctaSwap',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains: [octaspace],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

export default function WalletConnect({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useTheme()
  const theme = currentTheme === 'light' ? lightTheme() : darkTheme()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact' theme={theme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
