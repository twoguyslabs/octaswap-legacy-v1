'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useAllPairs from '../hooks/useAllPairs'
import usePairIndex from '../hooks/usePairIndex'
import useFindMyLiquidityPositions from '../hooks/useFindMyLiquidityPositions'
import { useEffect } from 'react'
import Positions from './components/Positions'
import useFindMyliquidityPosition from '../hooks/useFindMyLiquidityPositions'

export default function Liquidity() {
  const myPairs = useFindMyliquidityPosition()
  return (
    <main>
      <div className='max-w-[40rem] space-y-3 px-5 pb-7 sm:mx-auto md:px-0'>
        <div className='bg-secondary space-y-2 rounded-lg border p-3'>
          <div className='space-y-2 '>
            <h1 className='font-bold'>Liquidity provider rewards</h1>
            <p className='text-xs'>
              Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing your liquidity
            </p>
          </div>
          <div>
            <a
              className='text-sm underline'
              href='https://docs.uniswap.org/contracts/v2/concepts/core-concepts/pools'
              target='_blank'
            >
              Read more about providing liqudity
            </a>
          </div>
        </div>
        <div className='space-x-3 text-right'>
          <Button asChild>
            <Link href='/liquidity/add'>Create a pair</Link>
          </Button>
          {/* <Button>
            <Link href='/liquidity/find'>
            Import a pair
            </Link>
          </Button> */}
        </div>
        {myPairs.length > 0 ? (
          <Positions />
        ) : (
          <div className='rounded-lg border p-3'>
            <p className='text-center'>No liqudity found</p>
          </div>
        )}
      </div>
    </main>
  )
}
