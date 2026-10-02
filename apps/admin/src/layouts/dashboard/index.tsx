import { Outlet } from 'react-router-dom'
import { useSettings, useSocketIo } from '@/store'
import { useThemeToken } from '@/hooks'
import { NavContextProvider, NavVertical, NavHorizontal } from './nav'
import { Header } from './header'
import { Main } from './main'
import { MultiTabs } from './multi-tabs'

export default function DashboardLayout() {
  useSocketIo()
  const { colorBgLayout, colorTextBase } = useThemeToken()
  const { multiTab } = useSettings()

  return (
    <NavContextProvider>
      <div
        className="h-screen w-screen overflow-hidden flex flex-col"
        style={{
          color: colorTextBase,
          background: colorBgLayout,
          transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <Header />
        <NavHorizontal />
        <div className="min-h-0 flex-1 flex">
          <NavVertical />
          {multiTab ? (
            <MultiTabs className="flex-1 min-w-0" />
          ) : (
            <Main className="flex-1 min-w-0">
              <Outlet />
            </Main>
          )}
        </div>
      </div>
    </NavContextProvider>
  )
}
