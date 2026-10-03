import { integer, json, pgTable, serial, varchar, smallint, text, timestamp } from 'drizzle-orm/pg-core'
import { PushTaskStatus, PushRecordStatus } from '@ying/shared'
import type { TIntlText, PushActionDto, PushData } from '@ying/shared'
import { baseTimestamp, simpleJson } from './base'

export const pushTemplateTable = pgTable('pushTemplate', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  title: json().$type<TIntlText>().notNull(),
  link: varchar({ length: 255 }),
  body: json().$type<TIntlText>(),
  imageId: integer(),
  actions: simpleJson<PushActionDto[]>()(),
  ...baseTimestamp
})

export const pushTaskTable = pgTable('pushTask', {
  id: serial().primaryKey(),
  name: text().notNull(),
  time: timestamp({ withTimezone: true }),
  deviceType: text(),
  pushTemplateId: integer()
    .notNull()
    .references(() => pushTemplateTable.id),
  status: smallint().notNull().default(PushTaskStatus.Wait).$type<PushTaskStatus>(),
  ...baseTimestamp
})

export const pushRecordTable = pgTable('pushRecord', {
  id: serial().primaryKey(),
  pushData: simpleJson<PushData>()().notNull(),
  pushResult: text(),
  clicked: smallint().default(0).notNull(),
  status: smallint().notNull().default(PushRecordStatus.Pushing).$type<PushRecordStatus>(),
  pushTaskId: integer()
    .notNull()
    .references(() => pushTaskTable.id, {
      onDelete: 'cascade'
    }),
  visitorId: varchar().notNull(),
  ...baseTimestamp
})
