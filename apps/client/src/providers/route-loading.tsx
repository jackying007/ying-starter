import { useRouterState } from '@tanstack/react-router'
import { useMounted } from '@ying/shared-react/hooks'
import { LoadingBar } from '@/components/loading-bar'

export function RouteLoading() {
  const { status } = useRouterState()
  const mounted = useMounted()

  const loading = !mounted || status === 'pending'

  return <LoadingBar classNames={{ wrapper: 'fixed z-999', bar: 'via-primary/70' }} loading={loading} />
}
