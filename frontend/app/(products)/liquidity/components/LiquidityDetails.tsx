import { Currency } from '@/constants/currency'
import { formatEther, parseEther } from 'viem'
import useLiquidityToken from '../hooks/useLiquidityToken'
import usePoolShare from '../hooks/usePoolShare'
import usePair from '../../hooks/usePair'

export default function LiquidityDetails({
  currencyA,
  currencyB,
  amountA,
  amountB,
  quoteInPerOne,
  quoteOutPerOne,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  amountA: string | bigint | undefined
  amountB: string | bigint | undefined
  quoteInPerOne: bigint | undefined
  quoteOutPerOne: bigint | undefined
}) {
  const { pairAddress, isPairAddress } = usePair(currencyA, currencyB)

  const amountIn = amountA ? (typeof amountA === 'string' ? Number(amountA) : Number(formatEther(amountA))) : 0
  const amountOut = amountB ? (typeof amountB === 'string' ? Number(amountB) : Number(formatEther(amountB))) : 0

  const fmtQuoteIn = isPairAddress
    ? quoteInPerOne
      ? quoteInPerOne > parseEther('1')
        ? Number(formatEther(quoteInPerOne)).toFixed(3)
        : Number(formatEther(quoteInPerOne)).toFixed(3)
      : 0
    : amountOut && amountIn
      ? (amountOut / amountIn).toFixed(3)
      : 0

  const fmtQuoteOut = isPairAddress
    ? quoteOutPerOne
      ? quoteOutPerOne > parseEther('1')
        ? Number(formatEther(quoteOutPerOne)).toFixed(3)
        : Number(formatEther(quoteOutPerOne)).toFixed(3)
      : 0
    : amountIn && amountOut
      ? (amountIn / amountOut).toFixed(3)
      : 0

  const { totalLiquidityTokenToAdd } = useLiquidityToken(currencyA, currencyB, amountA, amountB)
  const poolShare = usePoolShare(pairAddress, totalLiquidityTokenToAdd)

  const fmtPoolShare = poolShare ? (poolShare < 0.01 ? '<0.01' : (poolShare * 100).toFixed(3)) : 0

  return (
    <div className='my-5 space-y-3 rounded-lg border'>
      <p className='mt-3 pl-4'>Prices and pool share</p>
      <div className='flex flex-wrap justify-evenly gap-x-4 gap-y-3 rounded-lg border p-2'>
        <div className='text-center'>
          <p>{fmtQuoteIn}</p>
          <p className='text-muted-foreground text-sm'>
            {currencyA?.symbol} per {currencyB?.symbol}
          </p>
        </div>
        <div className='text-center'>
          <p>{fmtQuoteOut}</p>
          <p className='text-muted-foreground text-sm'>
            {currencyB?.symbol} per {currencyA?.symbol}
          </p>
        </div>
        <div className='text-center'>
          <p>{fmtPoolShare}%</p>
          <p className='text-muted-foreground text-sm'>Share of pool</p>
        </div>
      </div>
    </div>
  )
}
