'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/wagmi.config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'

type ThemeMode = 'light' | 'dark'

// Setup queryClient
const queryClient = new QueryClient()

// Retrieve theme from localStorage
const storedTheme = global?.localStorage?.getItem('theme')

// Type guard function to ensure the value is a valid ThemeMode
const isValidThemeMode = (theme: string | null): theme is ThemeMode => {
  return theme === 'dark' || theme === 'light'
}

// Determine the current theme
const currentTheme: ThemeMode | undefined = isValidThemeMode(storedTheme) ? storedTheme : undefined

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeVariables: {
    '--w3m-accent': '#6d28d9',
  },
  themeMode: currentTheme,
})

export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
