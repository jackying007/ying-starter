import { Redis } from 'ioredis'
import { redisConfig } from '@/config'
import { appLogger } from '@/app.logger'

export const redis = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.pass,
  db: redisConfig.db,
  maxRetriesPerRequest: null
})

redis.on('connect', () => {
  appLogger.log('Redis connected.')
})
