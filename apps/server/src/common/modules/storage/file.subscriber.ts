import type { EntitySubscriberInterface, Repository } from 'typeorm'
import { EventSubscriber } from 'typeorm'
import { FileEntity } from '@ying/shared'
import { storageConfig } from '@/config'
import { dataSource } from '@/common/modules/db'
import { ExpirSeconds } from './constant'
import { AbstractFileService } from './abstract.file.service'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<FileEntity> {
  private readonly fileRepository: Repository<FileEntity>

  constructor(private readonly fileService: AbstractFileService) {
    this.fileRepository = dataSource.getRepository(FileEntity)
    if (storageConfig.mode === 'minio') {
      dataSource.subscribers.push(this)
    }
  }

  listenTo() {
    return FileEntity
  }

  async afterLoad(entity: FileEntity) {
    try {
      if (entity.isExternal) return
      if (Date.now() - new Date(entity.updateAt).getTime() > ExpirSeconds * 1000) {
        const newUrl = await this.fileService.getPresignedUrl(entity.path)
        entity.url = newUrl
        await this.fileRepository.update({ id: entity.id }, { url: newUrl })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
