'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'
import useCurrency from '../../hooks/useCurrency'
import { useState } from 'react'
import useCurrencyAmounts from '../../hooks/useCurrencyAmounts'
import useSlippage from '../../hooks/useSlippage'
import useDeadline from '../../hooks/useDeadline'
import useLiquidity from '../hooks/useLiquidity'
import DexSettings from '../../components/DexSettings'
import SwapBox from '../../swap/components/SwapBox'
import LiquidityButton from '../components/LiquidityButton'
import LiquidityDetails from '../components/LiquidityDetails'
import { ArrowLeft, PlusIcon } from 'lucide-react'
import CurrencyDrawer from '../../swap/components/CurrencyDrawer'

export default function Add() {
  const { input: inputCurrency, output: outputCurrency } = useCurrencyFromUrl()

  const inputValue = inputCurrency ? inputCurrency : 'OCTA'
  const outputValue = outputCurrency ? outputCurrency : 'OCS'

  const { currency: input, setCurrency: setInput } = useCurrency(inputValue)
  const { currency: output, setCurrency: setOutput } = useCurrency(outputValue)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { inputAmount, outputAmount, setInputAmount, setOutputAmount } = useCurrencyAmounts(
    input.currency,
    output.currency,
  )

  const { slippage, setSlippage } = useSlippage()
  const { minutes, setMinutes, deadline } = useDeadline(inputAmount, outputAmount)

  const {
    quoteIn,
    quoteOut,
    quoteInPerOne,
    quoteOutPerOne,
    isRouterAllowanceA,
    isRouterAllowanceB,
    isApprovePayloadA,
    isApprovePayloadB,
    isApprovingA,
    isApprovingB,
    isLiquidityType,
    isAddingLiquidity,
    handleOnApproveA,
    handleOnApproveB,
    handleOnAdd,
  } = useLiquidity(inputAmount, outputAmount, slippage.percent, input.currency, output.currency, deadline)

  return (
    <main>
      <div className='py-5 min-[425px]:mx-auto min-[425px]:max-w-md'>
        <div className='rounded-lg border p-2'>
          <div className='flex flex-col gap-y-2'>
            <div className='flex items-center justify-between'>
              <Button variant='ghost' size='icon' asChild>
                <Link href='/liquidity'>
                  <ArrowLeft />
                </Link>
              </Button>
              <p className='font-semibold'>Add liquidity</p>
              <DexSettings
                slippage={slippage}
                onSetSlippage={setSlippage}
                minutes={minutes}
                onSetMinutes={setMinutes}
              />
            </div>
            <div className='relative'>
              <SwapBox
                currencyAmount={inputAmount || quoteIn}
                onSetAmount={setInputAmount}
                currency={input.currency}
                onSelectCurrency={setInput}
                onOpenDrawer={setIsDrawerOpen}
              />
              <div className='my-2 text-center'>
                <button className='cursor-default align-middle'>
                  <PlusIcon />
                </button>
              </div>
              <SwapBox
                currencyAmount={outputAmount || quoteOut}
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
          </div>
          <LiquidityDetails
            currencyA={input.currency}
            currencyB={output.currency}
            amountA={inputAmount || quoteIn}
            amountB={outputAmount || quoteOut}
            quoteInPerOne={quoteInPerOne}
            quoteOutPerOne={quoteOutPerOne}
          />
          <LiquidityButton
            inputCurrency={input.currency}
            outputCurrency={output.currency}
            isRouterAllowanceA={isRouterAllowanceA}
            isRouterAllowanceB={isRouterAllowanceB}
            isApprovePayloadA={isApprovePayloadA}
            isApprovePayloadB={isApprovePayloadB}
            isApprovingA={isApprovingA}
            isApprovingB={isApprovingB}
            isLiquidityType={isLiquidityType}
            isAddingLiquidity={isAddingLiquidity}
            onHandleApproveA={handleOnApproveA}
            onHandleApproveB={handleOnApproveB}
            onHandleAdd={handleOnAdd}
          />
        </div>
      </div>
    </main>
  )
}
