import { useState } from 'react'
import type { CSSProperties, Ref, MouseEventHandler, MouseEvent, ReactNode } from 'react'
import type { IconProps } from '@iconify/react'
import { cn } from '@ying/shared-react/ui'
import { Iconify } from './iconify-icon'

type Props = {
  ref?: Ref<HTMLButtonElement>
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>
  disabled?: boolean
  iconSize?: IconProps['width']
}
export function IconButton({ ref, children, className, style, onClick, disabled, iconSize }: Props) {
  const [loading, setLoading] = useState(false)
  const handleClick: MouseEventHandler<HTMLButtonElement> = async e => {
    if (!onClick) return
    setLoading(true)
    try {
      await Promise.resolve(onClick(e))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <button
      ref={ref}
      type="button"
      style={style}
      className={cn(
        'cursor-pointer fc rounded-full p-2 disabled:grayscale disabled:bg-hover hover:bg-hover',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? <Iconify icon="eos-icons:loading" size={iconSize} /> : children}
    </button>
  )
}
