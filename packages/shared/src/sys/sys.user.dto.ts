import { z } from 'zod'
import { BasicStatus, listDto } from '../base'

export const listSysUserDto = listDto.extend({
  name: z.string().optional(),
  account: z.string().optional(),
  status: z.coerce.number().pipe(z.enum(BasicStatus)).optional(),
  roleIds: z.array(z.coerce.number()).optional()
})

export type ListSysUserDto = z.infer<typeof listSysUserDto>

export const createOrUpdateSysUserDto = z
  .object({
    id: z.number().optional(),
    name: z.string().nonempty('名称不能为空').min(2, '名称必须大于或等于6个字符').max(32, '名称必须小于或等于32个字符'),
    account: z
      .string()
      .nonempty('帐号不能为空')
      .min(6, '帐号必须大于或等于6个字符')
      .max(32, '帐号必须小于或等于32个字符'),
    email: z.email().optional(),
    password: z
      .string()
      .regex(
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/,
        "密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]"
      )
      .optional(),
    status: z.enum(BasicStatus),
    remark: z.string().max(200).optional(),
    roleIds: z.array(z.number())
  })
  .check(ctx => {
    const { id, password } = ctx.value
    if (id && password != undefined) {
      ctx.issues.push({
        code: 'custom',
        path: ['password'],
        input: ctx.value,
        message: '更新不能输入密码'
      })
    }
    if (!id && !password) {
      ctx.issues.push({
        code: 'custom',
        path: ['password'],
        input: ctx.value,
        message: '密码不能为空'
      })
    }
  })
export type CreateOrUpdateSysUserDto = z.infer<typeof createOrUpdateSysUserDto>

export const updateSysUserPasswordDto = z.object({
  id: z.number(),
  password: z
    .string()
    .nonempty('密码不能为空')
    .regex(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/,
      "密码必须包含数字、小写字母、大写字母和特殊符号[!@#$%^&*;',.]"
    )
})
export type UpdateSysUserPasswordDto = z.infer<typeof updateSysUserPasswordDto>

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
