import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import styles from '../styles/dexsettings.module.css'
import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction, useContext } from 'react'
import { Percent, TriangleAlert } from 'lucide-react'
import { DexSettingsContext } from './DexSettings'
import CustomSwapSettingTrigger from './CustomSwapSettingTrigger'

function SlippageWarning({ description }: { description: string }) {
  return (
    <div className='flex items-center justify-center gap-x-3 text-sm text-yellow-500'>
      <i>
        <TriangleAlert size={18} />
      </i>
      <span className='text-balance'>{description}</span>
    </div>
  )
}

function SlippageInput({
  slippage,
  onSetSlippage,
}: {
  slippage: SlippageType
  onSetSlippage: Dispatch<SetStateAction<SlippageType>>
}) {
  const disableState = slippage.state === 'auto'

  return (
    <div className='relative'>
      <Input
        type='text'
        placeholder='percent'
        className={cn('focus-visible:ring-0 focus-visible:ring-offset-0', slippage.percent > 50 && 'text-red-500')}
        disabled={disableState}
        onChange={(e) => onSetSlippage({ ...slippage, percent: +e.target.value })}
        value={slippage.percent ? slippage.percent : ''}
      />
      <i className='absolute bottom-3 right-2'>
        <Percent size={15} />
      </i>
    </div>
  )
}

function SlippageTogglerGroup({
  slippage,
  onTogglerChange,
}: {
  slippage: SlippageType
  onTogglerChange: (state: string) => void
}) {
  return (
    <ToggleGroup type='single' variant='outline' value={slippage.state} onValueChange={onTogglerChange}>
      <ToggleGroupItem value='auto' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
        Auto
      </ToggleGroupItem>
      <ToggleGroupItem value='custom' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
        Custom
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default function Slippage() {
  const { slippage, onSetSlippage } = useContext(DexSettingsContext) as DexSettingsContextType

  const handleToggler = (e: string) => {
    if (e === 'auto') {
      onSetSlippage({ state: e, percent: 5 })
    } else {
      onSetSlippage({ ...slippage, state: e })
    }
  }

  return (
    <Collapsible>
      <div className='space-y-2'>
        <CustomSwapSettingTrigger text='Slippage' />
        <CollapsibleContent className={cn(styles.collapsibleContent)}>
          <div className={cn((slippage.percent < 1 || slippage.percent > 50) && 'flex flex-col gap-y-4')}>
            <div className='flex items-center gap-x-5'>
              <SlippageTogglerGroup slippage={slippage} onTogglerChange={handleToggler} />
              <SlippageInput slippage={slippage} onSetSlippage={onSetSlippage} />
            </div>
            <div>
              {(slippage.percent < 1 && (
                <SlippageWarning description='Slippage below 1% may result in a failed transaction' />
              )) ||
                (slippage.percent > 50 && (
                  <SlippageWarning description='Your transaction may be frontrun and result in an unfavorable trade' />
                ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
