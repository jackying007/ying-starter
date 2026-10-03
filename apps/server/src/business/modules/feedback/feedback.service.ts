import { and, like } from 'drizzle-orm'
import type { CreateFeedbackDto, ListFeedbackDto } from '@ying/shared'
import { feedbackTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: feedbackTable,
  pk: feedbackTable.id
}
export class FeedbackService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  list(dto: ListFeedbackDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { email, date } = dto

    return db.query.feedbackTable.findMany({
      where: {
        email: email ? { like: `%${email}%` } : undefined,
        ccreateAt: this.buildQueryDateBetween(date)
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  listCount(dto: ListFeedbackDto) {
    const { email, date } = dto
    return this.countBy(
      and(
        mapOptional(email, email => like(feedbackTable.email, `%${email}%`)),
        this.buildDateBetween(feedbackTable.createAt, date)
      )
    )
  }

  async create(dto: CreateFeedbackDto) {
    await db.insert(feedbackTable).values(dto)
  }
}
