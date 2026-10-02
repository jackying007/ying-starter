import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

const bluePrefix = '\x1B[36m'
const redPrefix = '\x1B[31m'
const yellowPrefix = '\x1B[33m'
const orangePrefix = '\x1b[38;5;208m'
const resetSuffix = '\x1b[0m'

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const { method, path, user } = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    const now = Date.now()
    return next.handle().pipe(
      map(data => {
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
          response.type('application/json')
          return JSON.stringify(data)
        }
        return data
      }),
      tap(() => {
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
