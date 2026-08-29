import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { ConfigType } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import qs from 'qs'
import { apiConfig, storageConfig } from '@/config'
import { OtherExceptionFilter, HttpExceptionFilter } from '@/common/filter'
import { AppInterceptor } from './app.interceptor'
import { AppModule } from './app.module'
import { AppLogger } from './app.logger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const apiConf = app.get<ConfigType<typeof apiConfig>>(apiConfig.KEY)
  const storageConf = app.get<ConfigType<typeof storageConfig>>(storageConfig.KEY)
  app.enableCors()
  app.setGlobalPrefix('/api')
  app.useGlobalFilters(new OtherExceptionFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new AppInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true
    })
  )
  app.set('query parser', (queryString: string) => qs.parse(queryString))

  if (storageConf.mode === 'local') {
    // 存储本地模式图片存储的位置
    app.useStaticAssets(join(import.meta.dirname, '../storage'), { prefix: '/storage', maxAge: '30d' })
  }

  await app.listen(apiConf.port)

  Logger.log(`🚀 Application is running on port: ${apiConf.port}`, 'App')

  const appLogger = new AppLogger()
  appLogger.setSaveLogLevels(['error', 'verbose'])
  app.useLogger(appLogger)

  process.on('uncaughtException', error => {
    Logger.error('未捕获的异常：', error.stack, 'App')
  })
  process.on('unhandledRejection', reason => {
    Logger.error('未处理的拒绝：', reason, 'App')
  })
}
void bootstrap()
