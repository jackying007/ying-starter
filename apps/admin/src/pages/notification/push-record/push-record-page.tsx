import { Input, Select, Space, Tag, Typography, type SelectProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import { useDialogOpen } from '@ying/frontend/hooks'
import type { ListPushRecordDto, ListPushTaskDto } from '@ying/shared'
import type { PushRecordListVo } from '@ying/server/types-admin'

import { useQueryWithRequery, useTable } from '@/hooks'
import { notificationApi } from '@/api'
import { Page, PageQuery } from '@/layouts/page'
import { JsonViewModal } from '@/components/json-view-modal'

import { type PushRecordStatusOption, PushRecordStatusOptions } from './constant'

export default function PushRecordPage() {
  const { control, resetParams, list, listLoading, pagination } = useTable<ListPushRecordDto, PushRecordListVo[number]>(
    {
      key: 'push-record',
      getList: notificationApi.listPushRecord,
      getListCount: notificationApi.listPushRecordCount
    }
  )

  const { data: pushTasks, requery } = useQueryWithRequery({
    key: 'push-task-select-list',
    queryFn: async (params?: ListPushTaskDto) => {
      const data = await notificationApi.listPushTask({ size: 100, ...params })
      return data.map(el => ({ label: el.name, value: el.id })) as SelectProps['options']
    }
  })

  const jsonViewModalProps = useDialogOpen<object>()

  const columns: ColumnsType<PushRecordListVo[number]> = [
    {
      title: '推送任务',
      dataIndex: 'pushTask',
      width: 150,
      fixed: 'left',
      ellipsis: true,
      render: (_, record) => record.pushTask.name
    },
    {
      title: '浏览用户ID',
      minWidth: 300,
      ellipsis: true,
      dataIndex: 'visitorId'
    },
    {
      title: '是否点击',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'clicked',
      render: _ => (_ ? <Tag color="success">已点击</Tag> : <Tag>未点击</Tag>)
    },
    {
      title: '推送状态',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'status',
      render: _ => {
        const { color, label } = getOption<PushRecordStatusOption>(PushRecordStatusOptions, _) ?? {}
        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: '推送结果',
      width: 160,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushResult',
      render(_) {
        if (!_) return '-'
        let data = _
        try {
          data = JSON.parse(_)
        } catch {
          //
        }
        return <Typography.Link onClick={() => jsonViewModalProps.onOpen(data)}>查看</Typography.Link>
      }
    },
    {
      title: '推送内容',
      width: 140,
      ellipsis: true,
      align: 'center',
      dataIndex: 'pushData',
      render: _ => <Typography.Link onClick={() => jsonViewModalProps.onOpen(_)}>查看</Typography.Link>
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      fixed: 'right',
      render: (_, record) => dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  return (
    <Page
      header={
        <PageQuery control={control} reset={resetParams}>
          <Controller
            control={control}
            name="visitorId"
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">浏览用户ID</Space.Addon>
                <Input allowClear placeholder="请输入浏览用户ID" {...field} />
              </Space.Compact>
            )}
          />
          <Controller
            control={control}
            name="pushTaskId"
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon>推送任务</Space.Addon>
                <Select
                  style={{ width: 160 }}
                  placeholder="请选择推送任务"
                  allowClear
                  showSearch={{
                    filterOption: false,
                    onSearch: name => requery({ name })
                  }}
                  options={pushTasks}
                  {...field}
                />
              </Space.Compact>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon>推送状态</Space.Addon>
                <Select
                  style={{ width: 160 }}
                  allowClear
                  placeholder="请选择推送状态"
                  options={PushRecordStatusOptions}
                  {...field}
                />
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
      body={<JsonViewModal {...jsonViewModalProps} />}
      pagination={pagination}
    />
  )
}
