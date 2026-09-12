import { IsNotEmpty, Matches } from 'class-validator'

export class AdminLoginDto {
  @IsNotEmpty()
  username: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string
}
