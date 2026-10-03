import { Client } from 'minio'
import { nanoid } from 'nanoid'
import { inArray } from 'drizzle-orm'
import { fileTable } from '@ying/db-drizzle/schema'
import { db } from '@/common/modules/db'
import { storageConfig } from '@/config'
import type { TFile, UploadFileOptions } from './abstract.file.service'
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

    return (
      await db
        .insert(fileTable)
        .values({
          type: fileType,
          path: objectName,
          url,
          from,
          userId,
          extra
        })
        .returning()
    )[0]
  }

  getPresignedUrl(objectName: string) {
    return this.minioClient.presignedUrl('get', storageConfig.bucket, objectName)
  }

  async deleteFiles(files: TFile[]) {
    await db.transaction(async tx => {
      await tx.delete(fileTable).where(
        inArray(
          fileTable.id,
          files.map(el => el.id)
        )
      )

      await this.minioClient.removeObjects(
        storageConfig.bucket,
        files.filter(el => !el.isExternal).map(el => el.path)
      )
    })
  }
}
