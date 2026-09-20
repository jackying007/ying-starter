import { z } from 'zod'
import { listDto } from '../base'

export const listUserDto = listDto.extend({
  name: z.string().optional(),
  email: z.string().optional()
})

export type ListUserDto = z.infer<typeof listUserDto>

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

export const updateUserInfoDto = z.object({
  name: z.string().nonempty('validation.nickname_should_not_be_empty').optional(),
  avatarId: z.number().nullish()
})

export type UpdateUserInfoDto = z.infer<typeof updateUserInfoDto>

export const resetPasswordDto = z.object({
  oldPassword: z.string().optional(),
  newPassword: z
    .string()
    .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, 'validation.incorrect_password_format')
    .nonempty('validation.new_password_should_not_be_empty')
})

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>
