import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import { getErrorMessage } from './get-error-message'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()

    const message = getErrorMessage(exception)
    const status = exception.getStatus()

    const errObj = {
      userId: request.user?.id,
      status,
      message,
      path: request.path
    }
    if (!errObj.userId) delete errObj.userId

    Logger.error(errObj, HttpExceptionFilter.name)

    ctx.getResponse<Response>().status(status).type('text').send(message)
  }
}
