import { cn } from '@/lib/utils'
import useCurrencyBalance from '../../hooks/useCurrencyBalance'
import { formatEther, parseEther } from 'viem'

function BalanceFixedAmount({
  balance,
  onSetAmount,
}: {
  balance: bigint
  onSetAmount: (amount: string | bigint) => void
}) {
  const halfAmount = balance / BigInt(2)

  return (
    <div className='space-x-2 pl-2 dark:text-gray-300'>
      {/* <button className='underline decoration-from-font' onClick={() => onSetAmount(balance / 4)}>
        25%
      </button> */}
      <button className='' onClick={() => onSetAmount(halfAmount)}>
        50%
      </button>
      {/* <button className='underline decoration-from-font' onClick={() => onSetAmount((balance * 3) / 4)}>
        75%
      </button> */}
      <button className='' onClick={() => onSetAmount(balance)}>
        100%
      </button>
    </div>
  )
}

export default function Balance({
  tokenAddress,
  style,
  onSetAmount,
}: {
  tokenAddress?: string
  style?: string
  onSetAmount: (amount: string | bigint) => void
}) {
  const getBalance = useCurrencyBalance(tokenAddress) ?? BigInt(0)
  const balance =
    getBalance > parseEther('1') ? formatEther(getBalance).split('.')[0] : Number(formatEther(getBalance)).toFixed(5)

  return (
    <div className={cn(style)}>
      <BalanceFixedAmount balance={getBalance} onSetAmount={onSetAmount} />
      <p className='pr-2'>{+balance ? balance : null}</p>
    </div>
  )
}
