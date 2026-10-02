import { cn } from '@ying/shared-react/ui'
import { useSettings } from '@/store'
import { useThemeToken } from '@/hooks'
import type { Ref } from 'react'

type MainProps = {
  ref?: Ref<HTMLDivElement>
  children: React.ReactNode
  className?: string
}
export function Main({ ref, children, className }: MainProps) {
  const { themeStretch } = useSettings()
  const { padding } = useThemeToken()

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto max-w-full w-full h-full overflow-x-hidden overflow-y-auto no-scrollbar',
        !themeStretch && 'xl:max-w-screen-xl',
        className
      )}
      style={{
        transition: 'max-width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        padding
      }}
    >
      {children}
    </div>
  )
}
