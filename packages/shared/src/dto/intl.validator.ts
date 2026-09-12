import { registerDecorator, ValidationArguments } from 'class-validator'
import { clientLanguagesConfig, type TIntlText } from '../'

type IsIntlTextOptions = {
  minLength?: number
  maxLength?: number
  canEmpty?: boolean
}

function check(value: TIntlText, options?: IsIntlTextOptions): string | undefined {
  const data = value || {}
  const keys = Object.keys(data)
  if (keys.length <= 0 && !options?.canEmpty) return '内容不能为空'

  for (let i = 0; i < clientLanguagesConfig.languages.length; i++) {
    const key = clientLanguagesConfig.languages[i]
    const val = data[key]
    if (!val && !options?.canEmpty) return `${key}的内容不能为空`
    if (options?.minLength !== undefined && val && val.length < options.minLength) {
      return `${key}的内容长度不得小于${options.minLength}`
    }
    if (options?.maxLength !== undefined && val && val.length > options.maxLength) {
      return `${key}的内容长度不得大于${options.maxLength}`
    }
  }

  return
}

export function IsIntlText(options?: IsIntlTextOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIntlText',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: {
        validate(value: TIntlText) {
          const checkResult = check(value, options)
          if (checkResult) return false
          return true
        },
        defaultMessage(_args: ValidationArguments) {
          const checkResult = check(_args.value, options)
          return checkResult || ''
        }
      }
    })
  }
}
