import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/wagmi.config'
import Web3ModalProvider from '@/components/WalletConnect'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700', '800'] })

export const metadata: Metadata = {
  title: 'OctaSwap',
  description: 'OctaSwap - AMM. FARM. STAKING. LAUNCHPAD',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={poppins.className}>
        <Web3ModalProvider initialState={initialState}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  )
}
