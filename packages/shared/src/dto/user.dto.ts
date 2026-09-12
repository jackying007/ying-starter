import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator'

import { ListDto } from './list.dto'

export class ListUserDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  email?: string
}

export enum UserStatType {
  Register = 'register',
  Google = 'google',
  Github = 'github'
}

export class UserStatVo {
  categories: string[]
  list: number[]
}

export class UserStatByTypeVo {
  categories: string[]
  types: {
    name: UserStatType
    data: number[]
  }[]
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'validation.nickname_should_not_be_empty'
  })
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}

export class ResetPasswordDto {
  @IsOptional()
  oldPassword: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.new_password_should_not_be_empty'
  })
  newPassword: string
}
