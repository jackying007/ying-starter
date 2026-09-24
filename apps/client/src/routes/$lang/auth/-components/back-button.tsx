import type { LinkProps } from '@tanstack/react-router'
import { cn, buttonVariants } from '@ying/shared-react/ui'
import { Link } from '@/components/link'

interface BackButtonProps {
  to: LinkProps['to']
  label: string
}

export const BackButton = ({ to, label }: BackButtonProps) => {
  return (
    <Link className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2')} to={to}>
      {label}
    </Link>
  )
}
