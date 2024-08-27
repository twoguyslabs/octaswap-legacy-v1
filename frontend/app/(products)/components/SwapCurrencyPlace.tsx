import { Currency, CurrencyState } from '@/constants/currency'
import { Dispatch, SetStateAction } from 'react'
import { AiOutlineSync } from 'react-icons/ai'
import useCurrencyFromUrl from '../hooks/useCurrencyFromUrl'

export default function SwapCurrencyPlace({
  input,
  output,
  onSetInput,
  onSetOutput,
}: {
  input: Currency | undefined
  output: Currency | undefined
  onSetInput: Dispatch<SetStateAction<CurrencyState>>
  onSetOutput: Dispatch<SetStateAction<CurrencyState>>
}) {
  const { handleReplaceAll } = useCurrencyFromUrl()

  const handleSwap = () => {
    onSetInput((si) => ({ ...si, currency: output }))
    onSetOutput((so) => ({ ...so, currency: input }))
    handleReplaceAll('inputCurrency', 'outputCurrency', output, input)
  }

  return (
    <button
      className='border-background dark:bg-secondary absolute right-[46%] top-[38.5%] rounded-lg border-4 bg-gray-50 p-1.5'
      onClick={handleSwap}
    >
      <AiOutlineSync className='h-5 w-5' />
    </button>
  )
}
