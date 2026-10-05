import { dirname, join } from 'path'
import { writeFile, unlink, access, mkdir } from 'fs/promises'
import { nanoid } from 'nanoid'
import { inArray } from 'drizzle-orm'
import { fileTable } from '@ying/db-drizzle/schema'
import { db } from '@/common/modules/db'
import { apiConfig } from '@/config'
import type { TFile, UploadFileOptions } from './abstract.file.service'
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
    if (!(await exists(dir))) {
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

    const filePath = join(process.cwd(), `storage/${objectName}`)

    await this.checkDirExistAndCreate(filePath)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = this.getPresignedUrl(objectName)

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
    return apiConfig.serverUrl + '/storage/' + objectName
  }

  async deleteFiles(files: TFile[]) {
    await db.transaction(async tx => {
      await tx.delete(fileTable).where(
        inArray(
          fileTable.id,
          files.map(el => el.id)
        )
      )
      await Promise.all(files.map(el => unlink(join(process.cwd(), `storage/${el.path}`))))
    })
  }
}
