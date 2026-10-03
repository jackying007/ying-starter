import { and, eq, like } from 'drizzle-orm'
import type { CreateVisitorDto, ListVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import { visitorTable, visitorToUserTable, userTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: visitorTable,
  pk: visitorTable.id
}
export class VisitorService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  async createVisitor(dto: CreateVisitorDto) {
    const existVisitor = await db.query.visitorTable.findFirst({
      where: {
        id: dto.id
      }
    })
    if (existVisitor) return
    await db.insert(visitorTable).values(dto)
  }

  async subscribe(dto: NoticeSubscribeDto) {
    await db
      .update(visitorTable)
      .set({ pushSubscription: dto.pushSubscription })
      .where(eq(visitorTable.id, dto.visitorId))
  }

  async bindUser(visitorId: string, userId: number) {
    const existVisitor = await db.query.visitorTable.findFirst({
      where: { id: visitorId },
      with: { users: true }
    })
    const existUser = await db.query.userTable.findFirst({ where: { id: userId } })
    if (!existVisitor || !existUser) return

    if (existVisitor.users.some(el => el.id === existUser.id)) return
    await db.insert(visitorToUserTable).values({
      visitorId,
      userId
    })
  }

  list(dto: ListVisitorDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { language, deviceType, date } = dto

    return db.query.visitorTable.findMany({
      where: {
        languages: language ? { like: `%${language}%` } : undefined,
        deviceType: deviceType ? { like: `%${deviceType}%` } : undefined,
        createAt: this.buildQueryDateBetween(date)
      },
      with: {
        users: true
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  listCount(dto: ListVisitorDto) {
    const { language, deviceType, date } = dto
    return this.countBy(
      and(
        mapOptional(language, _ => like(visitorTable.languages, `%${_}%`)),
        mapOptional(deviceType, _ => like(visitorTable.deviceType, `%${_}%`)),
        this.buildDateBetween(userTable.createAt, date)
      )
    )
  }
}
