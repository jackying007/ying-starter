import { Module } from '@nestjs/common'
import { ConfigModule as BaseConfigModule, ConfigType } from '@nestjs/config'
import { BullModule } from '@nestjs/bullmq'
import { ScheduleModule } from '@nestjs/schedule'
import { AcceptLanguageResolver, CookieResolver, I18nModule } from 'nestjs-i18n'
import { join } from 'path'

import { clientLanguagesConfig } from '@ying/shared'

import { apiConfig, redisConfig, dbConfig, storageConfig, authConfig, mailConfig, pushConfig } from '@/config'
import { RedisModule } from '@/common/modules/redis/redis.module'
import { DbModule } from '@/common/modules/db/db.module'
import { StorageModule } from '@/common/modules/storage/storage.module'
import { MailModule } from '@/common/modules/mail/mail.module'
import { PushModule } from '@/common/modules/push/push.module'
import { ConfigModule } from '@/common/modules/config/config.module'
import { AdminModule } from '@/business/admin/admin.module'
import { ClientModule } from '@/business/client/client.module'

@Module({
  imports: [
    BaseConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, redisConfig, dbConfig, authConfig, mailConfig, storageConfig, pushConfig],
      envFilePath: ['.env.local', '.env']
    }),
    I18nModule.forRoot({
      fallbackLanguage: clientLanguagesConfig.fallbackLng,
      loaderOptions: {
        path: join(import.meta.dirname, './i18n/'),
        watch: true
      },
      resolvers: [
        CookieResolver, // 默认读取 lang
        AcceptLanguageResolver
      ]
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    BullModule.forRootAsync({
      useFactory: (redisConf: ConfigType<typeof redisConfig>) => ({
        connection: {
          host: redisConf.host,
          port: redisConf.port,
          password: redisConf.pass,
          db: redisConf.db
        }
      }),
      inject: [redisConfig.KEY]
    }),
    DbModule,
    StorageModule,
    MailModule,
    PushModule,
    ConfigModule,
    AdminModule,
    ClientModule
  ]
})
export class AppModule {}
