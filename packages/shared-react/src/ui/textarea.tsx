import * as React from 'react'
import { CloseIcon } from '../icons'
import { cn } from './utils'

function Textarea({ className, clearable, ...props }: React.ComponentProps<'textarea'> & { clearable?: boolean }) {
  const clear = () => {
    if (props.disabled) return
    props.onChange?.('' as unknown as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div className="relative">
      <textarea
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      <CloseIcon
        className={cn(
          'absolute right-2 top-2 cursor-pointer opacity-100 transition-opacity',
          props.disabled && 'opacity-0 cursor-not-allowed',
          !(clearable && props.value) && 'opacity-0'
        )}
        onClick={clear}
      />
    </div>
  )
}

export { Textarea }
