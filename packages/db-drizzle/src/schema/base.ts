import { sql } from 'drizzle-orm'
import { customType, timestamp } from 'drizzle-orm/pg-core'

export const baseTimestamp = {
  createAt: timestamp({
    withTimezone: true
  })
    .defaultNow()
    .notNull(),
  updateAt: timestamp({
    withTimezone: true
  })
    .defaultNow()
    .$onUpdateFn(() => sql`now()`)
    .notNull(),
  deleteAt: timestamp({
    withTimezone: true
  })
}

export const varcharArray = customType<{
  data: string[]
  driverData: string
}>({
  dataType() {
    return 'varchar'
  },
  toDriver(value) {
    return value.join(',')
  },
  fromDriver(value) {
    return value.split(',')
  }
})

export const textArray = customType<{
  data: string[]
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value) {
    return value.join(',')
  },
  fromDriver(value) {
    return value.split(',')
  }
})

export const simpleJson = <T>() =>
  customType<{
    data: T
    driverData: string
  }>({
    dataType() {
      return 'text'
    },
    toDriver(value) {
      return JSON.stringify(value)
    },
    fromDriver(value) {
      return JSON.parse(value)
    }
  })
