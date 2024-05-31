'use client'

import SwapSettings from './components/SwapSettings'
import SwapBox from './components/SwapBox'
import SwapButton from './components/SwapButton'
import SwapCurrencyPlace from './components/SwapCurrencyPlace'
import { useState } from 'react'
import CurrencyDrawer from './components/CurrencyDrawer'
import useCurrency from '../hooks/useCurrency'
import useCurrencyFromUrl from '../hooks/useCurrencyFromUrl'
import useSwapAmounts from './hooks/useSwapAmounts'
import useSlippage from '../hooks/useSlippage'
import useDeadline from '../hooks/useDeadline'
import useSwap from './hooks/useSwap'
import usePair from '../hooks/usePair'

export default function Swap() {
  const { input: inputCurrency, output: outputCurrency } = useCurrencyFromUrl()

  const inputValue = inputCurrency ? inputCurrency : 'OCTA'
  const outputValue = outputCurrency ? outputCurrency : 'OCS'

  const { currency: input, setCurrency: setInput } = useCurrency(inputValue)
  const { currency: output, setCurrency: setOutput } = useCurrency(outputValue)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { inputAmount, outputAmount, setInputAmount, setOutputAmount } = useSwapAmounts()

  const { slippage, setSlippage } = useSlippage()
  const { minutes, setMinutes, deadline } = useDeadline(inputAmount, outputAmount)

  const {
    amountsIn,
    amountsOut,
    isFetchingAmountsIn,
    isFetchingAmountsOut,
    isRouterAllowance,
    isApprovePayload,
    isApproving,
    isApproveTxSuccess,
    isTradeType,
    isSwapping,
    handleOnApprove,
    handleOnSwap,
  } = useSwap(inputAmount, outputAmount, slippage.percent, input.currency, output.currency, deadline)

  const { isPairAddress, pairAddress } = usePair(input.currency, output.currency)

  return (
    <main>
      <div className='xl:mt-10 xl:flex xl:items-center xl:justify-around'>
        <div>
          <iframe
            height='450'
            width='650'
            id='geckoterminal-embed'
            title='GeckoTerminal Embed'
            src={`https://www.geckoterminal.com/octaspace/pools/${isPairAddress ? pairAddress : '0x595ee9dd6ca0c778dce1903c83c59e79336d1e93'}?embed=1&info=0&swaps=0`}
            frameBorder='0'
            allow='clipboard-write'
            allowFullScreen
            className='hidden xl:block'
          ></iframe>
        </div>
        <div className='shrink-0 space-y-2 px-2 py-5 min-[425px]:mx-auto min-[425px]:max-w-md md:py-16 xl:mx-0 xl:py-0'>
          <SwapSettings slippage={slippage} onSetSlippage={setSlippage} minutes={minutes} onSetMinutes={setMinutes} />
          <div className='relative space-y-1'>
            <SwapBox
              isFetchingAmounts={isFetchingAmountsIn}
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
              isFetchingAmounts={isFetchingAmountsOut}
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
            isApproveTxSuccess={isApproveTxSuccess}
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
