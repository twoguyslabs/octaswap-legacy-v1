import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/wagmi.config'
import Web3ModalProvider from '@/components/WalletConnect'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700', '800'] })

export const metadata: Metadata = {
  title: 'OctaSwap Staking',
  description: 'OctaSwap - Trade. Stake. Launch.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={poppins.className}>
        <Web3ModalProvider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  )
}
