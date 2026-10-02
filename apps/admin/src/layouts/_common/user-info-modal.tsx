import { useEffect, useState } from 'react'
import { App, Form, Modal, Input, Segmented, Button } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDialogOpen } from '@ying/shared-react/hooks'
import { updateSysUserSelfUserInfoDto, updateSysUserSelfPasswordDto } from '@ying/shared'
import type { UpdateSysUserSelfUserInfoDto, UpdateSysUserSelfPasswordDto } from '@ying/shared'
import { commonApi, sysAuthApi } from '@/api'
import { UploadImage } from '@/components/image'
import { updateUserInfo, logout, useUserInfo } from '@/store'

export type UserInfoModalProps = ReturnType<typeof useDialogOpen>

type TSegmented = '修改信息' | '修改密码'

export function UserInfoModal({ open, onClose }: UserInfoModalProps) {
  const [segmented, setSegmented] = useState<TSegmented>('修改信息')

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Segmented<TSegmented>
          options={['修改信息', '修改密码']}
          onChange={value => {
            setSegmented(value)
          }}
        />
      }
      footer={null}
    >
      {segmented === '修改信息' && <ChangeUserInfoForm />}
      {segmented === '修改密码' && <ChangePasswordForm />}
    </Modal>
  )
}

const ChangeUserInfoForm = () => {
  const { message } = App.useApp()
  const userInfo = useUserInfo()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    reset
  } = useForm<UpdateSysUserSelfUserInfoDto>({
    resolver: zodResolver(updateSysUserSelfUserInfoDto)
  })
  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name,
        avatarId: userInfo.avatarId
      })
    }
  }, [userInfo, reset])

  const handlePost = async (value: UpdateSysUserSelfUserInfoDto) => {
    await sysAuthApi.updateUserInfo(value)
    message.success('修改用户信息成功')
    updateUserInfo()
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(handlePost)}>
      <Form.Item
        label="昵称"
        required
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name && errors.name.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input allowClear placeholder="请输入新昵称" {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="头像"
        required
        validateStatus={errors.avatarId ? 'error' : ''}
        help={errors.avatarId && errors.avatarId.message}
      >
        <Controller
          name="avatarId"
          control={control}
          render={({ field }) => (
            <UploadImage
              className="rounded-full"
              mustCrop
              aspectRatio={1}
              defaultUrl={userInfo?.avatar?.url}
              handleUpload={(file, fileInfo) => commonApi.uploadImage(file, fileInfo)}
              onSuccess={file => field.onChange(file.id)}
            />
          )}
        />
      </Form.Item>
      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" disabled={!isDirty} loading={isSubmitting}>
          确认修改
        </Button>
      </div>
    </Form>
  )
}

const ChangePasswordForm = () => {
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<UpdateSysUserSelfPasswordDto>({
    resolver: zodResolver(updateSysUserSelfPasswordDto),
    defaultValues: {
      oldPass: '',
      newPass: ''
    }
  })

  const handlePost = async (value: UpdateSysUserSelfPasswordDto) => {
    await sysAuthApi.updateUserPassword(value)
    message.success(`修改密码成功`)
    logout()
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(handlePost)}>
      <Form.Item
        label="旧密码"
        required
        validateStatus={errors.oldPass ? 'error' : ''}
        help={errors.oldPass && errors.oldPass.message}
      >
        <Controller
          name="oldPass"
          control={control}
          render={({ field }) => (
            <Input.Password allowClear placeholder="请输入旧密码" autoComplete="old-password" {...field} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="新密码"
        required
        validateStatus={errors.newPass ? 'error' : ''}
        help={errors.newPass && errors.newPass.message}
      >
        <Controller
          name="newPass"
          control={control}
          render={({ field }) => (
            <Input.Password allowClear placeholder="请输入新密码" autoComplete="new-password" {...field} />
          )}
        />
      </Form.Item>
      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          确认修改
        </Button>
      </div>
    </Form>
  )
}
