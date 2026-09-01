import { type PropsWithChildren, type ReactNode, useMemo } from 'react'
import type { ItemType } from 'antd/es/menu/interface'
import { useLocation } from 'react-router-dom'

import { Iconify } from '@/components/icon'
import { usePermissionRoutes, useRouter } from '@/router/hooks'
import type { AppRouteObject } from '@/types/router'

import { NavContext, type NavContextValue } from './nav-context'

type MenuItem = {
  key?: string
  label?: string
  disabled?: boolean
  icon?: ReactNode
  children?: MenuItem[]
}

function routeToMenu(items: AppRouteObject[]) {
  return items
    .filter(item => !item.meta?.hideMenu)
    .map(item => {
      const menuItem: MenuItem = {}
      const { meta, children } = item
      if (meta) {
        const { key, label, icon, disabled } = meta
        menuItem.key = key
        menuItem.label = label
        menuItem.disabled = disabled
        if (typeof icon === 'string') {
          menuItem.icon = <Iconify icon={icon} />
        } else {
          menuItem.icon = icon
        }
      }
      if (children) {
        menuItem.children = routeToMenu(children)
      }
      return menuItem
    })
}

function pushOpenKeys(menuList: MenuItem[], keys: string[]) {
  menuList.forEach(menu => {
    if (menu.children?.length && menu.key) {
      keys.push(menu.key)
      pushOpenKeys(menu.children, keys)
    }
  })
}

function getOpenKeys(menuList: MenuItem[]) {
  const keys: string[] = []
  pushOpenKeys(menuList, keys)
  return keys
}

export const NavContextProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter()
  const { pathname } = useLocation()
  const { navMenuRoutes, routeMetas } = usePermissionRoutes()

  const selectedKeys = useMemo(() => [pathname], [pathname])
  const menuList = routeToMenu(navMenuRoutes)
  const defaultOpenKeys = getOpenKeys(menuList)

  const onClick: NavContextValue['onClick'] = ({ key }) => {
    const currentRoute = routeMetas.find(el => el.key === key)
    if (currentRoute?.frameSrc) {
      window.open(currentRoute.frameSrc, '_black')
      return
    }
    push(key)
  }

  return (
    <NavContext.Provider
      value={{
        defaultOpenKeys,
        selectedKeys,
        menuList: menuList as ItemType[],
        onClick
      }}
    >
      {children}
    </NavContext.Provider>
  )
}
