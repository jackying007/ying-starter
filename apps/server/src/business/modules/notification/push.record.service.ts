import { and, eq } from 'drizzle-orm'
import type { ListPushRecordDto } from '@ying/shared'
import { pushRecordTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: pushRecordTable,
  pk: pushRecordTable.id
}
export class PushRecordService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  detail(id: number) {
    return db.query.pushRecordTable.findMany({
      where: { id }
    })
  }

  list(dto: ListPushRecordDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { visitorId, pushTaskId, status, date } = dto

    return db.query.pushRecordTable.findMany({
      where: {
        visitorId: mapOptional(visitorId, _ => _),
        pushTaskId: mapOptional(pushTaskId, _ => _),
        status: mapOptional(status, _ => _),
        createAt: this.buildQueryDateBetween(date)
      },
      with: {
        pushTask: true
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  listCount(dto: ListPushRecordDto) {
    const { visitorId, pushTaskId, status, date } = dto
    return this.countBy(
      and(
        mapOptional(visitorId, _ => eq(pushRecordTable.visitorId, _)),
        mapOptional(pushTaskId, _ => eq(pushRecordTable.pushTaskId, _)),
        mapOptional(status, _ => eq(pushRecordTable.status, _)),
        this.buildDateBetween(pushRecordTable.createAt, date)
      )
    )
  }

  async click(id: number) {
    await db.update(pushRecordTable).set({ clicked: 1 }).where(eq(pushRecordTable.id, id))
  }
}
