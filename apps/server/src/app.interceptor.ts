import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import type { Request } from 'express'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { type BaseVo, isBaseVo, wrapBaseVo } from '@ying/shared'

const bluePrefix = '\x1B[36m'
const redPrefix = '\x1B[31m'
const yellowPrefix = '\x1B[33m'
const orangePrefix = '\x1b[38;5;208m'
const resetSuffix = '\x1b[0m'

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseVo<string | number, any>> {
    const now = Date.now()
    return next.handle().pipe(
      map(data => (isBaseVo(data) ? data : wrapBaseVo(0, data))),
      tap(() => {
        const http = context.switchToHttp()
        const { method, path, user } = http.getRequest<Request>()
        const useTime = Date.now() - now
        const userStr = user?.id ? `${orangePrefix}uid=[${user.id}]${resetSuffix} ` : ''
        if (useTime > 1000) {
          Logger.warn(
            `${userStr}${bluePrefix}processing ${method} ${path}${resetSuffix} ${redPrefix}use ${useTime}ms`,
            AppInterceptor.name
          )
        } else {
          Logger.log(
            `${userStr}${bluePrefix}processing ${method} ${path}${resetSuffix} ${yellowPrefix}use ${useTime}ms`,
            AppInterceptor.name
          )
        }
      })
    )
  }
}
