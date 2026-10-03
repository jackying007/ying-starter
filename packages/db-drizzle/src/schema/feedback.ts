import { pgTable, varchar, text, serial } from 'drizzle-orm/pg-core'
import { baseTimestamp } from './base'

export const feedbackTable = pgTable('feedback', {
  id: serial().primaryKey(),
  firstName: varchar(),
  lastName: varchar(),
  email: varchar().notNull(),
  content: text().notNull(),
  ...baseTimestamp
})
