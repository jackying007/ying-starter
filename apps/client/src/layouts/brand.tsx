import { useParams } from '@tanstack/react-router'
import { cn } from '@ying/shared-react/ui'
import { Link } from '@/components/link'
import type { PropsWithClassName } from '@/types'

export const Brand = ({ className }: PropsWithClassName) => {
  const { lang } = useParams({ from: '/$lang' })

  return (
    <Link className={cn('flex z-40 font-semibold text-gray-950', className)} to="/$lang" params={{ lang }}>
      <span className="text-primary">Ying</span>Starter
    </Link>
  )
}
