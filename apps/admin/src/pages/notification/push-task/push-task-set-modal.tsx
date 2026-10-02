import { useCallback, useEffect } from 'react'
import { Form, Modal, App, DatePicker } from 'antd'
import { Controller, useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import { setPushTaskDto } from '@ying/shared'
import type { PushTaskListVo } from '@ying/server/types-admin'
import { useDialogOpen } from '@ying/shared-react/hooks'

import { notificationApi } from '@/api'

export type PushTaskSetProps = ReturnType<typeof useDialogOpen<PushTaskListVo[number]>> & {
  onSuccess: VoidFunction
}

export function PushTaskSetModal({ open, formValue, onSuccess, onClose }: PushTaskSetProps) {
  const title = '设置任务'
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(setPushTaskDto)
  })

  const { field: timeField } = useController({ control, name: 'time' })

  const updateForm = useCallback(async () => {
    if (formValue) {
      reset({ id: formValue.id, time: undefined })
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const submit = handleSubmit(async value => {
    await notificationApi.setPushTask(value)
    message.success(`${title}成功`)
    onSuccess()
    onClose()
  })

  return (
    <Modal
      title={title}
      open={open}
      okText={timeField.value ? '定时推送' : '立即推送'}
      onOk={submit}
      onCancel={onClose}
      confirmLoading={isSubmitting}
    >
      <Form layout="vertical">
        <Form.Item
          label="推送时间"
          validateStatus={errors.time ? 'error' : ''}
          help={errors.time && errors.time.message}
        >
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <DatePicker
                showTime
                allowClear
                placeholder="请选择推送时间"
                style={{ width: '100%' }}
                value={field.value ? dayjs(field.value) : undefined}
                onChange={date => {
                  if (!date) return field.onChange(undefined)
                  field.onChange(date.format('YYYY-MM-DD HH:mm:ss'))
                }}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
