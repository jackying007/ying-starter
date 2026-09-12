import { BaseHttpError } from '@jying/http'
import type { ErrorVo } from '@ying/shared'

export class HttpError extends BaseHttpError {
  errData: ErrorVo
  constructor(errData: ErrorVo, ...args: ConstructorParameters<typeof BaseHttpError>) {
    super(...args)
    this.errData = errData
    if (Array.isArray(errData.message)) {
      this.message = errData.message.join(',')
    } else {
      this.message = errData.message
    }
  }
  toJSON() {
    return {
      ...this.errData,
      statusText: this.statusText,
      message: this.message
    }
  }
}
