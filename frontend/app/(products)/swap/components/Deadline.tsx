import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import CustomSwapSettingTrigger from './CustomSwapSettingTrigger'
import styles from '../styles/swapsettings.module.css'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function DeadlineInput() {
  return (
    <Input
      type='text'
      placeholder='Deadline in minutes'
      className='focus-visible:ring-0 focus-visible:ring-offset-0'
    />
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
