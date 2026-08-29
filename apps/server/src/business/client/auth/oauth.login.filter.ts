import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import type { Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { authConfig } from '@/config'
import { getErrorMessage } from '@/common/filter'

@Catch()
export class OAuthLoginExceptionFilter implements ExceptionFilter {
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const message = getErrorMessage(exception)

    const i18n = I18nContext.current()
    response.redirect(`${this.authConf.authClientUrl}/${i18n?.lang ?? 'en'}/auth/error?msg=${message}`)
  }
}
