import SwapInput from './SwapInput'
import Balance from './Balance'
import { Currency, CurrencyState } from '@/constants/currency'
import CurrencyDrawerTrigger from './CurrencyDrawerTrigger'
import { useAccount } from 'wagmi'
import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'

export default function SwapBox({
  isFetchingAmounts,
  currencyAmount,
  onSetAmount,
  currency,
  onSelectCurrency,
  onOpenDrawer,
}: {
  isFetchingAmounts: boolean
  currencyAmount: string | bigint | undefined
  onSetAmount: (amount: string | bigint) => void
  currency: Currency | undefined
  onSelectCurrency: Dispatch<SetStateAction<CurrencyState>>
  onOpenDrawer: (state: boolean) => void
}) {
  const { isConnected } = useAccount()

  const tokenAddress = currency && 'address' in currency ? currency.address : undefined

  return (
    <div className='focus-within:ring-primary hover:ring-primary has-[:focus-within]:ring-primary dark:bg-secondary/40 bg-secondary h-[101.33px] space-y-2 rounded-lg p-2 focus-within:ring-[0.6px] hover:ring-[0.3px] has-[:focus-within]:ring-[0.6px]'>
      <div className={cn('flex items-center', isFetchingAmounts && 'justify-between')}>
        <SwapInput isFetchingAmounts={isFetchingAmounts} currencyAmount={currencyAmount} onSetAmount={onSetAmount} />
        <CurrencyDrawerTrigger currency={currency} onSelectCurrency={onSelectCurrency} onOpenDrawer={onOpenDrawer} />
      </div>
      <div>
        {isConnected && typeof currency !== 'undefined' && (
          <Balance tokenAddress={tokenAddress} onSetAmount={onSetAmount} style='flex items-center justify-between' />
        )}
      </div>
    </div>
  )
}
