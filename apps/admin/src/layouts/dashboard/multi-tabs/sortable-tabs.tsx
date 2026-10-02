import { useEffect, useRef } from 'react'
import { DndContext, type DragEndEvent, useSensor, PointerSensor, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { cn } from '@ying/shared-react/ui'
import { useThemeToken } from '@/hooks'
import type { PropsWithClassName } from '@/types'
import { MULTI_TABS_HEIGHT } from '../constant'
import { Main } from '../main'
import { useKeepaliveContext } from './use-keepalive-context'
import { SortableTab } from './sortable-tab'
import { FullscreenDrawer } from './fullscreen-drawer'

const modifiers = [
  restrictToHorizontalAxis, // 限制只能在水平轴移动
  restrictToParentElement // 限制拖拽范围不超出父级 scrollContainer
]

export function SortableTabs({ className }: PropsWithClassName) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { colorBgLayout } = useThemeToken()

  const { tabs, setTabs, activeTabKey } = useKeepaliveContext()

  /**
   * 拖拽结束事件
   */
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex(el => el.key === active.id)
      const newIndex = tabs.findIndex(el => el.key === over?.id)
      const newTabs = arrayMove(tabs, oldIndex, newIndex)
      setTabs(newTabs)
    }
  }

  /**
   * 路由变化时，滚动到指定tab
   */
  useEffect(() => {
    if (!scrollContainerRef?.current) return
    const currentTabElement = scrollContainerRef.current.querySelector(`[id="tab-${activeTabKey}"]`)
    if (currentTabElement) {
      currentTabElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [activeTabKey, tabs])

  /**
   * scrollContainer 监听wheel事件
   */
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    function handleMouseWheel(event: WheelEvent) {
      if (!scrollContainer) return
      scrollContainer.scrollLeft += event.deltaY
    }
    scrollContainer.addEventListener('wheel', handleMouseWheel, { passive: true })
    return () => scrollContainer.removeEventListener('wheel', handleMouseWheel)
  }, [])

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        ref={scrollContainerRef}
        style={{
          height: MULTI_TABS_HEIGHT,
          paddingTop: 4,
          background: colorBgLayout
        }}
        className="z-20 w-full border-b border-border overflow-x-auto overflow-y-hidden no-scrollbar flex flex-nowrap gap-x-1.5 px-3"
      >
        <DndContext onDragEnd={onDragEnd} sensors={[sensor]} collisionDetection={closestCenter} modifiers={modifiers}>
          <SortableContext items={tabs.map(i => i.key)} strategy={horizontalListSortingStrategy}>
            {tabs.map(tab => (
              <SortableTab key={tab.key} tab={tab} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {tabs.map(tab => {
        if (tab.hideInFullscreen) return null
        return (
          <Main key={tab.timeStamp} className={tab.key === activeTabKey ? 'block' : 'hidden'}>
            {tab.outlet}
          </Main>
        )
      })}
      <FullscreenDrawer />
    </div>
  )
}
