import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@ying/shared-react/ui'

type VerificationCodeProps = {
  value?: string
  onChange?: (val: string) => void
  onComplete?: () => void
  disabled?: boolean
  invalid?: boolean
  ['aria-invalid']?: React.ComponentProps<'div'>['aria-invalid']
}

export const VerificationCode = ({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  ...props
}: VerificationCodeProps) => {
  const finalInvalid = invalid || props['aria-invalid']
  return (
    <InputOTP
      containerClassName="flex justify-center"
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      disabled={disabled}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} aria-invalid={finalInvalid} />
        <InputOTPSlot index={1} aria-invalid={finalInvalid} />
        <InputOTPSlot index={2} aria-invalid={finalInvalid} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} aria-invalid={finalInvalid} />
        <InputOTPSlot index={4} aria-invalid={finalInvalid} />
        <InputOTPSlot index={5} aria-invalid={finalInvalid} />
      </InputOTPGroup>
    </InputOTP>
  )
}
