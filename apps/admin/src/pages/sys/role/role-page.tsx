import { App, Button, Input, Select, Space, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { getOption } from '@ying/utils'
import type { ListRoleDto, UpdateRoleDto } from '@ying/shared/dto'
import type { SysRoleEntity } from '@ying/shared/entity'
import { useDialogOpen } from '@ying/frontend/hooks'

import { useTable } from '@/hooks'
import { sysRoleApi } from '@/api'
import { Page, PageQuery, PageOperations } from '@/layouts/page'
import { BasicStatusOptions, type BasicStatusOption } from '@/constant'

import { RoleDrawer } from './role-drawer'

export default function RolePage() {
  const { message } = App.useApp()
  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListRoleDto, SysRoleEntity>({
    key: 'role',
    getList: sysRoleApi.list,
    getListCount: sysRoleApi.listCount
  })

  const roleDrawerPros = useDialogOpen<UpdateRoleDto>()

  const columns: ColumnsType<SysRoleEntity> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: status => {
        const { color, label } = getOption<BasicStatusOption>(BasicStatusOptions, status) ?? {}
        return <Tag color={color}>{label}</Tag>
      }
    },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 80 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, minWidth: 180 },
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
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <PageOperations
          onEdit={() =>
            roleDrawerPros.onOpen({
              ...record,
              permissionCodes: record.permissions.map(el => el.code)
            })
          }
          editDisabled={record.systemic}
          deleteTitle={`确定删除[${record.name}]？`}
          onDelete={async () => {
            await sysRoleApi.del(record.id)
            message.success('删除成功！')
            reload()
          }}
          deleteDisabled={record.systemic}
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
            <Button type="primary" onClick={() => roleDrawerPros.onOpen()}>
              新增
            </Button>
          }
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Space.Compact>
                <Space.Addon className="whitespace-nowrap">角色名称</Space.Addon>
                <Input allowClear placeholder="角色名称" autoComplete="off" {...field} />
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
        columns
      }}
      body={<RoleDrawer {...roleDrawerPros} onSuccess={reload} />}
      pagination={pagination}
    />
  )
}
