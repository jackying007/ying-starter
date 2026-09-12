import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'

export class ClientLoginDto {
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}

export class ClientRegisterDto {
  @IsNotEmpty({
    message: 'validation.nickname_should_not_be_empty'
  })
  name: string

  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}

export class VerifyEmailDto {
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  email: string

  @IsNotEmpty({
    message: 'validation.code_should_not_be_empty'
  })
  code: string
}

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  email: string
}

export class ResetPasswordWithCodeDto {
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  email: string

  @Length(6, 6, {
    message: 'validation.verification_code_length_error'
  })
  @IsNotEmpty({
    message: 'validation.code_should_not_be_empty'
  })
  code: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}
