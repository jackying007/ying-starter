import { Menu } from 'antd'
import { useThemeToken } from '@/hooks'
import { useSettings } from '@/store'
import { ThemeNavLayout } from '@/types/enum'
import { NAV_HORIZONTAL_HEIGHT } from '../constant'
import { useNavContext } from './use-nav-context'

export function NavHorizontal() {
  const { colorBgLayout } = useThemeToken()
  const { themeLayout } = useSettings()
  const isHorizontal = themeLayout === ThemeNavLayout.Horizontal
  const { selectedKeys, menuList, onClick } = useNavContext()

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: isHorizontal ? NAV_HORIZONTAL_HEIGHT : 0,
        transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      <Menu
        style={{
          background: colorBgLayout
        }}
        mode="horizontal"
        items={menuList}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        onClick={onClick}
      />
    </div>
  )
}
