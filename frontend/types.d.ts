interface SlippageType {
  state: string
  percent: number
}

interface LiquidityPosition {
  pairAddress: `0x${string}`
  totalPoolTokens: bigint
  token0Address: `0x${string}`
  token1Address: `0x${string}`
  token0Symbol: string
  token1Symbol: string
  pooledToken0: number
  pooledToken1: number
  poolShare: number
}

type CurrencyDrawerContextType = {
  inputCurrency: CurrencyType | undefined
  outputCurrency: CurrencyType | undefined
  isDrawerOpen: boolean
  onOpenDrawer: (state: boolean) => void
  currencyList: CurrencyType[] | undefined
  inputSelectorState: boolean
  outputSelectorState: boolean
  onSearchCurrencyInput: (state: string) => void
  onSelectInputCurrency: Dispatch<SetStateAction<CurrencyState>>
  onSelectOutputCurrency: Dispatch<SetStateAction<CurrencyState>>
}

type DexSettingsContextType = {
  isOpen: boolean
  onHandleSetting: (state: boolean) => void
  slippage: SlippageType
  onSetSlippage: Dispatch<SetStateAction<SlippageType>>
  minutes: number
  onSetMinutes: Dispatch<SetStateAction<number>>
}

interface Tier {
  name: string
  minAmount: bigint
  maxAmount: bigint
  lockDuration: bigint
  rewardsRate: bigint
}
