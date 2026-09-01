import { createContext } from 'react'
import type { MenuProps } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'

export type NavContextValue = {
  defaultOpenKeys: string[]
  selectedKeys: string[]
  menuList: ItemType[]
  onClick: NonNullable<MenuProps['onClick']>
}

export const NavContext = createContext<NavContextValue | undefined>(undefined)
