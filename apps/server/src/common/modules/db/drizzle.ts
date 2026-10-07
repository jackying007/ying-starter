import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from '@ying/db-drizzle/relations'
import { dbConfig } from '@/config'
import { appLogger } from '@/app.logger'

export const db = drizzle(dbConfig.postgresUrl, {
  relations
})
appLogger.log('Database initialized.')
