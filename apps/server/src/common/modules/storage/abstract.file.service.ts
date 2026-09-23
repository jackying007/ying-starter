import { type ListFileDto, FileSourceType, FileType } from '@ying/shared'
import { FileEntity } from '@ying/db-typeorm'
import { dataSource } from '@/common/modules/db'
import { BaseService } from '@/common/service/base.service'

export type UploadFileOptions = {
  file: File
  fileType: FileType
  from: FileSourceType
  userId: number
  extra?: object
}

export type AddFileOptions = {
  url: string
  fileType: FileType
  from: FileSourceType
  userId: number
}

export abstract class AbstractFileService extends BaseService<FileEntity> {
  constructor() {
    super(dataSource.getRepository(FileEntity))
  }

  list(dto: ListFileDto) {
    const { take, skip, where } = this.buildListQuery(dto)
    const { type, from, isExternal } = dto

    Object.assign(where, {
      type,
      from,
      isExternal
    })

    return this.repository.find({
      where,
      skip,
      take,
      relations: [],
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListFileDto) {
    const { where } = this.buildListQuery(dto)
    const { type, from, isExternal } = dto

    Object.assign(where, {
      type,
      from,
      isExternal
    })

    return this.repository.countBy(where)
  }

  abstract uploadFile(options: UploadFileOptions): Promise<FileEntity> | FileEntity

  abstract addFile(options: AddFileOptions): Promise<FileEntity> | FileEntity

  abstract getPresignedUrl(path: string): Promise<string> | string

  abstract deleteFiles(files: FileEntity[]): Promise<void>

  async deleteFileById(id: number) {
    const file = await this.repository.findOne({ where: { id } })
    if (!file) return
    return this.deleteFiles([file])
  }

  findUnreferencedFiles() {
    const metadata = dataSource.getMetadata(FileEntity)

    const refs = dataSource.entityMetadatas.flatMap(meta =>
      meta.foreignKeys
        .filter(fk => fk.referencedEntityMetadata?.target === metadata.target)
        .map(fk => ({
          table: meta.tableName,
          column: fk.columnNames[0]
        }))
    )

    const qb = dataSource.getRepository(FileEntity).createQueryBuilder('f')

    refs.forEach((ref, index) => {
      qb.andWhere(`
      NOT EXISTS (
        SELECT 1
        FROM "${ref.table}" t${index}
        WHERE t${index}."${ref.column}" = f.id
      )
    `)
    })

    return qb.getMany()
  }

  async clearDriftFile() {
    const files = await this.findUnreferencedFiles()
    await this.deleteFiles(files)
  }
}
