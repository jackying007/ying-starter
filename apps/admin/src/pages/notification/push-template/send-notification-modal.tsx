import { useEffect } from 'react'
import { App, Form, Modal, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useDialogOpen } from '@ying/frontend/hooks'
import { sendPushTemplateDto } from '@ying/shared'
import type { PushTemplateEntity } from '@ying/shared'

import { notificationApi } from '@/api'

export type SendNotificationProps = ReturnType<typeof useDialogOpen<PushTemplateEntity>>

export function SendNotificationModal({ open, formValue, onClose }: SendNotificationProps) {
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm({
    resolver: zodResolver(sendPushTemplateDto)
  })

  useEffect(() => {
    if (formValue?.id) {
      setValue('pushTemplateId', formValue.id)
    }
  }, [formValue, setValue])

  const submit = handleSubmit(async value => {
    await notificationApi.sendPushTemplate(value)
    message.success('发送通知成功')
  })

  return (
    <Modal title="发送通知" open={open} onOk={submit} onCancel={onClose} confirmLoading={isSubmitting}>
      <Form layout="vertical">
        <Form.Item
          label="浏览用户ID"
          required
          validateStatus={errors.visitorId ? 'error' : ''}
          help={errors.visitorId && errors.visitorId.message}
        >
          <Controller
            name="visitorId"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入浏览用户ID" {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
