import type { ConfigType } from '@nestjs/config'
import { DataSource, In } from 'typeorm'
import { Client } from 'minio'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/shared/entity'
import { storageConfig } from '@/config'
import { ExpirSeconds } from './constant'
import type { AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { AbstractFileService } from './abstract.file.service'

export class MinioFileService extends AbstractFileService {
  private readonly storageConf: ConfigType<typeof storageConfig>

  private minioClient: Client

  constructor(dataSource: DataSource, storageConf: ConfigType<typeof storageConfig>) {
    super(dataSource)
    this.storageConf = storageConf

    this.minioClient = new Client({
      endPoint: this.storageConf.host,
      port: this.storageConf.port,
      useSSL: this.storageConf.port === 443,
      accessKey: this.storageConf.accessKey,
      secretKey: this.storageConf.secretKey
    })
    void this.initMinioClient()
  }

  private async initMinioClient() {
    const bucketExists = await this.minioClient.bucketExists(this.storageConf.bucket)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.storageConf.bucket)
    }
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}`

    await this.minioClient.putObject(this.storageConf.bucket, objectName, file.buffer, undefined, {
      'Content-Type': file.mimetype,
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
    return this.minioClient.presignedUrl('get', this.storageConf.bucket, objectName, ExpirSeconds)
  }

  async deleteFiles(files: FileEntity[]) {
    await this.dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })

      await this.minioClient.removeObjects(
        this.storageConf.bucket,
        files.filter(el => !el.isExternal).map(el => el.path)
      )
    })
  }
}
