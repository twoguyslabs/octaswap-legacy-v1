import { Button } from '@/components/ui/button'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { FaChevronDown } from 'react-icons/fa6'

export default function CustomSwapSettingTrigger({ text }: { text: string }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-x-3'>
        <p>{text}</p>
      </div>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' size='icon'>
          <FaChevronDown />
        </Button>
      </CollapsibleTrigger>
    </div>
  )
}
