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
      ? currencyAmount > parseEther('1')
        ? formatEther(currencyAmount).split('.')[0]
        : formatEther(currencyAmount)
      : currencyAmount
    : ''

  return isFetchingAmounts ? (
    <SpokeSpinner size='lg' />
  ) : (
    <Input
      type='text'
      placeholder='0'
      className='border-transparent bg-[#101424] py-7 text-2xl focus-visible:ring-0 focus-visible:ring-offset-0'
      onChange={(e) => onSetAmount(e.target.value)}
      value={amount}
    />
  )
}
