import { useEffect } from 'react'
import { App, Form, Modal, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { UpdateSysUserPasswordDto } from '@ying/shared/dto'
import { useDialogOpen } from '@ying/frontend/hooks'

import { sysUserApi } from '@/api'

type ChangePassModalProps = ReturnType<typeof useDialogOpen<UpdateSysUserPasswordDto>> & {
  onSuccess?: VoidFunction
}

export function ChangePassModal({ open, formValue, onSuccess, onClose }: ChangePassModalProps) {
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UpdateSysUserPasswordDto>({
    resolver: classValidatorResolver(UpdateSysUserPasswordDto),
    defaultValues: formValue
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    }
  }, [formValue, reset])

  const submit = handleSubmit(async value => {
    await sysUserApi.updatePassword(value)
    onClose()
    message.success('修改密码成功')
    onSuccess?.()
  })

  return (
    <Modal title="修改密码" open={open} onOk={submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form layout="vertical">
        <Form.Item validateStatus={errors.password ? 'error' : ''} help={errors.password && errors.password.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input.Password allowClear placeholder="请输入新密码" {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
