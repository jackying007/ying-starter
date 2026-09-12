import { App, Button, Input, Popconfirm, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import { useDialogOpen } from '@ying/frontend/hooks'

import { PushTaskStatus } from '@ying/shared'
import { ListPushTaskDto } from '@ying/shared'
import type { PushTaskEntity } from '@ying/shared'

import { useTable } from '@/hooks'
import { notificationApi } from '@/api'
import { Page, PageQuery, PageOperations } from '@/layouts/page'
import { IconButton, Iconify } from '@/components/icon'

import { type DeviceTypeOption, DeviceTypeOptions, type PushTaskStatusOption, PushTaskStatusOptions } from './constant'
import { PushTaskModal } from './push-task-modal'
import { PushTaskSetModal } from './push-task-set-modal'

export default function PushTaskPage() {
  const { message } = App.useApp()
  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListPushTaskDto, PushTaskEntity>({
    key: 'push-task',
    getList: notificationApi.listPushTask,
    getListCount: notificationApi.listPushTaskCount
  })

  const pushTaskModalProps = useDialogOpen<PushTaskEntity>()
  const pushTaskSetModalProps = useDialogOpen<PushTaskEntity>()

  const columns: ColumnsType<PushTaskEntity> = [
    {
      title: '任务名称',
      fixed: 'left',
      width: 200,
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '推送模版',
      width: 200,
      ellipsis: true,
      dataIndex: 'pushTemplate',
      render: (_, record) => record.pushTemplate.name
    },
    {
      title: '设备类型',
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'deviceType',
      render: _ => getOption<DeviceTypeOption>(DeviceTypeOptions, _)?.label ?? '全部'
    },
    {
      title: '推送状态',
      width: 160,
      ellipsis: true,
      dataIndex: 'status',
      render(_, record) {
        const label = getOption<PushTaskStatusOption>(PushTaskStatusOptions, record.status)?.label
        const isWaitExecute = record.status === PushTaskStatus.WaitExecute
        return (
          <div>
            {label}
            {isWaitExecute && (
              <>
                <p>
                  推送时间{' '}
                  <Popconfirm
                    title={`确定取消推送【${record.name}】？`}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={async () => {
                      await notificationApi.stopTimingPushTask(record.id)
                      message.success('取消成功！')
                      reload()
                    }}
                  >
                    <Typography.Link>取消推送</Typography.Link>
                  </Popconfirm>
                </p>
                <p>{dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')}</p>
              </>
            )}
          </div>
        )
      }
    },
    {
      title: '任务状态',
      minWidth: 200,
      ellipsis: true,
      render(_, record) {
        return (
          <div>
            <div>
              <span>推送中：{record.taskStatus?.pushing} </span>
              <span>已失败：{record.taskStatus?.fail}</span>
            </div>
            <div>
              <span>已成功：{record.taskStatus?.success} </span>
              <span>点击数：{record.taskStatus?.click}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          extra={
            <IconButton
              onClick={() => pushTaskSetModalProps.onOpen(record)}
              disabled={record.status >= PushTaskStatus.WaitExecute}
            >
              <Iconify icon="solar:upload-twice-square-bold-duotone" size={18} />
            </IconButton>
          }
          onEdit={() => pushTaskModalProps.onOpen(record)}
          editDisabled={record.status !== PushTaskStatus.Wait}
          deleteTitle={`确定删除【${record.name}】？`}
          onDelete={async () => {
            await notificationApi.deletePushTask(record.id)
            message.success('删除成功！')
            reload()
          }}
          deleteDisabled={record.status === PushTaskStatus.WaitExecute || record.status === PushTaskStatus.Executing}
        />
      )
    }
  ]

  return (
    <Page
      header={
        <PageQuery
          control={control}
          reset={resetParams}
          extras={
            <Button type="primary" onClick={() => pushTaskModalProps.onOpen()}>
              新增
            </Button>
          }
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">任务名称</Space.Addon>
                <Input allowClear placeholder="请输入任务名称" {...field} />
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
      body={
        <>
          <PushTaskModal {...pushTaskModalProps} onSuccess={reload} />
          <PushTaskSetModal {...pushTaskSetModalProps} onSuccess={reload} />
        </>
      }
      pagination={pagination}
    />
  )
}
