'use client'

import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowLeft, CircleHelp, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import { Suspense, useState } from 'react'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import useCurrency from '../../hooks/useCurrency'
import usePair from '../../hooks/usePair'
import usePairTokensReserve from '../../hooks/usePairTokensReserve'
import Image from 'next/image'
import useErcPairBalance from '../../hooks/useErcPairBalance'
import useApprove from '../../hooks/useApprove'
import { ROUTER_ADDRESS } from '@/contracts/octaswapRouter'
import useRemoveLiquidityType from '../hooks/useRemoveLiquidityType'
import useAllowance from '../../hooks/useAllowance'

export default function Remove() {
  const [percentToRemove, setPercentToRemove] = useState(100)

  const { input: inputCurrency, output: outputCurrency } = useCurrencyFromUrl()

  const { currency: input, setCurrency: setInput } = useCurrency(inputCurrency)
  const { currency: output, setCurrency: setOutput } = useCurrency(outputCurrency)

  const { pairAddress } = usePair(input.currency, output.currency)
  const pairBalance = useErcPairBalance(pairAddress) ?? BigInt(0)
  const { token0Reserve, token1Reserve } = usePairTokensReserve(pairAddress)

  const liquidityToken = (pairBalance * BigInt(percentToRemove)) / BigInt(100)
  const reserveA = (token0Reserve * percentToRemove) / 100
  const reserveB = (token1Reserve * percentToRemove) / 100

  const isAllowance = useAllowance(pairAddress, ROUTER_ADDRESS, liquidityToken)

  const { isApprovePayload, isApproving, handleOnApprove } = useApprove(pairAddress, ROUTER_ADDRESS, liquidityToken)

  const { isRemoveLiquidityType, isRemovingLiquidity, handleOnRemove } = useRemoveLiquidityType(
    input.currency,
    output.currency,
    liquidityToken,
  )

  return (
    <Suspense>
      <main>
        <div className='py-5 min-[425px]:mx-auto min-[425px]:max-w-md'>
          <div className='rounded-lg border p-2'>
            <div className='flex items-center'>
              <Button variant='ghost' size='icon' asChild>
                <Link href='/liquidity'>
                  <ArrowLeft />
                </Link>
              </Button>
              <p className='mx-auto font-semibold'>Remove liquidity</p>
            </div>
            <div className='dark:bg-secondary/40 bg-secondary mt-2 space-y-7 rounded-lg p-4'>
              <span className='text-6xl font-bold'>{percentToRemove}%</span>
              <Slider value={[percentToRemove]} max={100} onValueChange={(value) => setPercentToRemove(value[0])} />
              <div className='grid grid-cols-4 gap-x-3'>
                <Button size='sm' onClick={() => setPercentToRemove(25)}>
                  25%
                </Button>
                <Button size='sm' onClick={() => setPercentToRemove(50)}>
                  50%
                </Button>
                <Button size='sm' onClick={() => setPercentToRemove(75)}>
                  75%
                </Button>
                <Button size='sm' onClick={() => setPercentToRemove(100)}>
                  100%
                </Button>
              </div>
            </div>
            <div className='my-2 text-center'>
              <button className='cursor-default align-middle'>
                <ArrowDown />
              </button>
            </div>
            <div className='dark:bg-secondary/40 bg-secondary rounded-lg p-4'>
              <ul className='space-y-1 text-2xl font-bold'>
                <li className='flex items-center justify-between'>
                  <p>{reserveA.toFixed(3)}</p>
                  <div className='flex items-center gap-x-2'>
                    {input.currency?.logoURI ? (
                      <Image
                        src={input.currency.logoURI}
                        alt={`${input.currency?.symbol} Logo`}
                        width={27}
                        height={27}
                      />
                    ) : (
                      <CircleHelp />
                    )}
                    <p>{input.currency?.symbol}</p>
                  </div>
                </li>
                <li className='flex items-center justify-between'>
                  <p>{reserveB.toFixed(3)}</p>
                  <div className='flex items-center gap-x-2'>
                    {output.currency?.logoURI ? (
                      <Image
                        src={output.currency.logoURI}
                        alt={`${output.currency?.symbol} Logo`}
                        width={27}
                        height={27}
                      />
                    ) : (
                      <CircleHelp />
                    )}
                    <p>{output.currency?.symbol}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className='mt-3 grid grid-cols-2 gap-x-3'>
              <Button disabled={!isApprovePayload || isApproving || isAllowance} onClick={handleOnApprove}>
                Approve
              </Button>
              <Button disabled={!isRemoveLiquidityType || isRemovingLiquidity} onClick={handleOnRemove}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
}
