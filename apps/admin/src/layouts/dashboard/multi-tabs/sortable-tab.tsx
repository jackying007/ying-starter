import { Dropdown, type MenuProps } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'
import { CloseOutlined } from '@ant-design/icons'
import { type CSSProperties, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@ying/shared-react/ui'
import { Iconify } from '@/components/icon'
import { useRouter } from '@/router/hooks'
import { useThemeToken } from '@/hooks'
import { MultiTabOperation } from '@/types/enum'
import { useKeepaliveContext } from './use-keepalive-context'
import type { KeepAliveRoute } from './type'

const menuItems: NonNullable<ItemType>[] = [
  {
    label: '刷新',
    key: MultiTabOperation.REFRESH,
    icon: <Iconify icon="mdi:reload" size={18} />
  },
  {
    label: '内容全屏',
    key: MultiTabOperation.FULLSCREEN,
    icon: <Iconify icon="material-symbols:fullscreen" size={18} />
  },
  {
    label: '关闭标签页',
    key: MultiTabOperation.CLOSE,
    icon: <Iconify icon="material-symbols:close" size={18} />
  },
  {
    type: 'divider'
  },
  {
    label: '关闭左侧标签页',
    key: MultiTabOperation.CLOSELEFT,
    icon: <Iconify icon="material-symbols:tab-close-right-outline" size={18} className="rotate-180" />
  },
  {
    label: '关闭右侧标签页',
    key: MultiTabOperation.CLOSERIGHT,
    icon: <Iconify icon="material-symbols:tab-close-right-outline" size={18} />
  },
  {
    type: 'divider'
  },
  {
    label: '关闭其它标签页',
    key: MultiTabOperation.CLOSEOTHERS,
    icon: <Iconify icon="material-symbols:tab-close-outline" size={18} />
  },
  {
    label: '关闭所有标签页',
    key: MultiTabOperation.CLOSEALL,
    icon: <Iconify icon="mdi:collapse-all-outline" size={18} />
  }
]

const ItemTransition = 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'

type SortableTabProps = { tab: KeepAliveRoute }
export function SortableTab({ tab }: SortableTabProps) {
  const { push } = useRouter()
  const themeToken = useThemeToken()
  const { tabs, activeTabKey, closeTab, refreshTab, closeOthersTab, closeAll, closeLeft, closeRight, fullscreenTab } =
    useKeepaliveContext()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.key })
  const [isHover, setIsHover] = useState(false)

  const items = menuItems.map(el => {
    let disabled = false
    if (el.key === MultiTabOperation.CLOSE || el.key === MultiTabOperation.CLOSEOTHERS) {
      disabled = tabs.length === 1
    }
    if (el.key === MultiTabOperation.CLOSELEFT) {
      disabled = tabs.findIndex(el => el.key === tab.key) === 0
    }
    if (el.key === MultiTabOperation.CLOSERIGHT) {
      disabled = tabs.findIndex(el => el.key === tab.key) === tabs.length - 1
    }
    return {
      ...el,
      disabled
    }
  })
  const onClick: MenuProps['onClick'] = menuInfo => {
    const { key, domEvent } = menuInfo
    domEvent.stopPropagation()
    switch (key) {
      case MultiTabOperation.REFRESH:
        refreshTab(tab.key)
        break
      case MultiTabOperation.FULLSCREEN:
        fullscreenTab(tab.key)
        break
      case MultiTabOperation.CLOSE:
        closeTab(tab.key)
        break
      case MultiTabOperation.CLOSEOTHERS:
        closeOthersTab(tab.key)
        break
      case MultiTabOperation.CLOSELEFT:
        closeLeft(tab.key)
        break
      case MultiTabOperation.CLOSERIGHT:
        closeRight(tab.key)
        break
      case MultiTabOperation.CLOSEALL:
        closeAll()
        break
      default:
        break
    }
  }

  const style: CSSProperties = {
    transform: transform ? CSS.Transform.toString({ ...transform, scaleX: 1, scaleY: 1 }) : undefined,
    transition: `${ItemTransition},${transition ?? ''}`,
    borderRadius: '8px 8px 0 0',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderBottom: 'none',
    borderColor: themeToken.colorBorder,
    backgroundColor: themeToken.colorBgContainer,
    zIndex: isDragging ? 99 : 'auto'
  }
  if (isHover) {
    style.backgroundColor = themeToken.colorBgContainer
    style.color = themeToken.colorPrimaryText
    style.borderColor = themeToken.colorPrimary
  }
  const isActive = tab.key === activeTabKey
  if (isActive) {
    style.backgroundColor = themeToken.colorBgLayout
    style.color = themeToken.colorPrimaryText
    style.borderColor = themeToken.colorPrimary
  }

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={{
        items,
        onClick
      }}
    >
      <div
        ref={setNodeRef}
        id={`tab-${tab.key}`}
        className="shrink-0 px-2 py-1 cursor-grab select-none flex gap-x-0.5 items-center"
        style={style}
        onClick={() => push(tab.key)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...attributes}
        {...listeners}
      >
        <div>{tab.label}</div>
        <CloseOutlined
          onClick={e => {
            e.stopPropagation()
            closeTab(tab.key)
          }}
          className={cn('opacity-0 transition-opacity', (isActive || isHover) && tabs.length !== 1 && 'opacity-100')}
        />
      </div>
    </Dropdown>
  )
}
