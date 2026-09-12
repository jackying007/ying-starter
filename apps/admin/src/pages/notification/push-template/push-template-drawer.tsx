import { useEffect } from 'react'
import { Form, Drawer, Input, Button, App } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { CreatePushTemplateDto, UpdatePushTemplateDto } from '@ying/shared'
import type { PushTemplateEntity } from '@ying/shared'
import { useDialogOpen, useRemount } from '@ying/frontend/hooks'

import { notificationApi } from '@/api'
import { ImageSelector } from '@/components/image'
import { FormList } from '@/components/form/form-list'
import { IntlInput, IntlTextArea } from '@/components/intl'

const createResolver = classValidatorResolver(CreatePushTemplateDto)
const updateResolver = classValidatorResolver(UpdatePushTemplateDto)

type FormValueType = Partial<PushTemplateEntity>
type PushTemplateDrawerProps = ReturnType<typeof useDialogOpen<FormValueType>> & {
  onSuccess?: VoidFunction
}

const defaultValue: FormValueType = {
  name: undefined,
  title: undefined,
  link: undefined,
  body: undefined,
  imageId: undefined,
  actions: []
}

export function PushTemplateDrawer({ open, formValue, onSuccess, onClose }: PushTemplateDrawerProps) {
  const title = `${formValue?.id ? '编辑' : '新增'}推送模板`
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    reset,
    setValue
  } = useForm<CreatePushTemplateDto & UpdatePushTemplateDto>({
    resolver: formValue?.id ? updateResolver : createResolver,
    defaultValues: defaultValue
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultValue)
    }
  }, [formValue, reset])

  const submit = handleSubmit(async value => {
    if (value.id) {
      await notificationApi.updatePushTemplate(value)
    } else {
      await notificationApi.createPushTemplate(value)
    }
    message.success(`${title}成功`)
    onSuccess?.()
    onClose()
  })

  const { renderKey } = useRemount(open)

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      size={660}
      extra={
        <Button type="primary" disabled={!isDirty} loading={isSubmitting} onClick={submit}>
          提交
        </Button>
      }
    >
      <Form layout="vertical">
        <Form.Item
          label="模板名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入模板名称" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="通知标题"
          required
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title && errors.title.message}
        >
          <IntlInput
            key={renderKey}
            allowClear
            placeholder="请输入通知标题"
            defaultValue={formValue?.title}
            onChange={val => setValue('title', val, { shouldDirty: true })}
          />
        </Form.Item>
        <Form.Item label="链接" validateStatus={errors.link ? 'error' : ''} help={errors.link && errors.link.message}>
          <Controller
            name="link"
            control={control}
            render={({ field }) => <Input allowClear placeholder="请输入链接" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="推送内容"
          validateStatus={errors.body ? 'error' : ''}
          help={errors.body && errors.body.message}
        >
          <IntlTextArea
            key={renderKey}
            allowClear
            placeholder="请输入推送内容"
            defaultValue={formValue?.body}
            onChange={val => setValue('body', val, { shouldDirty: true })}
          />
        </Form.Item>
        <Form.Item
          label="内容图片"
          validateStatus={errors.imageId ? 'error' : ''}
          help={errors.imageId && errors.imageId.message}
        >
          <ImageSelector
            key={renderKey}
            maxLength={1}
            defaultValue={formValue?.image}
            onChange={files => setValue('imageId', files[0]?.id ?? null, { shouldDirty: true })}
          />
        </Form.Item>
        <FormList control={control} name="actions" label="按钮" defaultValue={{ title: {}, link: undefined }}>
          {index => {
            return (
              <>
                <Controller
                  name={`actions.${index}.title`}
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors?.actions?.[index]?.title?.message ? 'error' : ''}
                      help={errors?.actions?.[index]?.title?.message}
                    >
                      <IntlInput
                        key={renderKey}
                        placeholder="标题"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </Form.Item>
                  )}
                />
                <Controller
                  name={`actions.${index}.link`}
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors?.actions?.[index]?.link?.message ? 'error' : ''}
                      help={errors?.actions?.[index]?.link?.message}
                    >
                      <Input placeholder="链接" value={field.value} onChange={field.onChange} />
                    </Form.Item>
                  )}
                />
              </>
            )
          }}
        </FormList>
      </Form>
    </Drawer>
  )
}
