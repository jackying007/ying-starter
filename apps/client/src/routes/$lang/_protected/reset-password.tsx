import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { resetPasswordDto, type ResetPasswordDto } from '@ying/shared'
import { Input, Button } from '@ying/shared-react/ui'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import { useAuthStore, logout } from '@/store/auth-store'
import { HttpError, userAPI } from '@/api'

export const Route = createFileRoute('/$lang/_protected/reset-password')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation('auth')
  const userInfo = useAuthStore(state => state.userInfo)

  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordDto),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const {
    control,
    formState: { isSubmitting },
    handleSubmit
  } = form

  const onSubmit = async (values: ResetPasswordDto) => {
    try {
      await userAPI.resetPassword(values)
      toast.success(t('success.password_changed_successfully'))
      await logout()
    } catch (err) {
      if (err instanceof HttpError) toast.error(t(err.message))
    }
  }

  return (
    <div className="w-full h-full p-4">
      <Form className="flex flex-col gap-4" t={t} onSubmit={handleSubmit(onSubmit)} {...form}>
        {userInfo?.hasPassword && (
          <FormField
            control={control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.old_password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_old_password')}
                    type="password"
                    autoComplete="old-password"
                    disabled={isSubmitting}
                    clearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('text.new_password')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('text.please_enter_new_password')}
                  type="password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  clearable
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
          {userInfo?.hasPassword ? t('text.confirm_reset') : t('text.set_password')}
        </Button>
      </Form>
    </div>
  )
}
