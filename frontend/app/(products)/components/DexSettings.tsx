/* eslint-disable react/display-name */
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React, { Dispatch, SetStateAction, createContext, forwardRef, useContext, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { useMediaQuery } from 'react-responsive'
import Slippage from './Slippage'
import Deadline from './Deadline'
import { Button } from '@/components/ui/button'

export const DexSettingsContext = createContext<DexSettingsContextType | null>(null)

function DexSettingDesktop() {
  const { isOpen, onHandleSetting } = useContext(DexSettingsContext) as DexSettingsContextType

  return (
    <Popover open={isOpen} onOpenChange={onHandleSetting}>
      <PopoverTrigger asChild>
        <GearButton />
      </PopoverTrigger>
      <PopoverContent sideOffset={13} align='end'>
        <div className='space-y-3'>
          <Slippage />
          <Deadline />
        </div>
      </PopoverContent>
    </Popover>
  )
}

function DexSettingMobile() {
  const { isOpen, onHandleSetting } = useContext(DexSettingsContext) as DexSettingsContextType

  return (
    <Drawer open={isOpen} onOpenChange={onHandleSetting}>
      <DrawerTrigger asChild>
        <GearButton />
      </DrawerTrigger>
      <DrawerContent>
        <div className='space-y-3 p-3'>
          <Slippage />
          <Deadline />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const GearButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithRef<'button'>>((props, ref) => (
  <Button variant='ghost' size='icon' ref={ref} {...props}>
    <FaGear className='h-5 w-5' />
  </Button>
))

export default function DexSettings({
  slippage,
  onSetSlippage,
  minutes,
  onSetMinutes,
}: {
  slippage: SlippageType
  onSetSlippage: Dispatch<SetStateAction<SlippageType>>
  minutes: number
  onSetMinutes: Dispatch<SetStateAction<number>>
}) {
  const [isOpen, setIsOpen] = useState(false)

  const isNotMobile = useMediaQuery({ query: '(min-width: 640px)' })

  const handleSetting = (state: boolean) => {
    if (state) {
      setIsOpen(state)
    } else {
      if (slippage.percent < 1 || slippage.percent > 50) {
        onSetSlippage({ ...slippage, percent: 5 })
      }

      if (minutes < 1 || minutes > 60) {
        onSetMinutes(5)
      }

      setIsOpen(state)
    }
  }

  return (
    <DexSettingsContext.Provider
      value={{ isOpen, onHandleSetting: handleSetting, slippage, onSetSlippage, minutes, onSetMinutes }}
    >
      {isNotMobile ? <DexSettingDesktop /> : <DexSettingMobile />}
    </DexSettingsContext.Provider>
  )
}
