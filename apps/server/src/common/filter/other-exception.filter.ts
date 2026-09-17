import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { ErrorVo } from '@ying/shared'
import { getErrorMessage } from './get-error-message'

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const request = ctx.getRequest<Request>()

    const res: ErrorVo = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: getErrorMessage(exception),
      path: request.url
    }

    Logger.error(res, OtherExceptionFilter.name)

    ctx.getResponse<Response>().status(HttpStatus.INTERNAL_SERVER_ERROR).json(res)
  }
}
