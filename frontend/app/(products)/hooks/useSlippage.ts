import { useState } from 'react'

export default function useSlippage() {
  const [slippage, setSlippage] = useState<SlippageType>({
    state: 'auto',
    percent: 5,
  })

  return { slippage, setSlippage }
}
