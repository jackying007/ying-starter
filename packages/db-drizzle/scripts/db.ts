import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from '../src/relations'
import { DATABASE_URL } from '../drizzle.config'

export const db = drizzle(DATABASE_URL, { relations })
