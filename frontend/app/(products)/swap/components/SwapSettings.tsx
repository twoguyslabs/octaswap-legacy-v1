/* eslint-disable react/display-name */
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React, { forwardRef, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { useMediaQuery } from 'react-responsive'
import Slippage from './Slippage'
import Deadline from './Deadline'

function SwapSettingDesktop({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: (state: boolean) => void
}) {
  return (
    <Popover open={isOpen} onOpenChange={onOpen}>
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

function SwapSettingMobile({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: (state: boolean) => void
}) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpen}>
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

const GearButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<'button'>
>((props, ref) => (
  <button className='pr-2' ref={ref} {...props}>
    <FaGear className='h-5 w-5' />
  </button>
))

export default function SwapSettings() {
  const [isOpen, setIsOpen] = useState(false)

  const isNotMobile = useMediaQuery({ query: '(min-width: 640px)' })

  return (
    <div className='text-right'>
      {isNotMobile ? (
        <SwapSettingDesktop isOpen={isOpen} onOpen={setIsOpen} />
      ) : (
        <SwapSettingMobile isOpen={isOpen} onOpen={setIsOpen} />
      )}
    </div>
  )
}
