import { App, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { ListFeedbackDto } from '@ying/shared/dto'
import type { FeedbackEntity } from '@ying/shared/entity'

import { commonApi } from '@/api'
import { useTable } from '@/hooks'
import { Page, PageQuery, PageOperations } from '@/layouts/page'

export default function FeedbackPage() {
  const { message } = App.useApp()

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListFeedbackDto, FeedbackEntity>({
    key: 'feedback',
    getList: commonApi.listFeedback,
    getListCount: commonApi.listFeedbackCount
  })

  const columns: ColumnsType<FeedbackEntity> = [
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      fixed: 'left',
      ellipsis: true
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      render: (_, record) => (
        <div>
          {record.lastName} {record.firstName}
        </div>
      )
    },
    {
      title: '内容',
      dataIndex: 'content',
      minWidth: 240,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => <div>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          deleteTitle="确定删除？"
          onDelete={async () => {
            await commonApi.deleteFeedback(record.id)
            message.success('删除成功！')
            reload()
          }}
        />
      )
    }
  ]

  return (
    <Page
      header={
        <PageQuery control={control} reset={resetParams}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">邮箱</Space.Addon>
                <Input allowClear placeholder="请输入邮箱" autoComplete="off" {...field} />
              </Space.Compact>
            )}
          />
        </PageQuery>
      }
      table={{
        rowKey: 'id',
        loading: listLoading,
        dataSource: list,
        columns
      }}
      pagination={pagination}
    />
  )
}
