import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/router/hooks'
import { useCurrentKeepAliveRoute } from './use-current-route-meta'
import type { KeepAliveRoute } from './type'

function getKey() {
  return new Date().getTime().toString()
}

export function useKeepAlive() {
  const { push } = useRouter()
  const [tabs, setTabs] = useState<KeepAliveRoute[]>([])
  const tabsRef = useRef(tabs)
  useEffect(() => {
    tabsRef.current = tabs
  }, [tabs])
  const currentKeepAliveRoute = useCurrentKeepAliveRoute()
  const activeTabKey = currentKeepAliveRoute?.key
  const [fullscreenTabKey, setFullscreenTabKey] = useState<string>()
  const currentFullscreenTab = tabs.find(tab => tab.key === fullscreenTabKey)

  const refreshTab = (path: string) => {
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      if (currentTabIndex >= 0) {
        prevTabs[currentTabIndex].timeStamp = getKey()
      }
      return [...prevTabs]
    })
  }

  const fullscreenTab = (path: string) => {
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      if (currentTabIndex >= 0) {
        prevTabs[currentTabIndex].hideInFullscreen = true
      }
      return [...prevTabs]
    })
    setFullscreenTabKey(path)
  }

  const exitFullscreenTab = () => {
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === currentFullscreenTab?.key)
      if (currentTabIndex >= 0) {
        prevTabs[currentTabIndex].hideInFullscreen = false
      }
      return [...prevTabs]
    })
    setFullscreenTabKey(undefined)
  }

  const closeTab = (path: string) => {
    setTabs(prevTabs => {
      if (prevTabs.length === 1) return prevTabs
      const deleteTabIndex = prevTabs.findIndex(item => item.key === path)
      if (path === activeTabKey) {
        if (deleteTabIndex > 0) {
          push(prevTabs[deleteTabIndex - 1].key)
        } else {
          push(prevTabs[deleteTabIndex + 1].key)
        }
      }
      return prevTabs.toSpliced(deleteTabIndex, 1)
    })
  }

  const closeLeft = (path: string) => {
    push(path)
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      return prevTabs.slice(currentTabIndex)
    })
  }

  const closeRight = (path: string) => {
    push(path)
    setTabs(prevTabs => {
      const currentTabIndex = prevTabs.findIndex(item => item.key === path)
      return prevTabs.slice(0, currentTabIndex + 1)
    })
  }

  const closeOthersTab = (path: string) => {
    push(path)
    setTabs(prevTabs => prevTabs.filter(item => item.key === path))
  }

  const closeAll = () => {
    setTabs([])
    push(import.meta.env.APP_HOMEPAGE)
  }

  useEffect(() => {
    if (!currentKeepAliveRoute) return
    const existed = tabsRef.current.find(item => item.key === currentKeepAliveRoute.key)
    if (!existed) {
      setTabs(prev => [
        ...prev,
        {
          ...currentKeepAliveRoute,
          timeStamp: getKey()
        }
      ])
    }
  }, [currentKeepAliveRoute])

  return {
    tabs,
    setTabs,
    activeTabKey,
    currentFullscreenTab,
    refreshTab,
    fullscreenTab,
    exitFullscreenTab,
    closeTab,
    closeLeft,
    closeRight,
    closeOthersTab,
    closeAll
  }
}
