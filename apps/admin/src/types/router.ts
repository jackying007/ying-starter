import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

import type { TPermission } from '@ying/shared/permission'

export type RouteMeta = {
  /**
   * antd menu selectedKeys
   */
  key: string
  /**
   * menu label, i18n
   */
  label: string
  /**
   * menu prefix icon
   */
  icon?: ReactNode | string
  /**
   * hide in menu
   */
  hideMenu?: boolean
  /**
   * hide in multi tab
   */
  hideTab?: boolean
  /**
   * disable in menu
   */
  disabled?: boolean
  /**
   * external link and iframe need
   */
  frameSrc?: string
  /**
   * the permission object
   */
  permission?: TPermission
}
export type AppRouteObject = {
  sort?: number
  meta?: RouteMeta
  children?: AppRouteObject[]
} & Omit<RouteObject, 'children'>
