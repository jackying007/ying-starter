import { useCallback, useEffect } from 'react'
import { Form, Modal, Input, App, Select, type SelectProps } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createOrUpdatePushTaskDto, type CreateOrUpdatePushTaskDto, type ListPushTemplateDto } from '@ying/shared'
import type { PushTaskListVo } from '@ying/server/types-admin'
import { useDialogOpen } from '@ying/frontend/hooks'

import { useQueryWithRequery } from '@/hooks'
import { notificationApi } from '@/api'

import { DeviceTypeOptions } from './constant'

const defaultValues: Partial<CreateOrUpdatePushTaskDto> = {
  name: undefined,
  deviceType: undefined,
  pushTemplateId: undefined
}

export type PushTaskModalProps = ReturnType<typeof useDialogOpen<PushTaskListVo[number]>> & {
  onSuccess: VoidFunction
}

export function PushTaskModal({ open, formValue, onSuccess, onClose }: PushTaskModalProps) {
  const title = `${formValue ? '编辑' : '新增'}推送任务`
  const { message } = App.useApp()

  const { data: pushTemplates, requery } = useQueryWithRequery({
    key: 'push-template-select-list',
    queryFn: async (params?: ListPushTemplateDto) => {
      const list = await notificationApi.listPushTemplate({ size: 100, ...params })
      return list.map(el => ({ label: el.name, value: el.id })) as SelectProps['options']
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(createOrUpdatePushTaskDto)
  })

  const updateForm = useCallback(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultValues)
    }
  }, [formValue, reset])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const submit = handleSubmit(async value => {
    if (value.id) {
      await notificationApi.updatePushTask(value)
    } else {
      await notificationApi.createPushTask(value)
    }
    message.success(`${title}成功`)
    onSuccess()
    onClose()
  })

  return (
    <Modal title={title} width={660} open={open} onCancel={onClose} confirmLoading={isSubmitting} onOk={submit}>
      <Form layout="vertical">
        <Form.Item
          label="任务名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入任务名称" {...field} />}
          />
        </Form.Item>
        <Form.Item label="触达设备">
          <Controller
            control={control}
            name="deviceType"
            render={({ field }) => <Select placeholder="全部" allowClear options={DeviceTypeOptions} {...field} />}
          />
        </Form.Item>
        <Form.Item
          required
          label="推送模板"
          validateStatus={errors.pushTemplateId ? 'error' : ''}
          help={errors.pushTemplateId && errors.pushTemplateId.message}
        >
          <Controller
            name="pushTemplateId"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="请选择推送模板"
                showSearch={{
                  filterOption: false,
                  onSearch: name => requery({ name })
                }}
                options={pushTemplates}
                {...field}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
