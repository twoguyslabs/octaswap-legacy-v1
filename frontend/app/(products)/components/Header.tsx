'use client'

import Logo from '@/components/Logo'
import ProductsNavbar from './ProductsNavbar'
import { useMediaQuery } from 'react-responsive'
import { cn } from '@/lib/utils'
import { useAccount } from 'wagmi'

export default function Header() {
  const { isConnected, address } = useAccount()
  const isNotMobile = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <header className='p-5'>
      <div className='md:flex md:items-center md:justify-between'>
        <div className='flex items-center justify-between md:justify-start md:gap-x-7'>
          <Logo width={35} height={35} />
          {isNotMobile ? (
            <ProductsNavbar />
          ) : (
            <div
              className={cn(
                'flex items-center gap-x-3',
                isConnected && 'gap-x-0',
              )}
            >
              <w3m-button balance='hide' size='sm' />
              <ProductsNavbar />
            </div>
          )}
        </div>
        {isNotMobile && (
          <div>
            <w3m-button balance='hide' size='sm' />
          </div>
        )}
      </div>
    </header>
  )
}
