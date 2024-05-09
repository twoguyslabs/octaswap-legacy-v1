import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import CustomSwapSettingTrigger from './CustomSwapSettingTrigger'
import styles from '../styles/swapsettings.module.css'
import { cn } from '@/lib/utils'

function SlippageInput() {
  return (
    <Input
      type='text'
      placeholder='1%'
      className='focus-visible:ring-0 focus-visible:ring-offset-0'
    />
  )
}

function SlippageTogglerGroup() {
  return (
    <ToggleGroup type='multiple' variant='outline' value={['auto']}>
      <ToggleGroupItem value='auto'>Auto</ToggleGroupItem>
      <ToggleGroupItem value='custom'>Custom</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default function Slippage() {
  return (
    <Collapsible>
      <div className='space-y-2'>
        <CustomSwapSettingTrigger text='Slippage' />
        <CollapsibleContent className={cn(styles.collapsibleContent)}>
          <div className='flex items-center gap-x-5'>
            <SlippageTogglerGroup />
            <SlippageInput />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
