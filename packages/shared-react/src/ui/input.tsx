import * as React from 'react'

import { CloseIcon } from '../icons'
import { cn } from './utils'

function Input({
  type,
  clearable,
  classNames,
  ...props
}: React.ComponentProps<'input'> & {
  classNames?: {
    wrapper?: string
    input?: string
  }
  clearable?: boolean
}) {
  const clear = () => {
    if (props.disabled) return
    props.onChange?.('' as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={cn('relative', classNames?.wrapper)}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          classNames?.input
        )}
        {...props}
      />
      <CloseIcon
        className={cn(
          'h-9 absolute right-2 top-0 cursor-pointer opacity-100 transition-opacity',
          props.disabled && 'opacity-50 cursor-not-allowed',
          !(clearable && props.value) && 'opacity-0'
        )}
        onClick={clear}
      />
    </div>
  )
}

export { Input }
