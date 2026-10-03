import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from '@ying/db-drizzle/relations'
import { dbConfig } from '@/config'
import { appLogger } from '@/app.logger'

export const db = drizzle({
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
  },
  relations
})
appLogger.log('Database initialized.')
