import { useEffect } from 'react'
import { Form, Drawer, Input, InputNumber, Button, App, Radio, TreeSelect } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'

import { BasicStatus } from '@ying/shared'
import { createOrUpdateRoleDto, type CreateOrUpdateRoleDto } from '@ying/shared'
import { useDialogOpen } from '@ying/frontend/hooks'

import { sysRoleApi } from '@/api'
import { defaultRoleValues } from './constant'

export type RoleDrawerProps = ReturnType<typeof useDialogOpen<CreateOrUpdateRoleDto>> & {
  onSuccess?: VoidFunction
}

export function RoleDrawer({ open, formValue, onSuccess, onClose }: RoleDrawerProps) {
  const title = formValue ? '编辑系统角色' : '新增系统角色'

  const { data: permissionList } = useQuery({
    queryKey: ['permission'],
    queryFn: () => sysRoleApi.listPermission()
  })

  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateOrUpdateRoleDto>({
    resolver: zodResolver(createOrUpdateRoleDto),
    defaultValues: defaultRoleValues
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultRoleValues)
    }
  }, [formValue, reset])

  const submit = handleSubmit(async value => {
    if (value.id) {
      await sysRoleApi.update(value)
    } else {
      await sysRoleApi.create(value)
    }
    onClose()
    message.success(`${title}成功`)
    onSuccess?.()
  })

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      size={660}
      extra={
        <Button type="primary" onClick={submit} loading={isSubmitting}>
          提交
        </Button>
      }
    >
      <Form layout="vertical">
        <Form.Item
          label="名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入名称" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="状态"
          required
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status && errors.status.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Radio.Group optionType="button" buttonStyle="solid" {...field}>
                <Radio value={BasicStatus.ENABLE}>可用</Radio>
                <Radio value={BasicStatus.DISABLE}>禁用</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item
          label="权限"
          validateStatus={errors.permissionCodes ? 'error' : ''}
          help={errors.permissionCodes && errors.permissionCodes.message}
        >
          <Controller
            name="permissionCodes"
            control={control}
            render={({ field }) => (
              <TreeSelect
                fieldNames={{
                  value: 'code'
                }}
                showSearch={{ treeNodeFilterProp: 'label' }}
                placeholder="请选择权限"
                treeCheckable
                treeCheckStrictly={true}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeData={permissionList}
                value={field.value}
                onChange={(value: any[]) => field.onChange(value.map(el => el.value))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="排序" validateStatus={errors.sort ? 'error' : ''} help={errors.sort && errors.sort.message}>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => <InputNumber style={{ width: '100%' }} placeholder="请输入排序" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="备注"
          validateStatus={errors.remark ? 'error' : ''}
          help={errors.remark && errors.remark.message}
        >
          <Controller
            name="remark"
            control={control}
            render={({ field }) => <Input.TextArea style={{ width: '100%' }} placeholder="请输入备注" {...field} />}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
