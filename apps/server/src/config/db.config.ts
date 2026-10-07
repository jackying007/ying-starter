export const dbConfig = (() => {
  if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not exist')
  if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not exist')

  return {
    redisUrl: process.env.REDIS_URL,
    postgresUrl: process.env.POSTGRES_URL
  }
})()
