export const dbConfig = (() => {
  if (!process.env.DB_HOST) {
    throw new Error('DB_HOST is not exist')
  }
  if (!process.env.DB_PORT) {
    throw new Error('DB_PORT is not exist')
  }
  if (!process.env.DB_USER) {
    throw new Error('DB_USER is not exist')
  }
  if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD is not exist')
  }
  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME is not exist')
  }

  return {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: !!process.env.DB_LOGGING,
    synchronize: !!process.env.DB_SYNCHRONIZE
  }
})()
