import { useEffect } from 'react'
import { Form, Drawer, Input, Button, Radio, Select, App, type SelectProps } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicStatus } from '@ying/shared'
import { createOrUpdateSysUserDto } from '@ying/shared'
import type { CreateOrUpdateSysUserDto, ListRoleDto } from '@ying/shared'
import type { SysUserListVo } from '@ying/server/types-admin'
import { useDialogOpen } from '@ying/shared-react/hooks'
import { useQueryWithRequery } from '@/hooks'
import { sysRoleApi, sysUserApi } from '@/api'

export type UserDrawerFormValue = SysUserListVo[number]
const defaultValues: CreateOrUpdateSysUserDto = {
  id: undefined,
  name: '',
  account: '',
  password: undefined,
  email: null,
  status: BasicStatus.ENABLE,
  roleIds: [],
  remark: null
}
export type UserDrawerProps = ReturnType<typeof useDialogOpen<UserDrawerFormValue>> & {
  onSuccess?: VoidFunction
}
export function UserDrawer({ open, formValue, onSuccess, onClose }: UserDrawerProps) {
  const title = formValue ? '编辑系统用户' : '新增系统用户'
  const { message } = App.useApp()

  const { data: roles, requery } = useQueryWithRequery({
    key: 'role-select-list',
    queryFn: async (params?: ListRoleDto) => {
      const list = await sysRoleApi.list({ size: 100, ...params })
      return list.map(el => ({ label: el.name, value: el.id, disabled: el.systemic })) as SelectProps['options']
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(createOrUpdateSysUserDto)
  })

  useEffect(() => {
    if (formValue) {
      reset({ ...formValue, roleIds: formValue.roles.map(el => el.id) })
    } else {
      reset(defaultValues)
    }
  }, [formValue, reset])

  const submit = handleSubmit(async value => {
    if (value.id) {
      await sysUserApi.update(value)
    } else {
      await sysUserApi.create(value)
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
          label="昵称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入昵称" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="账号"
          required
          validateStatus={errors.account ? 'error' : ''}
          help={errors.account && errors.account.message}
        >
          <Controller
            name="account"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入账号" {...field} />}
          />
        </Form.Item>
        {!formValue && (
          <Form.Item
            label="密码"
            required
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password && errors.password.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  placeholder="请输入密码"
                  {...field}
                  value={field.value ?? undefined}
                  autoComplete="new-password"
                  allowClear
                  onClear={() => setValue('password', undefined)}
                />
              )}
            />
          </Form.Item>
        )}
        <Form.Item
          label="邮箱"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email && errors.email.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="请输入邮箱"
                {...field}
                value={field.value ?? ''}
                autoComplete="new-email"
                allowClear
                onClear={() => setValue('email', null)}
              />
            )}
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
          label="角色"
          validateStatus={errors.roleIds ? 'error' : ''}
          help={errors.roleIds && errors.roleIds.message}
        >
          <Controller
            name="roleIds"
            control={control}
            render={({ field }) => (
              <Select
                mode="multiple"
                placeholder="请选择角色"
                allowClear
                showSearch={{
                  filterOption: false,
                  onSearch: name => requery({ name })
                }}
                options={roles}
                {...field}
              />
            )}
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
            render={({ field }) => (
              <Input.TextArea
                style={{ width: '100%' }}
                placeholder="请输入备注"
                {...field}
                value={field.value ?? ''}
                allowClear
                onClear={() => setValue('remark', null)}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
