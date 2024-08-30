import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function LockDuration({
  remainingLockDays,
  progressPercentage,
}: {
  remainingLockDays: number
  progressPercentage: number
}) {
  return (
    <div className='mt-6'>
      <div className='mb-2 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>Lock Duration</p>
        <p className='text-sm font-medium'>{remainingLockDays ?? 0} days left</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Progress value={progressPercentage ?? 0} className='h-2' />
          </TooltipTrigger>
          <TooltipContent>
            <p>{progressPercentage?.toFixed(2)}% complete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
