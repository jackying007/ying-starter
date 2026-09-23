import { useEffect } from 'react'
import { Form, Input, App, InputNumber, Select, Modal } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createOrUpdateArticleDto } from '@ying/shared'
import { useDialogOpen, useRemount } from '@ying/frontend/hooks'
import type { ArticleListVo } from '@ying/server/types-admin'
import { Tags } from '@/components/tags'
import { ImageSelector } from '@/components/image'
import { IntlInput } from '@/components/intl'
import { articleApi } from '@/api'
import { BasicStatusOptions } from '@/constant'
import { defaultValues } from './constant'

type ArticleModalProps = ReturnType<typeof useDialogOpen<ArticleListVo[number]>> & {
  onSuccess?: VoidFunction
}

export function ArticleModal({ open, formValue, onSuccess, onClose }: ArticleModalProps) {
  const title = `${formValue ? '编辑' : '新增'}文章`
  const { message } = App.useApp()
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(createOrUpdateArticleDto)
  })

  useEffect(() => {
    if (formValue) {
      reset(formValue)
    } else {
      reset(defaultValues)
    }
  }, [formValue, reset])

  const submit = handleSubmit(async value => {
    if (value.id) {
      await articleApi.update(value)
    } else {
      await articleApi.create(value)
    }
    message.success(`${title}成功`)
    onSuccess?.()
    onClose()
  })

  const { renderKey } = useRemount(open)

  return (
    <Modal
      title={title}
      width={660}
      open={open}
      onCancel={onClose}
      okButtonProps={{ disabled: !isDirty, loading: isSubmitting }}
      onOk={submit}
    >
      <Form layout="vertical">
        <Form.Item
          label="名称"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name && errors.name.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input allowClear placeholder="请输入名称" {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="标题"
          required
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title && errors.title.message}
        >
          <IntlInput
            key={renderKey}
            allowClear
            placeholder="请输入标题"
            defaultValue={formValue?.title}
            onChange={val => setValue('title', val, { shouldDirty: true })}
          />
        </Form.Item>

        <Form.Item
          label="封面"
          required
          validateStatus={errors.coverId ? 'error' : ''}
          help={errors.coverId && errors.coverId.message}
        >
          <ImageSelector
            key={renderKey}
            maxLength={1}
            defaultValue={formValue?.cover}
            onChange={files => setValue('coverId', files[0]?.id, { shouldDirty: true })}
          />
        </Form.Item>

        <Form.Item
          label="状态"
          required
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status && errors.status.message}
        >
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                style={{ width: 120 }}
                placeholder="选择状态"
                options={BasicStatusOptions}
                allowClear
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="关键字"
          validateStatus={errors.keywords ? 'error' : ''}
          help={errors.keywords && errors.keywords.message}
        >
          <Controller control={control} name="keywords" render={({ field }) => <Tags {...field} />} />
        </Form.Item>

        <Form.Item label="排序" validateStatus={errors.sort ? 'error' : ''} help={errors.sort && errors.sort.message}>
          <Controller
            control={control}
            name="sort"
            render={({ field }) => <InputNumber style={{ width: '100%' }} placeholder="请输入排序" {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
