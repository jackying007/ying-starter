import { useEffect, useMemo } from 'react'
import { useMatches, useOutlet, matchPath } from 'react-router-dom'
import { deepCopy } from '@ying/utils'
import { usePermissionRoutes, useRouter } from '@/router/hooks'
import type { KeepAliveRoute } from './type'

export function useCurrentKeepAliveRoute() {
  const outlet = useOutlet()
  // 获取所有匹配的路由
  const matchs = useMatches()
  // 获取拍平后的所有路由信息
  const { routeMetas } = usePermissionRoutes()
  const { push } = useRouter()

  const currentKeepAliveRoute = useMemo(() => {
    const lastRoute = matchs.at(-1)
    if (!lastRoute) return undefined
    for (const item of routeMetas) {
      const matchedPath = matchPath(item.key, lastRoute.pathname)
      if (matchedPath) {
        const route = deepCopy(item) as KeepAliveRoute
        // 如果匹配成功，且实际路径与配置的路径模式不一致, 如 `/user/:id` 匹配到了 `/user/123`, 则将当前真实的路径 `/user/123` 赋值给 route 的 key
        if (matchedPath.pathname !== matchedPath.pattern.path) {
          route.key = matchedPath.pathname
        }
        if (!route.hideTab) {
          route.outlet = outlet
        }
        return route
      }
    }
    return undefined
  }, [matchs, routeMetas, outlet])

  useEffect(() => {
    if (!currentKeepAliveRoute) {
      push(import.meta.env.APP_HOMEPAGE)
    }
  }, [currentKeepAliveRoute, push])

  return currentKeepAliveRoute
}
