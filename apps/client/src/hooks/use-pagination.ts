import type { ListDto } from '@ying/shared'
import { usePaginationParams, usePaginationData, type UsePaginationDataOptions } from '@ying/frontend/hooks'
import type { PaginationsProps } from '@/components/paginations'

export const usePagination = <TParams extends ListDto, TData>(props: UsePaginationDataOptions<TParams, TData>) => {
  const { params, control, reset: resetParams, getValues: getParams } = usePaginationParams<TParams>()
  const { page, pageSize, setPage, setPageSize, list, listLoading, count, countLoading, reload, reloadCurrent } =
    usePaginationData({ params, ...props })

  const pagination: PaginationsProps = {
    page,
    pageSize,
    total: count,
    disabled: listLoading,
    loading: listLoading,
    onChange: (p, pS) => {
      setPage(p)
      setPageSize(pS)
    }
  }

  return {
    params,
    control,
    resetParams,
    getParams,
    list,
    listLoading,
    count,
    countLoading,
    reload,
    reloadCurrent,
    pagination
  }
}
