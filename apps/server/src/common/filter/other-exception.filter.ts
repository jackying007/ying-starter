import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import { getErrorMessage } from './get-error-message'

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const request = ctx.getRequest<Request>()

    const message = getErrorMessage(exception)
    const status = HttpStatus.INTERNAL_SERVER_ERROR

    const errObj = {
      userId: request.user?.id,
      status,
      message,
      path: request.path
    }
    if (!errObj.userId) delete errObj.userId

    Logger.error(errObj, OtherExceptionFilter.name)

    ctx.getResponse<Response>().status(status).type('text').send(message)
  }
}
