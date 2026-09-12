import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { ClientLoginDto } from '@ying/shared'
import { Button, buttonVariants, Input } from '@ying/frontend/ui'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import { Link } from '@/components/link'
import { TipError } from '@/components/tip-error'
import { TipSuccess } from '@/components/tip-success'

import { setAuthTokens } from '@/store/auth-store'
import { HttpError, authAPI } from '@/api'

import { CardWrapper } from './-components/card-wrapper'
import { Social } from './-components/social'
import { Verification } from './-components/verification'

const schema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional()
})

export const Route = createFileRoute('/$lang/auth/login')({
  component: RouteComponent,
  validateSearch: search => {
    return schema.parse(search)
  }
})

function RouteComponent() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const params = Route.useParams()
  const { accessToken, refreshToken } = Route.useSearch()
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>()

  useEffect(() => {
    if (accessToken && refreshToken) {
      setAuthTokens({ accessToken, refreshToken })
      navigate({ to: '/$lang', params, replace: true })
    }
  }, [accessToken, refreshToken, navigate, params])

  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()

  const form = useForm<ClientLoginDto>({
    resolver: classValidatorResolver(ClientLoginDto),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    control,
    formState: { isSubmitting },
    handleSubmit
  } = form

  const submit = async (values: ClientLoginDto) => {
    setError('')
    setSuccess('')
    try {
      const loginRes = await authAPI.login(values)
      if (loginRes.status === 0) {
        setAuthTokens(loginRes.data)
        navigate({ to: '/$lang', params, replace: true })
      } else if (loginRes.status === 'emailNotVerified') {
        setEmailToBeVerified(values.email)
      }
    } catch (err) {
      if (err instanceof HttpError) setError(t(err.message))
    }
  }

  const onEmailVerify = () => {
    submit({ ...form.getValues() })
  }

  return (
    <CardWrapper
      headerLabel={t('text.welcome_to')}
      backButtonLabel={t('text.no_account')}
      backButtonTo="/$lang/auth/register"
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
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder={t('text.please_enter_email')}
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
                    autoComplete="current-password"
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
          <Link
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            to="/$lang/auth/forgot-password"
            params={params}
          >
            {t('text.forgot_password')}
          </Link>
          <TipError message={error} />
          <TipSuccess message={success} />
          <Button loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full">
            {t('text.login')}
          </Button>
          <Social />
        </Form>
      )}
    </CardWrapper>
  )
}
