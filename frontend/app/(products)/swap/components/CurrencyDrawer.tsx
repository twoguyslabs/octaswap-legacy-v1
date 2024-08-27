/* eslint-disable react/display-name */
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import Image from 'next/image'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMediaQuery } from 'react-responsive'
import { CurrencyState, Currency as CurrencyType } from '@/constants/currency'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleHelp } from 'lucide-react'
import useCurrencyList from '../../hooks/useCurrencyList'
import useAddedToken from '../../hooks/useAddedToken'
import useCurrencyFromUrl from '../../hooks/useCurrencyFromUrl'

const Context = createContext<CurrencyDrawerContextType | null>(null)

function Currency({ currency }: { currency: CurrencyType }) {
  const {
    inputCurrency,
    outputCurrency,
    onOpenDrawer,
    inputSelectorState,
    outputSelectorState,
    onSelectInputCurrency,
    onSelectOutputCurrency,
  } = useContext(Context) as CurrencyDrawerContextType

  const { setAddedToken } = useAddedToken()
  const { handleReplace } = useCurrencyFromUrl()

  // let tokenAddress: string | undefined

  // if ('address' in currency) {
  //   tokenAddress = currency.address
  // }

  const isCurrencySelected =
    JSON.stringify(currency) === JSON.stringify(inputCurrency) ||
    JSON.stringify(currency) === JSON.stringify(outputCurrency)

  const handleSetCurrency = (currency: CurrencyType) => {
    if (inputSelectorState) {
      onSelectInputCurrency({ selectorState: false, currency })
      handleReplace('inputCurrency', currency)
    } else if (outputSelectorState) {
      onSelectOutputCurrency({ selectorState: false, currency })
      handleReplace('outputCurrency', currency)
    }

    if (!currency.logoURI) {
      setAddedToken([currency])
    }

    onOpenDrawer(false)
  }

  return (
    <Button
      variant='outline'
      className='flex w-full items-center justify-between rounded-none border-transparent py-8 text-left'
      onClick={() => handleSetCurrency(currency)}
      disabled={isCurrencySelected}
    >
      <span className='flex items-center gap-x-3'>
        {currency.logoURI ? (
          <Image src={currency.logoURI} alt={`${currency.name} Logo`} width={27} height={27} />
        ) : (
          <CircleHelp />
        )}
        <span className='grid'>
          <span className='font-semibold'>{currency.name}</span>
          <span className='text-muted-foreground'>{currency.symbol}</span>
        </span>
      </span>
      {/* {isConnected && <Balance tokenAddress={tokenAddress} />} */}
    </Button>
  )
}

function CurrencyList() {
  const { currencyList } = useContext(Context) as CurrencyDrawerContextType

  return (
    <div>
      <p className='text-muted-foreground pb-5 pl-5'>List of currency</p>
      <ScrollArea className='h-[196px] pr-3.5'>
        {currencyList?.length ? (
          currencyList?.map((currency, index) => <Currency key={index} currency={currency} />)
        ) : (
          <p className='pt-5 text-center'>No results found</p>
        )}
      </ScrollArea>
    </div>
  )
}

function CurrencySearch() {
  const { onSearchCurrencyInput } = useContext(Context) as CurrencyDrawerContextType

  return (
    <div className='mt-1 px-5'>
      <Input
        type='text'
        placeholder='Search name or paste address'
        className='focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e) => onSearchCurrencyInput(e.target.value)}
      />
    </div>
  )
}

function CurrencyDrawerDesktop() {
  const { isDrawerOpen, onOpenDrawer } = useContext(Context) as CurrencyDrawerContextType
  return (
    <Dialog open={isDrawerOpen} onOpenChange={onOpenDrawer} modal>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Select a currency</DialogTitle>
        </DialogHeader>
        <CurrencySearch />
        <Separator className='my-2' />
        <CurrencyList />
      </DialogContent>
    </Dialog>
  )
}

function CurrencyDrawerMobile() {
  const { isDrawerOpen, onOpenDrawer } = useContext(Context) as CurrencyDrawerContextType

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onOpenDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a currency</DrawerTitle>
        </DrawerHeader>
        <CurrencySearch />
        <Separator className='my-6' />
        <CurrencyList />
      </DrawerContent>
    </Drawer>
  )
}

export default function CurrencyDrawer({
  inputCurrency,
  outputCurrency,
  isDrawerOpen,
  onOpenDrawer,
  inputSelectorState,
  outputSelectorState,
  onSelectInputCurrency,
  onSelectOutputCurrency,
}: {
  inputCurrency: CurrencyType | undefined
  outputCurrency: CurrencyType | undefined
  isDrawerOpen: boolean
  onOpenDrawer: (state: boolean) => void
  inputSelectorState: boolean
  outputSelectorState: boolean
  onSelectInputCurrency: Dispatch<SetStateAction<CurrencyState>>
  onSelectOutputCurrency: Dispatch<SetStateAction<CurrencyState>>
}) {
  const [searchCurrencyInput, setSearchCurrencyInput] = useState('')

  const isNotMobile = useMediaQuery({ query: '(min-width: 640px)' })
  const currencyList = useCurrencyList(searchCurrencyInput)

  const handleDrawer = (state: boolean) => {
    if (!state) {
      onOpenDrawer(state)
      onSelectInputCurrency((sic) => ({ ...sic, selectorState: false }))
      onSelectOutputCurrency((soc) => ({ ...soc, selectorState: false }))
    }

    onOpenDrawer(state)
  }

  useEffect(() => {
    if (!isDrawerOpen) {
      setTimeout(() => {
        setSearchCurrencyInput('')
      }, 100)
    }
  }, [isDrawerOpen])

  return (
    <Context.Provider
      value={{
        inputCurrency,
        outputCurrency,
        isDrawerOpen,
        onOpenDrawer: handleDrawer,
        inputSelectorState,
        outputSelectorState,
        onSelectInputCurrency,
        onSelectOutputCurrency,
        currencyList,
        onSearchCurrencyInput: setSearchCurrencyInput,
      }}
    >
      {isNotMobile ? <CurrencyDrawerDesktop /> : <CurrencyDrawerMobile />}
    </Context.Provider>
  )
}
