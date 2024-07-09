import { useEffect, useState } from 'react'
import useAllPairs from '../../hooks/useAllPairs'
import useFindMyLiquidityPositions from '../../hooks/useFindMyLiquidityPositions'
import usePairIndex from '../../hooks/usePairIndex'
import Image from 'next/image'
import { ADDRESS_TO_TOKEN_LOGO } from '@/constants/logos'
import { useReadContract } from 'wagmi'
import { erc20Abi, formatEther } from 'viem'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ArrowDown, ChevronDown, CircleHelp } from 'lucide-react'
import usePairReserves from '../../hooks/usePairReserves'
import usePoolShare from '../hooks/usePoolShare'
import Link from 'next/link'

export default function Positions() {
  const myPairs = useFindMyLiquidityPositions()

  return (
    <div className='space-y-2'>
      {myPairs.map((lp) => (
        <Collapsible key={lp.pairAddress}>
          <div className='bg-primary/10 space-y-5 rounded-lg border p-3'>
            <div className=' flex items-center justify-between gap-x-3'>
              <div className='flex items-center gap-x-3'>
                <div className='flex items-center gap-x-2'>
                  {ADDRESS_TO_TOKEN_LOGO[lp.token0Address as keyof typeof ADDRESS_TO_TOKEN_LOGO] ? (
                    <Image
                      src={ADDRESS_TO_TOKEN_LOGO[lp.token0Address as keyof typeof ADDRESS_TO_TOKEN_LOGO]}
                      alt={`${lp.token0Symbol} Logo`}
                      width={25}
                      height={25}
                    />
                  ) : (
                    <CircleHelp />
                  )}
                  {ADDRESS_TO_TOKEN_LOGO[lp.token1Address as keyof typeof ADDRESS_TO_TOKEN_LOGO] ? (
                    <Image
                      src={ADDRESS_TO_TOKEN_LOGO[lp.token1Address as keyof typeof ADDRESS_TO_TOKEN_LOGO]}
                      alt={`${lp.token1Symbol} Logo`}
                      width={25}
                      height={25}
                    />
                  ) : (
                    <CircleHelp />
                  )}
                </div>
                <div className='flex items-center'>
                  <p className='font-bold'>{lp.token0Symbol}</p>-<p className='font-bold'>{lp.token1Symbol}</p>
                </div>
              </div>
              <CollapsibleTrigger className='flex items-center gap-x-1'>
                Open
                <ChevronDown />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className='space-y-3'>
                <ul className='space-y-2'>
                  <li className='flex items-center justify-between'>
                    <p>Liquidity Token :</p>
                    <p className='font-bold'>{Number(formatEther(lp.totalPoolTokens)).toFixed(3)}</p>
                  </li>
                  <li className='flex items-center justify-between'>
                    <p>Pooled {lp.token0Symbol} :</p>
                    <p className='font-bold'>{lp.pooledToken0.toFixed(3)}</p>
                  </li>
                  <li className='flex items-center justify-between'>
                    <p>Pooled {lp.token1Symbol} :</p>
                    <p className='font-bold'>{lp.pooledToken1.toFixed(3)}</p>
                  </li>
                  <li className='flex items-center justify-between'>
                    <p>Pool Share :</p>
                    <p className='font-bold'>{lp.poolShare < 0.01 ? '< 0.01' : (lp.poolShare * 100).toFixed(3)}%</p>
                  </li>
                </ul>
                <div className='grid grid-cols-2 gap-x-3'>
                  <Button asChild>
                    <Link href={`/liquidity/add?inputCurrency=${lp.token0Address}&outputCurrency=${lp.token1Address}`}>
                      Add liquidity
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      href={`/liquidity/remove?inputCurrency=${lp.token0Address}&outputCurrency=${lp.token1Address}`}
                    >
                      Remove liquidity
                    </Link>
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  )
}
