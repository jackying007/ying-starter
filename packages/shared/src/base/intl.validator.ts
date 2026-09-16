import z from 'zod'
import { clientLanguagesConfig, type TIntlText } from '../base'

type IsIntlTextOptions = {
  minLength?: number
  maxLength?: number
  canEmpty?: boolean
}

export const zIntlText = (options?: IsIntlTextOptions) =>
  z
    .custom<TIntlText>()
    .optional()
    .superRefine((value, ctx) => {
      const data = value ?? {}
      const keys = Object.keys(data)
      if (keys.length <= 0 && !options?.canEmpty) {
        ctx.addIssue({
          code: 'custom',
          message: '内容不能为空'
        })
        return
      }
      for (const key of clientLanguagesConfig.languages) {
        const val = data[key] as string
        if ((!val || typeof val !== 'string') && !options?.canEmpty) {
          ctx.addIssue({
            code: 'custom',
            message: `${key}的内容不能为空`
          })
          return
        }
        if (options?.minLength !== undefined && val && val.length < options.minLength) {
          ctx.addIssue({
            code: 'custom',
            message: `${key}的内容长度不得小于${options.minLength}`
          })
          return
        }
        if (options?.maxLength !== undefined && val && val.length > options.maxLength) {
          ctx.addIssue({
            code: 'custom',
            message: `${key}的内容长度不得大于${options.maxLength}`
          })
          return
        }
      }
    })
