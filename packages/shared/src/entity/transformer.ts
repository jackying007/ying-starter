import { ValueTransformer } from 'typeorm'

export const numericStringTransformer: ValueTransformer = {
  // 当写入数据库时，转换一下字符串
  to: value => value,
  // 当从数据库读取时，转换一下字符串
  from: (value: string) => {
    if (Number(value) === 0) {
      return '0'
    }
    return value.replace(/(\.\d*?[1-9])0+$/, '$1')
  }
}
