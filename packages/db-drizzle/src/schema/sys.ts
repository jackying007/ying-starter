import { boolean, smallint, serial, integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import { BasicStatus } from '@ying/shared'
import { baseTimestamp } from './base'
import { fileTable } from './file'

export const sysPermissionTable = pgTable('sysPermission', {
  sort: integer().notNull().default(0),
  label: varchar().notNull(),
  code: varchar().primaryKey(),
  parentCode: varchar(),
  ...baseTimestamp
})

export const sysRoleTable = pgTable('sysRole', {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
  status: smallint().notNull().default(BasicStatus.ENABLE).$type<BasicStatus>(),
  systemic: boolean().notNull().default(false),
  remark: varchar(),
  ...baseTimestamp
})

export const sysRoleToSysPermissionTable = pgTable('sysRoleToSysPermission', {
  sysRoleId: integer()
    .notNull()
    .references(() => sysRoleTable.id, { onDelete: 'cascade' }),
  sysPermissionCode: varchar()
    .notNull()
    .references(() => sysPermissionTable.code, { onDelete: 'cascade' })
})

export const sysRoleToSysUserTable = pgTable('sysRoleToSysUser', {
  sysRoleId: integer()
    .notNull()
    .references(() => sysRoleTable.id, { onDelete: 'cascade' }),
  sysUserId: integer()
    .notNull()
    .references(() => sysUserTable.id, { onDelete: 'cascade' })
})

export const sysUserTable = pgTable('sysUser', {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  account: varchar().notNull().unique(),
  email: varchar(),
  password: varchar().notNull(),
  avatarId: integer().references(() => fileTable.id),
  status: smallint().notNull().default(BasicStatus.ENABLE).$type<BasicStatus>(),
  remark: varchar(),
  ...baseTimestamp
})
