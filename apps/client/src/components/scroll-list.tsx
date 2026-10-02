import { useCallback, useEffect, useRef, useState } from 'react'
import { LuCheck, LuLoader } from 'react-icons/lu'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import Pullup from '@better-scroll/pull-up'
import MouseWheel from '@better-scroll/mouse-wheel'
import { useTranslation } from 'react-i18next'
import { useInView } from '@ying/shared-react/hooks'
import { cn } from '@ying/shared-react/ui'
import { LoadingIconV1 } from '@ying/shared-react/icons'
import type { PropsWithClassAndChild } from '@/types'
import { Empty } from '@/components/empty'

type ScrollListProps = PropsWithClassAndChild & {
  reload: () => Promise<void>
  loadMore: () => Promise<void>
  onBSReady?: (bs: BScroll) => void
  hasMore: boolean
  empty?: boolean
}

const TIME_BOUNCE = 300

export function ScrollList({
  children,
  className,
  reload,
  loadMore,
  onBSReady,
  hasMore,
  empty = false
}: ScrollListProps) {
  BScroll.use(PullDown).use(Pullup).use(MouseWheel)

  const { t } = useTranslation()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<BScroll>(undefined)
  const wrapperInView = useInView(wrapperRef)

  const [y, setY] = useState(0)
  const [beforePullDown, setBeforePullDown] = useState(true)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [isPullUpLoad, setIsPullUpLoad] = useState(false)
  const [inited, setInited] = useState(false)

  const scrollRefresh = useCallback(() => {
    setTimeout(() => {
      if (!scrollRef.current) return
      scrollRef.current.refresh()
    }, TIME_BOUNCE)
  }, [])

  const initLoad = useCallback(async () => {
    if (wrapperInView && !inited) {
      await reload()
      setInited(true)
    }
    scrollRefresh()
  }, [wrapperInView, inited, reload, scrollRefresh])

  const pullingDownHandler = useCallback(async () => {
    setBeforePullDown(false)
    setIsPullingDown(true)

    await reload()

    setIsPullingDown(false)

    await new Promise(re => setTimeout(re, 500))

    setTimeout(() => {
      setBeforePullDown(true)
    }, TIME_BOUNCE)

    scrollRef.current!.finishPullDown()

    scrollRefresh()
  }, [scrollRefresh, reload])

  const pullingUpHandler = useCallback(async () => {
    if (!hasMore) return
    setIsPullUpLoad(true)
    await loadMore()

    setIsPullUpLoad(false)

    scrollRef.current!.finishPullUp()

    scrollRefresh()
  }, [scrollRefresh, loadMore, hasMore])

  const handleScroll = useCallback((data: any) => {
    if (data.y >= 0) {
      setY(data.y)
    }
  }, [])

  useEffect(() => {
    let BS: BScroll
    if (!scrollRef.current) {
      if (!wrapperRef.current) return
      BS = scrollRef.current = new BScroll(wrapperRef.current, {
        probeType: 3,
        click: true,
        scrollbar: true,
        pullDownRefresh: {
          stop: 80
        },
        pullUpLoad: true,
        mouseWheel: true
      })
    } else {
      BS = scrollRef.current
    }

    BS.on('pullingDown', pullingDownHandler)
    BS.on('pullingUp', pullingUpHandler)
    BS.on('scroll', handleScroll)

    onBSReady?.(BS)
    initLoad()
    return () => {
      BS.off('pullingDown', pullingDownHandler)
      BS.off('pullingUp', pullingUpHandler)
      BS.off('scroll', handleScroll)
    }
  }, [pullingDownHandler, pullingUpHandler, handleScroll, onBSReady, initLoad])

  return (
    <div ref={wrapperRef} className={cn('overflow-hidden relative', className)}>
      {!inited ? (
        <div className="flex items-center justify-center h-full">
          <LoadingIconV1 className="text-3xl text-primary" />
        </div>
      ) : (
        <div>
          <div className="absolute -translate-y-full w-full px-2 py-6 box-border flex justify-center">
            <div className={cn('hidden gap-2 items-center text-gray-400', beforePullDown && 'flex')}>
              <LuLoader className="text-xl" style={{ transform: `rotate(${y * 2}deg)` }} />
              <span className="text-base">{t('Pull down and refresh')}</span>
            </div>
            <div className={cn('hidden items-center gap-2 text-primary', !beforePullDown && 'flex')}>
              {isPullingDown ? (
                <LoadingIconV1 className="text-2xl text-primary" />
              ) : (
                <>
                  <LuCheck />
                  <span>{t('Load success')}</span>
                </>
              )}
            </div>
          </div>
          {children}
          {empty ? (
            <Empty />
          ) : (
            <div className="flex justify-center text-gray-400 px-2 py-6 box-border">
              {isPullUpLoad ? (
                <LoadingIconV1 className="text-2xl text-primary" />
              ) : hasMore ? (
                <span>{t('Pull up and load more')}</span>
              ) : (
                <span>{t('No more')}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
