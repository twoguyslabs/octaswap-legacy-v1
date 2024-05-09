'use client'

import SwapSettings from './components/SwapSettings'
import SwapBox from './components/SwapBox'
import SwapButton from './components/SwapButton'
import SwapTokenPlace from './components/SwapTokenPlace'

export default function Swap() {
  return (
    <main>
      <div className=' space-y-2 px-2 py-5 min-[425px]:mx-auto min-[425px]:max-w-md md:py-16'>
        <SwapSettings />
        <div className='relative space-y-1'>
          <SwapBox />
          <SwapTokenPlace />
          <SwapBox />
        </div>
        <SwapButton />
      </div>
    </main>
  )
}
