import { deepClone } from '@ying/utils'
import { useUserPermission } from '@/store/userStore'
import { MenuRoutes } from '@/router/routes/menu-routes'
import { transformRoutesByPermission, flattenRoutesToRouteMetas, routerFilter, navMenuFilter } from './utils'

export function usePermissionRoutes() {
  const permissions = useUserPermission()

  const transformedRoutes = transformRoutesByPermission(deepClone(MenuRoutes), permissions?.map(el => el.code) ?? [])

  const routeMetas = flattenRoutesToRouteMetas(transformedRoutes)

  const routerRoutes = routerFilter(transformedRoutes)

  const navMenuRoutes = navMenuFilter(transformedRoutes)

  return { routeMetas, routerRoutes, navMenuRoutes }
}
