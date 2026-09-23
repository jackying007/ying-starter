import { dirname, join } from 'path'
import { writeFile, unlink, access, mkdir } from 'fs/promises'
import { In } from 'typeorm'
import { nanoid } from 'nanoid'
import { FileEntity } from '@ying/db-typeorm'
import { apiConfig } from '@/config'
import { dataSource } from '@/common/modules/db'
import type { AddFileOptions, UploadFileOptions } from './abstract.file.service'
import { AbstractFileService } from './abstract.file.service'

async function exists(path: string) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export class LocalFileService extends AbstractFileService {
  async checkDirExistAndCreate(filePath: string) {
    const dir = dirname(filePath)
    if (!exists(dir)) {
      await this.checkDirExistAndCreate(dir)
      await mkdir(dir)
    }
  }

  getFileExt(name: string) {
    const ext = name.split('.')
    return ext[ext.length - 1]
  }

  async uploadFile({ file, fileType, from, userId, extra }: UploadFileOptions) {
    const ext = this.getFileExt(file.name)
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}.${ext}`

    const filePath = join(import.meta.dirname, `../../../../storage/${objectName}`)

    this.checkDirExistAndCreate(filePath)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

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
    return apiConfig.serverUrl + '/storage/' + objectName
  }

  async deleteFiles(files: FileEntity[]) {
    await dataSource.transaction(async t => {
      await t.delete(FileEntity, { id: In(files.map(el => el.id)) })
      await Promise.all(files.map(el => unlink(join(import.meta.dirname, `../../../../storage/${el.path}`))))
    })
  }
}
