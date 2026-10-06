import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore, refreshUserInfo } from '@/store/auth-store'

export const useAuth = () => {
  const router = useRouter()
  useEffect(() => {
    useAuthStore.setState(router.options.context.auth)
    const unsubscribe = useAuthStore.subscribe((cur, prev) => {
      if (cur.accessToken !== prev.accessToken) {
        // 重新触发 beforeLoad
        router.invalidate()
      }
    })
    return unsubscribe
  }, [router])

  const refreshToken = useAuthStore(state => state.refreshToken)
  useEffect(() => {
    if (refreshToken) refreshUserInfo()
  }, [refreshToken])
}
