import { useRouter } from '@tanstack/react-router'

export const useHasAuth = () => {
  const router = useRouter()
  return !!router.options.context.auth.accessToken
}
