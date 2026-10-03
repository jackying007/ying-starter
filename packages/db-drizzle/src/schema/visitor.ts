import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'
import type { PushSubscription } from '@ying/shared'
import { baseTimestamp, simpleJson } from './base'
import { userTable } from './user'

export const visitorTable = pgTable('visitor', {
  id: varchar().primaryKey(),
  languages: simpleJson<string[]>()(),
  userAgent: varchar(),
  deviceType: varchar(),
  pushSubscription: simpleJson<PushSubscription>()(),
  ...baseTimestamp
})

export const visitorToUserTable = pgTable('visitorToUser', {
  visitorId: varchar()
    .notNull()
    .references(() => visitorTable.id),
  userId: integer()
    .notNull()
    .references(() => userTable.id)
})
