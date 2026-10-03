import { and, eq, inArray, like, sql } from 'drizzle-orm'
import type { CreateOrUpdateArticleDto, ListArticleDto, UpdateArticleContentDto } from '@ying/shared'
import { articleTable, articleToFileTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const config: DrizzleServiceConfig = {
  table: articleTable,
  pk: articleTable.id
}
export class ArticleService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  list(dto: ListArticleDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { name, status, date } = dto

    return db.query.articleTable.findMany({
      columns: {
        content: false
      },
      where: {
        name: name ? { like: `%${name}%` } : undefined,
        status,
        createAt: this.buildQueryDateBetween(date)
      },
      limit,
      offset,
      with: {
        cover: true
      },
      orderBy: {
        createAt: 'desc',
        id: 'desc'
      }
    })
  }

  listCount(dto: ListArticleDto) {
    const { name, status, date } = dto
    return this.countBy(
      and(
        mapOptional(name, name => like(articleTable.name, `%${name}%`)),
        mapOptional(status, status => eq(articleTable.status, status)),
        this.buildDateBetween(articleTable.createAt, date)
      )
    )
  }

  async createOrUpdate(dto: CreateOrUpdateArticleDto) {
    if (dto.id) {
      await db.update(articleTable).set(dto).where(eq(articleTable.id, dto.id))
    } else {
      await db.insert(articleTable).values(dto)
    }
  }

  async detail(id: number) {
    const article = await db.query.articleTable.findFirst({
      where: { id },
      with: {
        cover: true,
        associatedFiles: true
      }
    })
    if (!article) throw new Error('article is not exist')
    return article
  }

  async view(id: number) {
    await db
      .update(articleTable)
      .set({
        view: sql`${articleTable.view} + 1`
      })
      .where(eq(articleTable.id, id))
  }

  async updateContent(dto: UpdateArticleContentDto) {
    const article = await db.query.articleTable.findFirst({ where: { id: dto.id }, with: { associatedFiles: true } })
    if (!article) throw new Error('article is not exist')

    await db.transaction(async tx => {
      await tx.update(articleTable).set({ content: dto.content }).where(eq(articleTable.id, article.id))
      const newAssociatedFileIds = dto.associatedFileIds
      if (newAssociatedFileIds?.length) {
        const oldAssociatedFileIds = article.associatedFiles.map(el => el.id)
        const waitDeleteIds = oldAssociatedFileIds.filter(o => !newAssociatedFileIds.includes(o))
        const waitCreateIds = newAssociatedFileIds.filter(n => !oldAssociatedFileIds.includes(n))
        if (waitDeleteIds.length)
          await tx
            .delete(articleToFileTable)
            .where(and(eq(articleToFileTable.articleId, article.id), inArray(articleToFileTable.fileId, waitDeleteIds)))
        if (waitCreateIds.length)
          await tx.insert(articleToFileTable).values(
            waitCreateIds.map(fileId => ({
              articleId: article.id,
              fileId
            }))
          )
      }
    })
  }
}
