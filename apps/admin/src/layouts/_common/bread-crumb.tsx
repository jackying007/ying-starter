import { Breadcrumb } from 'antd'
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useMemo } from 'react'
import { useMatches } from 'react-router-dom'

import { usePermissionRoutes, useRouter } from '@/router/hooks'

import type { PropsWithClassName } from '@/types'

/**
 * 动态面包屑解决方案：https://github.com/MinjieChang/myblog/issues/29
 */
export function BreadCrumb({ className }: PropsWithClassName) {
  const matches = useMatches()
  const { push } = useRouter()
  const { routeMetas, navMenuRoutes } = usePermissionRoutes()

  const breadCrumbs = useMemo(() => {
    const paths = matches.filter(item => item.pathname !== '/').map(item => item.pathname)
    const pathRouteMetas = routeMetas.filter(item => paths.indexOf(item.key) !== -1)

    return pathRouteMetas.map(routeMeta => {
      const { key, label } = routeMeta
      const items = navMenuRoutes.find(item => item.meta?.key === key)?.children?.filter(item => !item.meta?.hideMenu)
      const result: ItemType = {
        key,
        title: label
      }
      if (items) {
        result.menu = {
          items: items.map(item => ({
            key: item.meta?.key,
            label: (
              <span
                onClick={() => {
                  if (item.meta?.frameSrc) {
                    window.open(item.meta.frameSrc, '_black')
                    return
                  }
                  push(item.meta?.key || '')
                }}
              >
                {item.meta?.label}
              </span>
            )
          }))
        }
      }
      return result
    })
  }, [matches, routeMetas, navMenuRoutes, push])

  return <Breadcrumb className={className} items={breadCrumbs} />
}
