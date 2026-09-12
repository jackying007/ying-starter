import { useEffect } from 'react'
import { App, Form, Modal, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { useDialogOpen } from '@ying/frontend/hooks'
import { SendPushTemplateDto } from '@ying/shared/dto'
import type { PushTemplateEntity } from '@ying/shared/entity'

import { notificationApi } from '@/api'

const resolver = classValidatorResolver(SendPushTemplateDto)

export type SendNotificationProps = ReturnType<typeof useDialogOpen<PushTemplateEntity>>

export function SendNotificationModal({ open, formValue, onClose }: SendNotificationProps) {
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<SendPushTemplateDto>({
    resolver
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
        <Form.Item<SendPushTemplateDto>
          name="visitorId"
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
