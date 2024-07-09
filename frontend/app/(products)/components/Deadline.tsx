import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import styles from '../styles/dexsettings.module.css'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import CustomSwapSettingTrigger from './CustomSwapSettingTrigger'
import { DexSettingsContext } from './DexSettings'

function DeadlineInput() {
  const { minutes, onSetMinutes } = useContext(DexSettingsContext) as DexSettingsContextType

  return (
    <div className='relative'>
      <Input
        type='text'
        placeholder='5'
        className={cn('focus-visible:ring-0 focus-visible:ring-offset-0', minutes > 60 && 'text-red-500')}
        value={minutes}
        onChange={(e) => onSetMinutes(e.target.value)}
      />
      <span className='absolute bottom-[8px] right-2'>minutes</span>
    </div>
  )
}

export default function Deadline() {
  return (
    <Collapsible>
      <div className='space-y-2'>
        <CustomSwapSettingTrigger text='Transaction Deadline' />
        <CollapsibleContent className={cn(styles.collapsibleContent)}>
          <DeadlineInput />
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
