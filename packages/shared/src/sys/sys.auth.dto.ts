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
