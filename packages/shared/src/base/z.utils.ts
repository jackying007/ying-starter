import z from 'zod'

export const zRequiredString = (message = '不能为空') =>
  z
    .string({
      error: issue => (issue.input === undefined ? message : '请使用字符')
    })
    .nonempty(message)

export const zRequiredNumber = (message = '不能为空') =>
  z.number({
    error: issue => (issue.input === undefined ? message : '请使用数字')
  })
