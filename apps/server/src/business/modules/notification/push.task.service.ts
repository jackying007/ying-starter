import { and, eq, like } from 'drizzle-orm'
import { PushRecordStatus } from '@ying/shared'
import type { ListPushTaskDto, CreateOrUpdatePushTaskDto, TaskStatus } from '@ying/shared'
import { pushTaskTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: pushTaskTable,
  pk: pushTaskTable.id
}
export class PushTaskService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  detail(id: number) {
    return db.query.pushTaskTable.findFirst({
      where: { id },
      with: {
        pushTemplate: true
      }
    })
  }

  async list(dto: ListPushTaskDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { name, date } = dto

    const pushTasks = await db.query.pushTaskTable.findMany({
      where: {
        name: name ? { like: `%${name}%` } : undefined,
        createAt: this.buildQueryDateBetween(date)
      },
      with: {
        pushTemplate: true,
        pushRecords: true
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })

    return pushTasks.map(el => {
      const taskStatus: TaskStatus = {
        success: el.pushRecords.reduce((count, record) => count + +(record.status === PushRecordStatus.Success), 0),
        fail: el.pushRecords.reduce((count, record) => count + +(record.status === PushRecordStatus.Fail), 0),
        pushing: el.pushRecords.reduce((count, record) => count + +(record.status === PushRecordStatus.Pushing), 0),
        click: el.pushRecords.reduce((count, record) => count + +(record.clicked === 1), 0)
      }
      return {
        ...el,
        taskStatus
      }
    })
  }

  listCount(dto: ListPushTaskDto) {
    const { name, date } = dto
    return this.countBy(
      and(
        mapOptional(name, _ => like(pushTaskTable.name, `%${_}%`)),
        this.buildDateBetween(pushTaskTable.createAt, date)
      )
    )
  }

  async createOrUpdate(dto: CreateOrUpdatePushTaskDto) {
    if (dto.id) {
      await db.update(pushTaskTable).set(dto).where(eq(pushTaskTable.id, dto.id))
    } else {
      await db.insert(pushTaskTable).values(dto)
    }
  }
}
