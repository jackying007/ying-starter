import { z } from 'zod'

export const clientLoginDto = z.object({
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty'),
  password: z
    .string()
    .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, 'validation.incorrect_password_format')
    .nonempty('validation.password_should_not_be_empty')
})

export type ClientLoginDto = z.infer<typeof clientLoginDto>

export const clientRegisterDto = z.object({
  name: z.string().nonempty('validation.nickname_should_not_be_empty'),
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty'),
  password: z
    .string()
    .nonempty('validation.password_should_not_be_empty')
    .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, 'validation.incorrect_password_format')
})

export type ClientRegisterDto = z.infer<typeof clientRegisterDto>

export const verifyEmailDto = z.object({
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty'),
  code: z.string().nonempty('validation.code_should_not_be_empty')
})

export type VerifyEmailDto = z.infer<typeof verifyEmailDto>

export const forgotPasswordDto = z.object({
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty')
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>

export const resetPasswordWithCodeDto = z.object({
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty'),
  code: z
    .string()
    .nonempty('validation.code_should_not_be_empty')
    .length(6, 'validation.verification_code_length_error'),
  password: z
    .string()
    .nonempty('validation.password_should_not_be_empty')
    .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, 'validation.incorrect_password_format')
})

export type ResetPasswordWithCodeDto = z.infer<typeof resetPasswordWithCodeDto>
