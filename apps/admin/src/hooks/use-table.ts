import { useState } from 'react'
import type { TablePaginationConfig } from 'antd'
import type { TableRowSelection } from 'antd/es/table/interface'

import { usePaginationParams, usePaginationData, type UsePaginationDataOptions } from '@ying/frontend/hooks'
import type { ListDto } from '@ying/shared'

export const useTable = <TParams extends ListDto, TData>(props: UsePaginationDataOptions<TParams, TData>) => {
  const { params, control, reset: resetParams, getValues: getParams } = usePaginationParams<TParams>()
  const { page, pageSize, setPage, setPageSize, list, listLoading, count, countLoading, reload, reloadCurrent } =
    usePaginationData({ ...props, params: { ...params, ...props.params } })

  const pagination: TablePaginationConfig = {
    current: page,
    total: count,
    pageSize,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 40, 50, 80, 100],
    onChange: (page, pageSize) => {
      setPage(page)
      setPageSize(pageSize)
    },
    showTotal: () => `总共 ${count} 条`
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const rowSelection: TableRowSelection<TData> = {
    columnWidth: 50,
    fixed: 'left',
    selectedRowKeys,
    onChange: keys => {
      setSelectedRowKeys(keys)
    }
  }
  return {
    control,
    resetParams,
    getParams,
    list,
    listLoading,
    count,
    countLoading,
    reload,
    reloadCurrent,
    pagination,
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection
  }
}
