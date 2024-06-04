import { SpokeSpinner } from '@/components/Spinner'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction } from 'react'
import { formatEther, parseEther } from 'viem'

export default function SwapInput({
  isFetchingAmounts,
  currencyAmount,
  onSetAmount,
}: {
  isFetchingAmounts: boolean
  currencyAmount: string | bigint | undefined
  onSetAmount: (amount: string | bigint) => void
}) {
  const amount = currencyAmount
    ? typeof currencyAmount === 'bigint'
      ? formatEther(currencyAmount)
      : currencyAmount
    : ''

  return isFetchingAmounts ? (
    <SpokeSpinner size='lg' />
  ) : (
    <Input
      type='text'
      placeholder='0'
      className='bg-secondary border-transparent py-7 text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#101424]'
      onChange={(e) => onSetAmount(e.target.value)}
      value={amount}
    />
  )
}
