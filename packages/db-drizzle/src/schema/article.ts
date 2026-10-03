import { BasicStatus, type TIntlText } from '@ying/shared'
import { integer, json, pgTable, serial, smallint, varchar } from 'drizzle-orm/pg-core'
import { baseTimestamp, textArray } from './base'
import { fileTable } from './file'

export const articleTable = pgTable('article', {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  title: json().notNull().$type<TIntlText>(),
  keywords: textArray(),
  content: json().$type<TIntlText>(),
  coverId: integer()
    .notNull()
    .references(() => fileTable.id),
  status: smallint().notNull().default(BasicStatus.ENABLE).$type<BasicStatus>(),
  view: integer().notNull().default(0),
  ...baseTimestamp
})

export const articleToFileTable = pgTable('articleToFile', {
  articleId: integer()
    .notNull()
    .references(() => articleTable.id),
  fileId: integer()
    .notNull()
    .references(() => fileTable.id)
})
