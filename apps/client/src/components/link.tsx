import type { ComponentProps } from 'react'
import { Link as TanstackRouterLink } from '@tanstack/react-router'
import { cn } from '@ying/shared-react/ui'

type LinkProps = ComponentProps<typeof TanstackRouterLink>

const LinkInner = ({ className, children, ...props }: LinkProps) => {
  return (
    <TanstackRouterLink
      className={cn(
        'relative inline-flex items-center outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 text-foreground no-underline hover:opacity-80 text-[length:inherit] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </TanstackRouterLink>
  )
}

export const Link = LinkInner as typeof TanstackRouterLink
