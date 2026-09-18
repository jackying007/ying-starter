import { z } from 'zod'

export const adminLoginDto = z.object({
  username: z.string().nonempty(),
  password: z
    .string()
    .nonempty()
    .regex(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/,
      `密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]`
    )
})
export type AdminLoginDto = z.infer<typeof adminLoginDto>

export const updateSysUserSelfUserInfoDto = z.object({
  name: z.string().optional(),
  avatarId: z.number().optional()
})
export type UpdateSysUserSelfUserInfoDto = z.infer<typeof updateSysUserSelfUserInfoDto>

export const updateSysUserSelfPasswordDto = z.object({
  oldPass: z
    .string()
    .nonempty('旧密码不能为空')
    .regex(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/,
      "密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]"
    ),
  newPass: z
    .string()
    .nonempty('新密码不能为空')
    .regex(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/,
      "密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]"
    )
})
export type UpdateSysUserSelfPasswordDto = z.infer<typeof updateSysUserSelfPasswordDto>
