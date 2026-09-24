import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

import { clientRegisterDto, type ClientRegisterDto } from '@ying/shared'
import { Input, Button } from '@ying/shared-react/ui'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import { TipError } from '@/components/tip-error'
import { authAPI, HttpError } from '@/api'

import { CardWrapper } from './-components/card-wrapper'
import { Verification } from './-components/verification'

export const Route = createFileRoute('/$lang/auth/register')({
  component: RouteComponent
})

function RouteComponent() {
  const { t, i18n } = useTranslation('auth')
  const [error, setError] = useState<string>()
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>()

  const form = useForm<ClientRegisterDto>({
    resolver: zodResolver(clientRegisterDto),
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  })

  const {
    control,
    formState: { isSubmitting },
    handleSubmit
  } = form

  const submit = async (values: ClientRegisterDto) => {
    setError('')
    try {
      await authAPI.register(values)
      setEmailToBeVerified(values.email)
    } catch (err) {
      if (err instanceof HttpError) setError(t(err.message))
    }
  }

  const navigate = useNavigate()

  const onEmailVerify = () => {
    navigate({ to: '/$lang/auth/login', params: { lang: i18n.language } })
  }

  return (
    <CardWrapper
      headerLabel={t('text.register_an_account')}
      backButtonLabel={t('text.already_have_an_account')}
      backButtonTo="/$lang/auth/login"
    >
      {emailToBeVerified ? (
        <Verification
          email={emailToBeVerified}
          onVerify={onEmailVerify}
          successTip={t('success.register_verification_tip', { second: 1 })}
        />
      ) : (
        <Form className="space-y-3" t={t} onSubmit={handleSubmit(submit)} {...form}>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.email')}</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      classNames={{ wrapper: 'flex-1', input: '' }}
                      autoComplete="email"
                      placeholder={t('text.please_enter_email')}
                      disabled={isSubmitting}
                      clearable
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.nickname')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_nickname')}
                    autoComplete="name"
                    disabled={isSubmitting}
                    clearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('text.password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('text.please_enter_password')}
                    type="password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    clearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TipError message={error} />
          <Button loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full">
            {t('text.register')}
          </Button>
        </Form>
      )}
    </CardWrapper>
  )
}
