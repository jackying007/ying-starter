export const redisConfig = (() => {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not exist')
  }
  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT is not exist')
  }
  return {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 0
  }
})()
