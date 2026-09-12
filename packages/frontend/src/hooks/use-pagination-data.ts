import { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { ListDto } from '@ying/shared/dto'

export type UsePaginationDataOptions<TParams extends ListDto, TData> = {
  key: string
  params?: any
  getList: (params: TParams) => Promise<TData[]>
  getListCount: (params: TParams) => Promise<number>
  initialPage?: number
  initialPageSize?: 10 | 20 | 30 | 40 | 50 | 80 | 100
  initialList?: TData[]
  initialListCount?: number
}

export const usePaginationData = <TParams extends ListDto, TData>({
  key,
  params,
  getList,
  getListCount,
  initialPage = 1,
  initialPageSize = 10,
  initialList,
  initialListCount
}: UsePaginationDataOptions<TParams, TData>) => {
  const [page, setPage] = useState<number>(initialPage)
  const [pageSize, setPageSize] = useState<number>(initialPageSize)

  const isUseInitialList = page === initialPage && pageSize === initialPageSize

  const {
    data: list,
    isFetching: listLoading,
    refetch: refetchList
  } = useQuery<TData[]>({
    queryKey: [`${key}-list`, params, page, pageSize],
    queryFn: () => getList({ ...params, page, size: pageSize }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    initialData: isUseInitialList ? initialList : undefined,
    staleTime: 10 * 1000
  })

  const {
    data: count,
    isFetching: countLoading,
    refetch: refetchListCount
  } = useQuery({
    queryKey: [`${key}-list-count`, params],
    queryFn: () => getListCount(params ?? {}),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    initialData: initialListCount,
    staleTime: 10 * 1000
  })

  const reload = () => {
    setPage(1)
    setTimeout(() => {
      refetchList()
      refetchListCount()
    })
  }

  const reloadCurrent = () => {
    refetchList()
  }

  useEffect(() => {
    if (params) reload()
  }, [params])

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    list,
    listLoading,
    count,
    countLoading,
    reload,
    reloadCurrent
  }
}
