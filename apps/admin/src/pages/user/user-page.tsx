import { App, Button, Input, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller, type UseFormGetValues } from 'react-hook-form'
import { useState } from 'react'
import dayjs from 'dayjs'

import type { ListUserDto } from '@ying/shared'
import type { UserEntity } from '@ying/shared'

import { downloadExcel, userApi } from '@/api'
import { useTable } from '@/hooks'
import { Page, PageQuery } from '@/layouts/page'
import { useThemeToken } from '@/hooks'

function ExportButton({ getParams }: { getParams: UseFormGetValues<ListUserDto> }) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  return (
    <Button
      loading={loading}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true)
          const response = await userApi.export(getParams())
          downloadExcel(response)
          message.success('导出成功')
        } catch (error) {
          console.log(error)
          message.error('导出失败')
        } finally {
          setLoading(false)
        }
      }}
    >
      导出用户
    </Button>
  )
}

export default function UserPage() {
  const { control, resetParams, getParams, list, listLoading, pagination } = useTable<ListUserDto, UserEntity>({
    key: 'user',
    getList: userApi.list,
    getListCount: userApi.listCount
  })

  const { colorTextSecondary } = useThemeToken()
  const columns: ColumnsType<UserEntity> = [
    {
      title: '用户',
      width: 350,
      render: (_, record) => {
        return (
          <div className="flex gap-x-2">
            <div className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray/10 border border-border shadow-xs">
              {record.avatar?.url && <img alt="avatar" src={record.avatar.url} className="object-cover" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{record.name}</span>
              <div className="flex gap-x-3 items-center">
                <span style={{ color: colorTextSecondary }} className="text-xs">
                  {record.email}
                </span>
                <Tag color={record.emailVerified ? 'cyan' : 'warning'}>
                  {record.emailVerified ? '已验证' : '未验证'}
                </Tag>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: '三方账号',
      dataIndex: 'account',
      minWidth: 350,
      render: (_, record) => {
        if (!record.oauthAccounts?.length) return '-'
        return (
          <div className="flex gap-2 overflow-x-auto">
            {record.oauthAccounts.map(el => (
              <div key={el.id} className="flex gap-x-2">
                <div className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray/20 border border-border">
                  <img alt="avatar" src={el.avatar} className="object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <span>
                    <span className="text-xs mr-2">{el.name}</span>
                    <span className="text-xs">{el.provider}</span>
                  </span>

                  <span className="text-xs" style={{ color: colorTextSecondary }}>
                    ID: {el.providerAccountId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      fixed: 'right',
      render: (_, record) => <div>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    }
  ]

  return (
    <Page
      header={
        <PageQuery control={control} reset={resetParams} extras={<ExportButton getParams={getParams} />}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">昵称</Space.Addon>
                <Input allowClear placeholder="请输入昵称" autoComplete="off" {...field} />
              </Space.Compact>
            )}
          />
          <Controller
            control={control}
            name="email"
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
