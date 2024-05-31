interface SlippageType {
  state: string
  percent: number
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

type SwapSettingsContextType = {
  isOpen: boolean
  onHandleSetting: (state: boolean) => void
  slippage: SlippageType
  onSetSlippage: Dispatch<SetStateAction<SlippageType>>
  minutes: number
  onSetMinutes: Dispatch<SetStateAction<number>>
}
