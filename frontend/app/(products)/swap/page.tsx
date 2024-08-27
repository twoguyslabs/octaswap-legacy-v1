'use client'

import DexSettings from '../components/DexSettings'
import SwapBox from './components/SwapBox'
import SwapButton from './components/SwapButton'
import SwapCurrencyPlace from '../components/SwapCurrencyPlace'
import { useState } from 'react'
import CurrencyDrawer from './components/CurrencyDrawer'
import useCurrency from '../hooks/useCurrency'
import useCurrencyFromUrl from '../hooks/useCurrencyFromUrl'
import useCurrencyAmounts from '../hooks/useCurrencyAmounts'
import useSlippage from '../hooks/useSlippage'
import useDeadline from '../hooks/useDeadline'
import useSwap from './hooks/useSwap'
import Chart from './components/Chart'

export default function Swap() {
  const { input: inputCurrency, output: outputCurrency } = useCurrencyFromUrl()

  const inputValue = inputCurrency ? inputCurrency : 'OCTA'
  const outputValue = outputCurrency ? outputCurrency : 'OCS'

  const { currency: input, setCurrency: setInput } = useCurrency(inputValue)
  const { currency: output, setCurrency: setOutput } = useCurrency(outputValue)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { inputAmount, outputAmount, setInputAmount, setOutputAmount } = useCurrencyAmounts()

  const { slippage, setSlippage } = useSlippage()
  const { minutes, setMinutes, deadline } = useDeadline(inputAmount, outputAmount)

  const {
    amountsIn,
    amountsOut,
    isRouterAllowance,
    isApprovePayload,
    isApproving,
    isApproveTxSuccess,
    isTradeType,
    isSwapping,
    handleOnApprove,
    handleOnSwap,
  } = useSwap(inputAmount, outputAmount, slippage.percent, input.currency, output.currency, deadline)

  return (
    <main>
      <div className='xl:mt-10 xl:flex xl:items-center xl:justify-around'>
        <Chart currencyA={input.currency} currencyB={output.currency} />
        <div className='shrink-0 space-y-2 px-2 py-5 min-[425px]:mx-auto min-[425px]:max-w-md min-[450px]:px-0 md:py-16 xl:mx-0 xl:py-0'>
          <div className='text-right'>
            <DexSettings slippage={slippage} onSetSlippage={setSlippage} minutes={minutes} onSetMinutes={setMinutes} />
          </div>
          <div className='relative space-y-1'>
            <SwapBox
              currencyAmount={inputAmount || amountsIn}
              onSetAmount={setInputAmount}
              currency={input.currency}
              onSelectCurrency={setInput}
              onOpenDrawer={setIsDrawerOpen}
            />
            <SwapCurrencyPlace
              input={input.currency}
              output={output.currency}
              onSetInput={setInput}
              onSetOutput={setOutput}
            />
            <SwapBox
              currencyAmount={outputAmount || amountsOut}
              onSetAmount={setOutputAmount}
              currency={output.currency}
              onSelectCurrency={setOutput}
              onOpenDrawer={setIsDrawerOpen}
            />
            <CurrencyDrawer
              inputCurrency={input.currency}
              outputCurrency={output.currency}
              isDrawerOpen={isDrawerOpen}
              onOpenDrawer={setIsDrawerOpen}
              inputSelectorState={input.selectorState}
              outputSelectorState={output.selectorState}
              onSelectInputCurrency={setInput}
              onSelectOutputCurrency={setOutput}
            />
          </div>
          <SwapButton
            inputCurrency={input.currency}
            outputCurrency={output.currency}
            isRouterAllowance={isRouterAllowance}
            isApprovePayload={isApprovePayload}
            isApproving={isApproving}
            isTradeType={isTradeType}
            isSwapping={isSwapping}
            onApprove={handleOnApprove}
            onSwap={handleOnSwap}
          />
        </div>
      </div>
    </main>
  )
}
