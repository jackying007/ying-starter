import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { baseTimestamp } from './base'

export const userTable = pgTable('user', {
  id: serial().primaryKey(),
  name: varchar(),
  email: varchar().notNull().unique(),
  emailVerified: boolean().notNull(),
  password: varchar(),
  avatarId: integer(),
  ...baseTimestamp
})
