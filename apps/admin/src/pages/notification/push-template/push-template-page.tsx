import { App, Button, Input, Space, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom'

import { useDialogOpen } from '@ying/shared-react/hooks'
import type { ListPushTemplateDto } from '@ying/shared'
import type { ArticleListVo, PushTemplateListVo } from '@ying/server/types-admin'

import { useTable } from '@/hooks'
import { notificationApi } from '@/api'
import { Page, PageQuery, PageOperations } from '@/layouts/page'
import { IconButton, Iconify } from '@/components/icon'
import { IntlShow } from '@/components/intl'

import { PushTemplateDrawer } from './push-template-drawer'
import { SendNotificationModal } from './send-notification-modal'

export default function PushTemplatePage() {
  const { message } = App.useApp()

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<
    ListPushTemplateDto,
    PushTemplateListVo[number]
  >({
    key: 'push-template',
    getList: notificationApi.listPushTemplate,
    getListCount: notificationApi.listPushTemplateCount
  })

  const pushTemplateDrawerProps = useDialogOpen<Partial<PushTemplateListVo[number]>>()
  const sendNotificationModalProps = useDialogOpen<PushTemplateListVo[number]>()

  const location = useLocation()
  const { onOpen: openPushTemplateDrawer } = pushTemplateDrawerProps
  useEffect(() => {
    const state = location.state
    if (state) {
      if (state.type === 'setArticle') {
        const record = state.record as ArticleListVo[number]
        openPushTemplateDrawer({
          name: record.name,
          title: record.title,
          link: `${import.meta.env.VITE_APP_CLIENT_URL}/article/${record.id}`,
          image: record.cover
        })
      }
    }
  }, [location, openPushTemplateDrawer])

  const columns: ColumnsType<PushTemplateListVo[number]> = [
    {
      title: '模板名称',
      width: 150,
      fixed: 'left',
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '通知标题',
      width: 300,
      ellipsis: true,
      dataIndex: 'title',
      render: (_, record) => <IntlShow value={record.title} />
    },
    {
      title: '内容',
      minWidth: 300,
      ellipsis: true,
      dataIndex: 'body',
      render: (_, record) => <IntlShow value={record.body} />
    },
    {
      title: '内容图片',
      dataIndex: 'image',
      align: 'center',
      width: 120,
      render: (_, record) =>
        record.image && <Image src={record.image.url} className="rounded-sm w-13! h-13! object-cover" />
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
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          extra={
            <IconButton onClick={() => sendNotificationModalProps.onOpen(record)}>
              <Iconify icon="solar:card-send-bold-duotone" size={18} />
            </IconButton>
          }
          onEdit={() => pushTemplateDrawerProps.onOpen(record)}
          deleteTitle={`确定删除【${record.name}】？`}
          onDelete={async () => {
            await notificationApi.deletePushTemplate(record.id)
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
        <PageQuery
          control={control}
          reset={resetParams}
          extras={
            <Button type="primary" onClick={() => pushTemplateDrawerProps.onOpen()}>
              新增
            </Button>
          }
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">模板名称</Space.Addon>
                <Input allowClear placeholder="请输入模板名称" {...field} />
              </Space.Compact>
            )}
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">通知标题</Space.Addon>
                <Input allowClear placeholder="请输入通知标题" {...field} />
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
          <PushTemplateDrawer {...pushTemplateDrawerProps} onSuccess={reload} />
          <SendNotificationModal {...sendNotificationModalProps} />
        </>
      }
      pagination={pagination}
    />
  )
}
