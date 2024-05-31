import { Currency, CurrencyState } from '@/constants/currency'
import { Dispatch, SetStateAction } from 'react'
import { AiOutlineSync } from 'react-icons/ai'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import useCreateQueryString from '@/app/hooks/useCreateQueryString'
import { splitCurrencyType } from '@/lib/utils'
import { toast } from 'sonner'

export default function SwapTokenPlace({
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
      className='border-background absolute right-[46%] top-[38.5%] rounded-lg border-4 bg-[#101424] p-1.5'
      onClick={handleSwap}
    >
      <AiOutlineSync className='h-5 w-5' />
    </button>
  )
}
