import { Global, Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { Redis } from 'ioredis'
import { redisConfig } from '@/config/redis.config'
import { RedisToken } from './constant'

@Global()
@Module({
  providers: [
    {
      provide: RedisToken,
      useFactory(redisConf: ConfigType<typeof redisConfig>) {
        const redis = new Redis({
          host: redisConf.host,
          port: redisConf.port,
          password: redisConf.pass,
          db: redisConf.db
        })
        return {
          redis,
          subscriber: redis.duplicate()
        }
      },
      inject: [redisConfig.KEY]
    }
  ],
  exports: [RedisToken]
})
export class RedisModule {}
