import { dirname, join } from 'path'
import { writeFileSync, unlink, existsSync, mkdirSync, type PathLike } from 'fs'
import { DataSource, In } from 'typeorm'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/entity'
import type { AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { AbstractFileService } from './abstract.file.service'

export class LocalFileService extends AbstractFileService {
  private readonly serverUrl: string
  constructor(dataSource: DataSource, serverUrl: string) {
    super(dataSource)
    this.serverUrl = serverUrl
  }

  checkDirExistAndCreate(filePath: string) {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      this.checkDirExistAndCreate(dir)
      mkdirSync(dir)
    }
  }

  getFileExt(name: string) {
    const ext = name.split('.')
    return ext[ext.length - 1]
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const ext = this.getFileExt(file.originalname)
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}.${ext}`

    const filePath = join(__dirname, `../../../../uploadfiles/${objectName}`)

    this.checkDirExistAndCreate(filePath)
    writeFileSync(filePath, file.buffer)

    const url = this.getPresignedUrl(objectName)

    const fileEnitity = this.repository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId,
      extra
    })
    await this.repository.save(fileEnitity)

    return fileEnitity
  }

  async addFile({ url, fileType, from, userId }: AddFileOptions) {
    const fileEntity = this.repository.create({
      type: fileType,
      from,
      isExternal: true,
      userId,
      path: url,
      url
    })

    await this.repository.save(fileEntity)

    return fileEntity
  }

  getPresignedUrl(objectName: string) {
    return this.serverUrl + '/upload/' + objectName
  }

  private deleteDiskFile(path: PathLike) {
    return new Promise(re => {
      unlink(path, re)
    })
  }

  async deleteFiles(files: FileEntity[]) {
    await this.dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })
      await Promise.all(files.map(el => this.deleteDiskFile(join(__dirname, `../../../uploadfiles/${el.path}`))))
    })
  }
}
