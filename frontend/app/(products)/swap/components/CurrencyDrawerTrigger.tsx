import { Button } from '@/components/ui/button'
import { Currency, CurrencyState } from '@/constants/currency'
import { CircleHelp } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

export default function CurrencyDrawerTrigger({
  currency,
  onSelectCurrency,
  onOpenDrawer,
}: {
  currency: Currency | undefined
  onSelectCurrency: Dispatch<SetStateAction<CurrencyState>>
  onOpenDrawer: (state: boolean) => void
}) {
  const handleTrigger = () => {
    onOpenDrawer(true)
    onSelectCurrency((sc) => ({ ...sc, selectorState: true }))
  }

  return currency ? (
    <Button variant='outline' size='sm' className='shrink-0 space-x-1.5' onClick={handleTrigger}>
      {currency.logoURI ? (
        <Image src={currency.logoURI} alt={`${currency.name} Logo`} width={22} height={22} />
      ) : (
        <CircleHelp size={22} />
      )}
      <span className='text-lg font-semibold'>{currency.symbol}</span>
    </Button>
  ) : (
    <Button variant='outline' size='sm' className='shrink-0' onClick={handleTrigger}>
      <span className='text-lg font-semibold'>Select</span>
    </Button>
  )
}
