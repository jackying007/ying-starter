import { useState, useEffect } from 'react'

const getFullscreenElement = () => {
  return document.fullscreenElement
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enterFullscreen = () => {
    const requestMethod = document.documentElement.requestFullscreen
    if (requestMethod) {
      // 部分浏览器 Promise reject 时需捕获异常，避免控制台报错
      const result = requestMethod.call(document.documentElement)
      if (result && typeof result.catch === 'function') {
        result.catch(err => console.error('进入全屏失败:', err))
      }
    }
  }

  const exitFullscreen = () => {
    const exitMethod = document.exitFullscreen
    if (exitMethod) {
      const result = exitMethod.call(document)
      // 部分浏览器 Promise reject 时需捕获异常，避免控制台报错
      if (result && typeof result.catch === 'function') {
        result.catch(err => console.error('退出全屏失败:', err))
      }
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement())
    }
    handleFullscreenChange()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 拦截 F11 默认行为，接管全屏操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault()
        if (getFullscreenElement()) exitFullscreen()
        else enterFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enterFullscreen, exitFullscreen])

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
