import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { updateUserInfoDto, type UpdateUserInfoDto } from '@ying/shared'
import { Input, Button } from '@ying/frontend/ui'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import { UploadImage } from '@/components/image/upload-image'
import { useAuthStore, updateUserInfo } from '@/store/auth-store'

import { commonAPI, HttpError, userAPI } from '@/api'

export const Route = createFileRoute('/$lang/_protected/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation('auth')

  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<UpdateUserInfoDto>({
    resolver: zodResolver(updateUserInfoDto),
    defaultValues: {
      name: '',
      avatarId: -1
    }
  })
  const {
    control,
    formState: { isSubmitting },
    handleSubmit
  } = form

  const onSubmit = async (values: UpdateUserInfoDto) => {
    try {
      userAPI.updateUserInfo(values)
      toast.success(t('success.successfully_modified_user_information'))
      updateUserInfo()
    } catch (err) {
      if (err instanceof HttpError) toast.error(t(err.message))
    }
  }

  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.name,
        avatarId: userInfo.avatarId
      })
    }
  }, [userInfo, form])

  return (
    <div className="w-full h-full p-4">
      {userInfo && (
        <Form className="flex flex-col gap-4" t={t} onSubmit={handleSubmit(onSubmit)} {...form}>
          <FormItem>
            <FormLabel>OAuth {t('text.account')}</FormLabel>
            <div className="flex gap-2">
              {!userInfo.oauthAccounts && '-'}
              {userInfo.oauthAccounts?.map(el => (
                <div key={el.id} className="flex gap-1">
                  <div className="h-9 w-9 rounded-full overflow-hidden border shadow-sm">
                    <img alt="avatar" src={el.avatar} className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="text-xs">{el.provider}</span>
                    <span className="text-xs">{el.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </FormItem>
          <FormItem>
            <FormLabel>{t('text.email')}</FormLabel>
            <FormControl>
              <Input disabled value={userInfo.email} />
            </FormControl>
          </FormItem>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.nickname')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('text.please_enter_nickname')} disabled={isSubmitting} clearable {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="avatarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.avatar')}</FormLabel>
                <FormControl>
                  <div className="w-full flex justify-center">
                    <UploadImage
                      defaultUrl={userInfo.avatar?.url}
                      disabled={isSubmitting}
                      withCrop
                      aspectRatio={1}
                      handleUpload={(file, fileInfo) => commonAPI.uploadImage(file, fileInfo)}
                      onSuccess={fileEntity => {
                        field.onChange(fileEntity?.id)
                        toast.success(t('success.image_uploaded_successfully'))
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            {t('text.confirm_modifications')}
          </Button>
        </Form>
      )}
    </div>
  )
}
