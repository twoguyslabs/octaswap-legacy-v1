'use client'

import Logo from '@/components/Logo'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { RxHamburgerMenu } from 'react-icons/rx'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import ThemeToggler from '@/components/ThemeToggler'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const LINKS: { href: string; text: string }[] = [
  {
    href: '/swap',
    text: 'Swap',
  },
  {
    href: '/liquidity',
    text: 'Liquidity',
  },
  {
    href: '/staking',
    text: 'Staking',
  },
  {
    href: 'https://octaswap.io/launchpad',
    text: 'Launchpad',
  },
  {
    href: 'https://octaswap.io/claim',
    text: 'Vesting',
  },
]

type LinksType = typeof LINKS

function NavigationLink({ link, onOpen }: { link: LinksType[number]; onOpen?: Dispatch<SetStateAction<boolean>> }) {
  const pathname = usePathname()
  const isActive = link.href === pathname

  return (
    <Link href={link.href} legacyBehavior passHref>
      <NavigationMenuLink
        className={cn(navigationMenuTriggerStyle(), 'text-xl md:text-lg')}
        active={isActive}
        target={
          link.href === 'https://octaswap.io/launchpad' || link.href === 'https://octaswap.io/claim'
            ? '_blank'
            : '_self'
        }
        onClick={() => onOpen?.(false)}
      >
        {link.text}
      </NavigationMenuLink>
    </Link>
  )
}

function Navigation({
  links,
  orientation,
  onOpen,
}: {
  links: LinksType
  orientation: 'horizontal' | 'vertical'
  onOpen?: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <NavigationMenu orientation={orientation} className='flex-none'>
      <NavigationMenuList className='flex-col items-start gap-x-3 gap-y-3 space-x-0 md:flex-row'>
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationLink link={link} onOpen={onOpen} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Desktop({ links, orientation }: { links: LinksType; orientation: 'horizontal' | 'vertical' }) {
  return <Navigation links={links} orientation={orientation} />
}

function Mobile({
  links,
  isOpen,
  onOpen,
}: {
  links: LinksType
  isOpen: boolean
  onOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpen}>
      <SheetTrigger asChild>
        <button>
          <RxHamburgerMenu className='h-7 w-7' />
        </button>
      </SheetTrigger>
      <SheetContent side='left'>
        <div className='flex h-full flex-col justify-between'>
          <Navigation links={links} orientation='vertical' onOpen={onOpen} />
          <ThemeToggler />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function ProductsNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDisconnected } = useAccount()
  return (
    <NavigationMenu className='max-w-full p-5'>
      <div className='flex w-full items-center justify-between'>
        <div className='md:flex md:items-center md:gap-x-5'>
          <Logo width={35} height={35} />
          <div className='hidden md:block'>
            <Desktop links={LINKS} orientation='horizontal' />
          </div>
        </div>
        <div className={cn('hidden md:flex md:items-center', isDisconnected && 'md:gap-x-3')}>
          <ThemeToggler />
          <ConnectButton showBalance={{ smallScreen: false }} />
        </div>
        <div className='flex items-center gap-x-3 md:hidden'>
          <ConnectButton showBalance={{ smallScreen: false }} />
          <Mobile links={LINKS} isOpen={isOpen} onOpen={setIsOpen} />
        </div>
      </div>
    </NavigationMenu>
  )
}
