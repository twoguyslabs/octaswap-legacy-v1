import SwapInput from './SwapInput'
import Balance from './Balance'
import TokenDrawer from './TokenDrawer'

export default function SwapBox() {
  return (
    <div className='space-y-2 rounded-lg bg-[#101424] p-2 focus-within:ring-[0.6px] focus-within:ring-primary hover:ring-[0.3px] hover:ring-primary has-[:focus-within]:ring-[0.6px] has-[:focus-within]:ring-primary'>
      <div className='flex items-center'>
        <SwapInput />
        <TokenDrawer />
      </div>
      <div>
        <Balance />
      </div>
    </div>
  )
}
