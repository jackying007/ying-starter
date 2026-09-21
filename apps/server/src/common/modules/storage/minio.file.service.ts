import { In } from 'typeorm'
import { Client } from 'minio'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/shared'
import { storageConfig } from '@/config'
import { dataSource } from '@/common/modules/db'
import { ExpirSeconds } from './constant'
import type { AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { AbstractFileService } from './abstract.file.service'

export class MinioFileService extends AbstractFileService {
  private minioClient: Client

  constructor() {
    super()
    this.minioClient = new Client({
      endPoint: storageConfig.host,
      port: storageConfig.port,
      useSSL: storageConfig.port === 443,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey
    })
    void this.initMinioClient()
  }

  private async initMinioClient() {
    const bucketExists = await this.minioClient.bucketExists(storageConfig.bucket)
    if (!bucketExists) {
      await this.minioClient.makeBucket(storageConfig.bucket)
    }
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await this.minioClient.putObject(storageConfig.bucket, objectName, buffer, undefined, {
      'Content-Type': file.type,
      from,
      userId
    })
    const url = await this.getPresignedUrl(objectName)

    const fileEntity = this.repository.create({
      type: fileType,
      path: objectName,
      url,
      from,
      userId,
      extra
    })
    await this.repository.save(fileEntity)

    return fileEntity
  }

  async addFile({ url, fileType, from, userId }: AddFileOptions) {
    const fileEntity = this.repository.create({
      type: fileType,
      path: url,
      url,
      from,
      userId
    })

    await this.repository.save(fileEntity)

    return fileEntity
  }

  getPresignedUrl(objectName: string) {
    return this.minioClient.presignedUrl('get', storageConfig.bucket, objectName, ExpirSeconds)
  }

  async deleteFiles(files: FileEntity[]) {
    await dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })

      await this.minioClient.removeObjects(
        storageConfig.bucket,
        files.filter(el => !el.isExternal).map(el => el.path)
      )
    })
  }
}
