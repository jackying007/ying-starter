import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import type { VerifyEmailDto } from '@ying/shared'
import { Field, FieldContent, FieldDescription } from '@ying/shared-react/ui'
import { LoadingIconV1 } from '@ying/shared-react/icons'
import { TipError } from '@/components/tip-error'
import { TipSuccess } from '@/components/tip-success'
import { authAPI, type HttpError } from '@/api'
import { VerificationCode } from './verification-code'

type VerificationProps = {
  email: string
  successTip: string
  timeOut?: number
  onVerify: () => void
}

export const Verification = ({ email, successTip, timeOut = 1000, onVerify }: VerificationProps) => {
  const { t } = useTranslation('auth')
  const [code, setCode] = useState<string>()

  const { isPending, isSuccess, isError, error, mutate } = useMutation<void, HttpError, VerifyEmailDto>({
    mutationFn: authAPI.verifyEmail,
    onSuccess: () => setTimeout(onVerify, timeOut)
  })

  const successMsg = isSuccess ? successTip : undefined
  const errorMsg = error ? t(error.message) : undefined

  const onComplete = () => {
    if (!code) return
    mutate({ email, code })
  }

  return (
    <Field className="gap-2">
      <FieldDescription className="text-center">{t('text.verifycation_tip')}</FieldDescription>
      <FieldContent className="gap-3">
        <VerificationCode
          disabled={isPending}
          value={code}
          onChange={val => setCode(val)}
          onComplete={onComplete}
          aria-invalid={isError}
        />
        {isPending && (
          <div className="flex justify-center">
            <LoadingIconV1 />
          </div>
        )}
        <TipSuccess message={successMsg} />
        <TipError message={errorMsg} />
      </FieldContent>
    </Field>
  )
}
