import { cn } from '@ying/shared-react/ui'
import type { PropsWithClassAndChild } from '@/types'
import { CopyButton } from '@/components/copy-button'

type CopyTextProps = PropsWithClassAndChild & {
  value: string
}

export const CopyText = ({ className, value, children }: CopyTextProps) => {
  return (
    <div
      className={cn(
        'flex gap-x-2 items-center justify-between px-3 py-2 rounded-md text-base bg-background shadow-sm',
        className
      )}
    >
      {children ? children : value}
      <CopyButton value={value} />
    </div>
  )
}
