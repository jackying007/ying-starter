import { useState, useEffect } from 'react'
import { LuCheck, LuClipboard } from 'react-icons/lu'

import { copyText } from '@ying/shared-web'
import { cn, Button, type buttonVariants, type VariantProps } from '@ying/shared-react/ui'

type CopyButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string
  value: string
}

export function CopyButton({ className, value, variant = 'outline', ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn('relative h-8 w-8', className)}
      onClick={() => {
        copyText(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <LuCheck /> : <LuClipboard />}
    </Button>
  )
}
