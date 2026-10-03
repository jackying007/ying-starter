import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import type { OAuthProvider } from '@ying/shared'
import { baseTimestamp } from './base'
import { userTable } from './user'

export const oauthAccountTable = pgTable('oauthAccount', {
  id: serial().primaryKey(),
  provider: varchar().notNull().$type<OAuthProvider>(),
  providerAccountId: varchar().notNull(),
  name: varchar().notNull(),
  avatar: varchar().notNull(),
  userId: integer()
    .notNull()
    .references(() => userTable.id),
  ...baseTimestamp
})
