/* eslint-disable react/display-name */
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import Image from 'next/image'
import { ComponentPropsWithRef, forwardRef, useState } from 'react'
import tokenlist from '../../../../tokenlist.json'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMediaQuery } from 'react-responsive'
import { useAccount } from 'wagmi'
import { useNative } from '../hooks/useNative'
import { useTokenlist } from '../hooks/useTokenlist'

type TokenlistType = typeof tokenlist.tokens
type TokenSelectorTriggerType = ComponentPropsWithRef<'button'> & {
  token: TokenlistType[number]
}

function Token({ token }: { token: TokenlistType[number] }) {
  return (
    <Button
      variant='outline'
      className='flex w-full items-center justify-between rounded-none border-transparent py-8 text-left'
    >
      <span className='flex items-center gap-x-3'>
        <Image
          src={token.logoURI}
          alt={`${token.name} Logo`}
          width={28}
          height={28}
        />
        <span className='grid'>
          <span className='font-semibold'>{token.name}</span>
          <span className='text-muted-foreground'>{token.symbol}</span>
        </span>
      </span>
      <span>1000</span>
    </Button>
  )
}

function Tokenlist() {
  const native = useNative()
  const newTokenlist = useTokenlist()

  return (
    <div>
      <p className='text-muted-foreground pb-5 pl-5'>List of tokens</p>
      {tokenlist.tokens.map((token) => (
        <Token token={token} key={token.symbol} />
      ))}
    </div>
  )
}

function TokenSearch() {
  return (
    <div className='mt-1 px-5'>
      <Input
        type='text'
        placeholder='Search name or paste address'
        className='focus-visible:ring-0 focus-visible:ring-offset-0'
      />
    </div>
  )
}

const TokenSelectorTrigger = forwardRef<
  HTMLButtonElement,
  TokenSelectorTriggerType
>(({ children, token, ...props }, ref) => {
  return (
    <Button variant='outline' ref={ref} {...props} className='space-x-1'>
      <Image
        src={token.logoURI}
        alt={`${token.name} Logo`}
        width={22}
        height={22}
      />
      <span className='text-lg font-semibold'>{token.symbol}</span>
    </Button>
  )
})

function TokenDrawerDesktop({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: (state: boolean) => void
}) {
  const token = tokenlist.tokens[0]

  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <TokenSelectorTrigger token={token} />
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <TokenSearch />
        <Separator className='my-2' />
        <Tokenlist />
      </DialogContent>
    </Dialog>
  )
}

function TokenDrawerMobile({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: (state: boolean) => void
}) {
  const token = tokenlist.tokens[0]

  return (
    <Drawer open={isOpen} onOpenChange={onOpen}>
      <DrawerTrigger asChild>
        <TokenSelectorTrigger token={token} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a token</DrawerTitle>
        </DrawerHeader>
        <TokenSearch />
        <Separator className='my-6' />
        <Tokenlist />
      </DrawerContent>
    </Drawer>
  )
}

export default function TokenDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const isNotMobile = useMediaQuery({ query: '(min-width: 640px)' })

  return isNotMobile ? (
    <TokenDrawerDesktop isOpen={isOpen} onOpen={setIsOpen} />
  ) : (
    <TokenDrawerMobile isOpen={isOpen} onOpen={setIsOpen} />
  )
}
