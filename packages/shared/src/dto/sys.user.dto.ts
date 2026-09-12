import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator'
import { Type } from 'class-transformer'
import { BasicStatus } from '../'
import { ListDto } from './list.dto'

export class ListSysUserDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  account?: string

  @IsOptional()
  @IsEnum(BasicStatus)
  @Type(() => Number)
  status?: BasicStatus

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  roleIds?: number[]
}

export class CreateSysUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32, { message: '名称必须小于或等于32个字符' })
  @MinLength(2, { message: '名称必须大于或等于6个字符' })
  name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(32, { message: '帐号必须小于或等于32个字符' })
  @MinLength(6, { message: '帐号必须大于或等于6个字符' })
  account: string

  @ValidateIf(e => e.email !== '')
  @IsOptional()
  @IsEmail()
  email?: string

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
  })
  password: string

  @IsEnum(BasicStatus)
  status: BasicStatus

  @IsOptional()
  @MaxLength(200)
  remark?: string

  @IsArray()
  roleIds: number[]
}

export class UpdateSysUserDto extends CreateSysUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsEmpty()
  declare password: string
}

export class UpdateSysUserPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
  })
  password: string
}

export class UpdateSysUserSelfUserInfoDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}

export class UpdateSysUserSelfPasswordDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
  })
  oldPass: string

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
  })
  newPass: string
}
