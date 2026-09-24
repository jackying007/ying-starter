import { cn } from '@ying/shared-react/ui'
import type { PropsWithClassAndChild } from '@/types'

export const MaxWidthWrapper = ({ className, children }: PropsWithClassAndChild) => {
  return <div className={cn('h-full mx-auto w-full max-w-7xl px-2.5 md:px-20', className)}>{children}</div>
}
