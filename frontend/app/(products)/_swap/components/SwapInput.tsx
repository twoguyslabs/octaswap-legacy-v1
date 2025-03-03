import { Input } from '@/components/ui/input'
import { formatEther } from 'viem'

export default function SwapInput({
  currencyAmount,
  onSetAmount,
}: {
  currencyAmount: string | bigint | undefined
  onSetAmount: (amount: string | bigint) => void
}) {
  const amount = currencyAmount
    ? typeof currencyAmount === 'bigint'
      ? formatEther(currencyAmount)
      : currencyAmount
    : ''

  return (
    <Input
      type='text'
      placeholder='0'
      className='dark:bg-secondary/5 border-transparent bg-gray-50 py-7 text-2xl focus-visible:ring-0 focus-visible:ring-offset-0'
      onChange={(e) => onSetAmount(e.target.value)}
      value={amount}
    />
  )
}
