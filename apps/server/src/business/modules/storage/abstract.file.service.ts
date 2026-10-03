import { and, eq, notExists, sql } from 'drizzle-orm'
import { type ListFileDto, type TFileExtra, FileSourceType, FileType } from '@ying/shared'
import { mapOptional } from '@ying/utils'
import {
  fileTable,
  sysUserTable,
  userTable,
  articleTable,
  articleToFileTable,
  pushTemplateTable
} from '@ying/db-drizzle/schema'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'

const fileRefs = [
  { table: sysUserTable, column: sysUserTable.avatarId },
  { table: userTable, column: userTable.avatarId },
  { table: articleTable, column: articleTable.coverId },
  { table: articleToFileTable, column: articleToFileTable.fileId },
  { table: pushTemplateTable, column: pushTemplateTable.imageId }
] as const

export type TFile = typeof fileTable.$inferSelect

export type UploadFileOptions = {
  file: File
  fileType: FileType
  from: FileSourceType
  userId: number
  extra?: TFileExtra
}

export type AddFileOptions = {
  url: string
  fileType: FileType
  from: FileSourceType
  userId: number
}

const config: DrizzleServiceConfig = {
  table: fileTable,
  pk: fileTable.id
}
export abstract class AbstractFileService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  list(dto: ListFileDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { type, from, isExternal, date } = dto

    return db.query.fileTable.findMany({
      where: {
        type,
        from,
        isExternal,
        createAt: this.buildQueryDateBetween(date)
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  listCount(dto: ListFileDto) {
    const { type, from, isExternal, date } = dto
    return this.countBy(
      and(
        mapOptional(type, _ => eq(fileTable.type, _)),
        mapOptional(from, _ => eq(fileTable.from, _)),
        mapOptional(isExternal, _ => eq(fileTable.isExternal, _)),
        this.buildDateBetween(fileTable.createAt, date)
      )
    )
  }

  abstract uploadFile(options: UploadFileOptions): Promise<TFile> | TFile

  abstract getPresignedUrl(path: string): Promise<string> | string

  abstract deleteFiles(files: TFile[]): Promise<void>

  async addFile({ url, fileType, from, userId }: AddFileOptions) {
    return (
      await db
        .insert(fileTable)
        .values({
          type: fileType,
          from,
          isExternal: true,
          userId,
          path: url,
          url
        })
        .returning()
    )[0]
  }

  async deleteFileById(id: number) {
    const file = await db.query.fileTable.findFirst({ where: { id } })
    if (!file) return
    return this.deleteFiles([file])
  }

  findUnreferencedFiles() {
    return db
      .select()
      .from(fileTable)
      .where(
        and(
          ...fileRefs.map(el =>
            notExists(
              db
                .select({ one: sql`1` })
                .from(el.table)
                .where(eq(el.column, fileTable.id))
            )
          )
        )
      )
  }

  async clearDriftFile() {
    const files = await this.findUnreferencedFiles()
    await this.deleteFiles(files)
  }
}
