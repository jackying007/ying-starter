import { boolean, integer, pgEnum, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { FileType, FileSourceType, type TFileExtra } from '@ying/shared'
import { baseTimestamp, simpleJson } from './base'

// 必须导出，否则 drizzle-kit 读取 schema 不会创建 enum
export const fileTypeEnum = pgEnum('fileType', [FileType.Image, FileType.Video])
export const fileSourceTypeEnum = pgEnum('fileSourceType', [FileSourceType.Admin, FileSourceType.Client])

export const fileTable = pgTable('file', {
  id: serial().primaryKey(),
  type: fileTypeEnum().notNull(),
  from: fileSourceTypeEnum().notNull(),
  isExternal: boolean().notNull().default(false),
  userId: integer().notNull(),
  path: text().notNull().unique(),
  url: varchar({ length: 2083 }).notNull(),
  extra: simpleJson<TFileExtra>()(),
  ...baseTimestamp
})
