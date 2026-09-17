import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { ErrorVo } from '@ying/shared'
import { getErrorMessage } from './get-error-message'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus()
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()

    const res: ErrorVo = {
      status,
      message: getErrorMessage(exception),
      path: request.url
    }

    Logger.error(res, HttpExceptionFilter.name)

    ctx.getResponse<Response>().status(status).json(res)
  }
}
