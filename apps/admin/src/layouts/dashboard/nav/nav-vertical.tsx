import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { cn } from '@ying/frontend/ui'
import { Scrollbar } from '@/components/scrollbar'
import { useResponsive, useThemeToken } from '@/hooks'
import { useSettings, setSettings } from '@/store'
import { ThemeNavLayout } from '@/types/enum'
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from '../constant'
import { useNavContext } from './use-nav-context'

type NavProps = {
  show?: boolean
  onMenuClick?: () => void
}
export function NavVertical({ show, onMenuClick }: NavProps) {
  const { colorBgLayout } = useThemeToken()
  const settings = useSettings()
  const { themeLayout, navCollapsed } = settings
  const isVertical = themeLayout === ThemeNavLayout.Vertical
  const { screenMap } = useResponsive()
  const { defaultOpenKeys, selectedKeys, menuList, onClick } = useNavContext()

  const toggleCollapsed = () => {
    setSettings({
      ...settings,
      navCollapsed: !navCollapsed
    })
  }

  return (
    <div
      className="flex flex-col z-50 h-full border-r border-border relative"
      style={{
        width: (screenMap.md || show) && isVertical ? (navCollapsed ? NAV_COLLAPSED_WIDTH : NAV_WIDTH) : 0,
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      <button
        onClick={toggleCollapsed}
        className={cn(
          'hidden md:block w-6 h-6 absolute right-0 top-8 z-50 translate-x-1/2 cursor-pointer select-none text-center text-base opacity-0 transition-opacity',
          isVertical && 'opacity-100'
        )}
      >
        {navCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
      <Scrollbar>
        <Menu
          className="border-none!"
          style={{
            background: colorBgLayout
          }}
          mode="inline"
          inlineCollapsed={navCollapsed}
          items={menuList}
          defaultOpenKeys={navCollapsed ? [] : defaultOpenKeys}
          defaultSelectedKeys={selectedKeys}
          selectedKeys={selectedKeys}
          // onOpenChange={onOpenChange}
          onClick={menuInfo => {
            onClick(menuInfo)
            onMenuClick?.()
          }}
        />
      </Scrollbar>
    </div>
  )
}
