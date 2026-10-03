import { and, like, eq, sql, desc } from 'drizzle-orm'
import type { ListPushTemplateDto, CreateOrUpdatePushTemplateDto } from '@ying/shared'
import { pushTemplateTable, fileTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: pushTemplateTable,
  pk: pushTemplateTable.id
}
export class PushTemplateService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  buildWhere(dto: ListPushTemplateDto) {
    const { name, title, date } = dto
    return and(
      mapOptional(name, _ => like(pushTemplateTable.name, `%${_}%`)),
      mapOptional(title, _ => sql`${pushTemplateTable.title}::text LIKE %${_}%`),
      this.buildDateBetween(pushTemplateTable.createAt, date)
    )
  }

  async list(dto: ListPushTemplateDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)

    const list = await db
      .select({
        pushTemplate: pushTemplateTable,
        image: fileTable
      })
      .from(pushTemplateTable)
      .leftJoin(fileTable, eq(pushTemplateTable.imageId, fileTable.id))
      .where(this.buildWhere(dto))
      .orderBy(desc(pushTemplateTable.createAt))
      .limit(limit)
      .offset(offset)

    return list.map(el => ({
      ...el.pushTemplate,
      image: el.image
    }))
  }

  listCount(dto: ListPushTemplateDto) {
    return this.countBy(this.buildWhere(dto))
  }

  async createOrUpdate(dto: CreateOrUpdatePushTemplateDto) {
    if (dto.id) {
      await db.update(pushTemplateTable).set(dto).where(eq(pushTemplateTable.id, dto.id))
    } else {
      await db.insert(pushTemplateTable).values(dto)
    }
  }

  detail(id: number) {
    return db.query.pushTemplateTable.findFirst({
      where: { id },
      with: {
        image: true
      }
    })
  }
}
