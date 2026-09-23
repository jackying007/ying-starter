import { BaseHttpError } from '@jying/http'

export class HttpError extends BaseHttpError {
  message: string
  constructor(message: string, ...args: ConstructorParameters<typeof BaseHttpError>) {
    super(...args)
    this.message = message
  }
  toJSON() {
    return {
      ...super.toJSON(),
      message: this.message
    }
  }
}
