import { App, Input, Select, Typography, Image, Button, Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import type { ListArticleDto } from '@ying/shared'
import type { ArticleEntity } from '@ying/shared'
import { useDialogOpen } from '@ying/frontend/hooks'

import { Page, PageQuery, PageOperations } from '@/layouts/page'
import { PromotionModal, type TPromotionData } from '@/components/promotion-modal'
import { IntlShow } from '@/components/intl'
import { IconButton, Iconify } from '@/components/icon'
import { useTable } from '@/hooks'
import { articleApi } from '@/api'
import { useRouter } from '@/router/hooks'
import { type BasicStatusOption, BasicStatusOptions } from '@/constant'

import { ArticleModal } from './article-modal'
import { ArticleContentDrawer } from './article-content-drawer'

export default function ArticlePage() {
  const router = useRouter()
  const { message, modal } = App.useApp()

  const {
    control,
    resetParams,
    list,
    listLoading,
    reload,
    reloadCurrent,
    pagination,
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection
  } = useTable<ListArticleDto, ArticleEntity>({
    key: 'article',
    getList: articleApi.list,
    getListCount: articleApi.listCount
  })

  const articleModalProps = useDialogOpen<ArticleEntity>()
  const articleDrawerProps = useDialogOpen<number>()
  const articlePromotionModalProps = useDialogOpen<TPromotionData>()

  const columns: ColumnsType<ArticleEntity> = [
    {
      title: '文章名称',
      dataIndex: 'name',
      minWidth: 120,
      fixed: 'left',
      ellipsis: true
    },
    {
      title: '封面',
      dataIndex: 'cover',
      align: 'center',
      width: 120,
      render: (_, record) => <Image src={record.cover.url} className="rounded-sm w-13! h-13! object-cover" />
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      minWidth: 200,
      render: (_, record) => <IntlShow value={record.title} />
    },
    {
      title: '关键字',
      ellipsis: true,
      dataIndex: 'keywords',
      minWidth: 200,
      render: (_, record) => <div>{record.keywords?.join('，')}</div>
    },
    {
      title: '排序',
      width: 80,
      align: 'center',
      dataIndex: 'sort'
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: _ => {
        const option = getOption<BasicStatusOption>(BasicStatusOptions, _)
        return (
          <Tag className="cursor-pointer" color={option?.color}>
            {option?.label}
          </Tag>
        )
      }
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
      render: (_, record) => {
        return (
          <PageOperations
            extra={
              <IconButton onClick={() => articleDrawerProps.onOpen(record.id)}>
                <Iconify icon="solar:clapperboard-edit-bold-duotone" size={18} />
              </IconButton>
            }
            deleteTitle="确定删除？"
            onDelete={async () => {
              await articleApi.del({ ids: [record.id] })
              message.success('删除成功！')
              reload()
            }}
            ellipsisItems={[
              {
                key: 'edit',
                label: '编辑其他',
                onClick: () => articleModalProps.onOpen(record)
              },
              {
                key: 'promotion',
                label: '单页推广',
                onClick: () =>
                  articlePromotionModalProps.onOpen({
                    title: `推广-${record.name}`,
                    link: `${import.meta.env.APP_CLIENT_URL}/article/${record.id}`
                  })
              },
              {
                key: 'copy',
                label: '复制到推送模板',
                onClick: () => router.push('/notification/push-template', { state: { type: 'setArticle', record } })
              }
            ]}
          />
        )
      }
    }
  ]

  const batchDelete = () => {
    modal.confirm({
      title: '确定删除以下文章？',
      content: (
        <div className="max-h-125 overflow-y-auto">
          {list
            ?.filter(el => selectedRowKeys.includes(el.id))
            .map(el => (
              <p key={el.id}>{el.name}</p>
            ))}
        </div>
      ),
      onOk: async () => {
        await articleApi.del({ ids: selectedRowKeys.map(key => Number(key)) })
        message.success('删除成功！')
        setSelectedRowKeys([])
        reload()
      }
    })
  }

  return (
    <>
      <Page
        header={
          <PageQuery
            control={control}
            reset={resetParams}
            extras={
              <>
                <Button type="primary" onClick={() => articleModalProps.onOpen()}>
                  新增
                </Button>
                {!!selectedRowKeys.length && (
                  <Button type="dashed" onClick={batchDelete}>
                    批量删除
                  </Button>
                )}
              </>
            }
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Space.Compact>
                  <Space.Addon className="whitespace-nowrap">文章名称</Space.Addon>
                  <Input allowClear placeholder="请输入文章名称" autoComplete="off" {...field} />
                </Space.Compact>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Space.Compact>
                  <Space.Addon className="whitespace-nowrap">状态</Space.Addon>
                  <Select style={{ width: 120 }} placeholder="选择状态" allowClear {...field}>
                    {BasicStatusOptions.map(el => (
                      <Select.Option value={el.value} key={el.value}>
                        <Typography.Text type={el.color}>{el.label}</Typography.Text>
                      </Select.Option>
                    ))}
                  </Select>
                </Space.Compact>
              )}
            />
          </PageQuery>
        }
        table={{
          rowKey: 'id',
          loading: listLoading,
          dataSource: list,
          columns,
          rowSelection
        }}
        pagination={pagination}
      />
      <ArticleModal {...articleModalProps} onSuccess={reload} />
      <ArticleContentDrawer {...articleDrawerProps} onSuccess={reloadCurrent} />
      <PromotionModal {...articlePromotionModalProps} />
    </>
  )
}
