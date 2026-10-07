import { Redis } from 'ioredis'
import { dbConfig } from '@/config'
import { appLogger } from '@/app.logger'

export const redis = new Redis(dbConfig.redisUrl, {
  maxRetriesPerRequest: null
})

redis.on('connect', () => appLogger.log('Redis connected.'))
