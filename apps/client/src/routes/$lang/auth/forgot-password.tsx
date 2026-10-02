import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, useWatch } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { resetPasswordWithCodeDto, type ResetPasswordWithCodeDto } from '@ying/shared'
import { Input, Button } from '@ying/shared-react/ui'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import { TipError } from '@/components/tip-error'
import { authAPI, HttpError } from '@/api'

import { CardWrapper } from './-components/card-wrapper'
import { VerificationCode } from './-components/verification-code'

export const Route = createFileRoute('/$lang/auth/forgot-password')({
  component: RouteComponent
})

function RouteComponent() {
  const { t, i18n } = useTranslation('auth')
  const [error, setError] = useState<string>()
  const navigate = useNavigate()

  const form = useForm<ResetPasswordWithCodeDto>({
    resolver: zodResolver(resetPasswordWithCodeDto),
    defaultValues: {
      email: '',
      code: '',
      password: ''
    }
  })
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    trigger,
    getFieldState
  } = form
  const email = useWatch({ control, name: 'email' })
  const emailHasTrigger = useRef(false)
  useEffect(() => {
    if (emailHasTrigger.current) trigger('email')
  }, [email, trigger])

  const onSubmit = async (values: ResetPasswordWithCodeDto) => {
    try {
      await authAPI.resetPassword(values)
      toast.success(t('success.password_changed_successfully'))
      navigate({ to: '/$lang/auth/login', params: { lang: i18n.language } })
    } catch (err) {
      if (err instanceof HttpError) {
        const msg = err.message
        setError(t(msg))
        if (msg === 'error.code_is_invalid') setCodeInvalid(true)
      }
    }
  }

  const [codeInvalid, setCodeInvalid] = useState(false)
  const { isPending: isSendingCode, mutate: sendCode } = useMutation<void, HttpError | void>({
    mutationFn: async () => {
      await trigger('email')
      emailHasTrigger.current = true
      const { error: emailError } = getFieldState('email')
      if (emailError?.message) return Promise.reject()
      return authAPI.forgotPassword({ email })
    },
    onSuccess: () => {
      toast.success(t('success.email_verification_code_sent_successfully'))
    },
    onError: httpError => {
      if (httpError instanceof HttpError) setError(t(httpError.message))
    }
  })

  return (
    <CardWrapper
      headerLabel={t('text.forgot_password')}
      backButtonLabel={t('text.back_to_login')}
      backButtonTo="/$lang/auth/login"
    >
      <Form className="space-y-3" t={t} onSubmit={handleSubmit(onSubmit)} {...form}>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('text.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('text.please_enter_email')} disabled={isSubmitting} clearable {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="justify-between">
                {t('text.verifycation_code')}
                <Button
                  className="text-foreground dark:text-background"
                  variant="outline"
                  size="xs"
                  disabled={isSendingCode || isSubmitting}
                  loading={isSendingCode}
                  type="button"
                  onClick={() => sendCode()}
                >
                  {t('text.get_verification_code')}
                </Button>
              </FormLabel>
              <FormControl>
                <VerificationCode
                  disabled={isSubmitting}
                  invalid={codeInvalid}
                  onComplete={() => setCodeInvalid(false)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('text.new_password')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('text.please_enter_new_password')}
                  clearable
                  disabled={isSubmitting}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TipError message={error} />
        <Button loading={isSubmitting} type="submit" className="w-full">
          {t('text.reset_password')}
        </Button>
      </Form>
    </CardWrapper>
  )
}
