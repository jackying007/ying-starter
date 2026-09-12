import { useCallback, useRef, useState } from 'react'

import type { ListDto } from '@ying/shared'

type UseFetchScrollPageOptioons<T> = {
  listApi: (pageOptions: ListDto) => Promise<T[]> | undefined
  defaultPageSize?: number
}

export const useFetchScrollPage = <T>({ listApi, defaultPageSize = 10 }: UseFetchScrollPageOptioons<T>) => {
  const pageRef = useRef(1)
  const size = defaultPageSize

  const [list, setList] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)

  const loadList = useCallback(async () => {
    try {
      const page = pageRef.current
      const newList = await listApi({ page, size })

      if (!newList) return
      if (newList.length < size) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      if (page === 1) {
        setList(newList)
      } else {
        setList(prev => [...prev, ...newList])
      }
    } catch (error) {
      console.error(error)
    }
  }, [listApi, size])

  const reload = useCallback(() => {
    pageRef.current = 1
    return loadList()
  }, [loadList])

  const loadMore = useCallback(() => {
    pageRef.current = pageRef.current + 1
    return loadList()
  }, [loadList])

  return {
    list,
    reload,
    loadMore,
    hasMore
  }
}
