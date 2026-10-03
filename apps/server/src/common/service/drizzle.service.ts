import {
  between,
  countDistinct,
  eq,
  inArray,
  SQL,
  type ExtractTablesFromSchema,
  type RelationFieldsFilterInternals
} from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'
import type { ListDto } from '@ying/shared'
import * as schema from '@ying/db-drizzle/schema'
import { db } from '@/common/modules/db'

export async function countBy(table: TSchema[keyof TSchema], countColumn: PgColumn, sql?: SQL) {
  const [result] = await db
    .select({ count: countDistinct(countColumn) })
    .from(table)
    .where(sql)
  return result.count
}

type TSchema = ExtractTablesFromSchema<typeof schema>

export type DrizzleServiceConfig = { table: TSchema[keyof TSchema]; pk: PgColumn }

export class DrizzleService<Config extends DrizzleServiceConfig> {
  config: Config
  constructor(config: Config) {
    this.config = config
  }

  buildLimitAndOffset(dto: ListDto) {
    const { page, size } = dto
    const limit = size ?? 10
    const offset = ((page ?? 1) - 1) * (size ?? 10)

    return {
      limit,
      offset
    }
  }

  buildDateRange(date: string[] | undefined) {
    if (!date) return undefined
    return {
      start: new Date(date[0]),
      end: new Date(date[1])
    }
  }

  buildQueryDateBetween(date?: string[]): RelationFieldsFilterInternals<Date> | undefined {
    const range = this.buildDateRange(date)
    return range
      ? {
          gte: range.start,
          lte: range.end
        }
      : undefined
  }

  buildDateBetween(column: PgColumn, date?: string[]) {
    const range = this.buildDateRange(date)
    return range ? between(column, range.start, range.end) : range
  }

  async countBy(sql?: SQL) {
    return countBy(this.config.table, this.config.pk, sql)
  }

  delete(criteria: string | string[] | number | number[]) {
    return db
      .delete(this.config.table)
      .where(Array.isArray(criteria) ? inArray(this.config.pk, criteria) : eq(this.config.pk, criteria))
  }

  softDelete(criteria: string | string[] | number | number[]) {
    return db
      .update(this.config.table)
      .set({
        deletedAt: new Date()
      })
      .where(Array.isArray(criteria) ? inArray(this.config.pk, criteria) : eq(this.config.pk, criteria))
  }
}
