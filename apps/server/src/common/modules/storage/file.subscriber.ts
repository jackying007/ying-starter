import { type EntitySubscriberInterface, DataSource, EventSubscriber, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import type { ConfigType } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { FileEntity } from '@ying/shared'
import { storageConfig } from '@/config'
import { FileServiceToken, ExpirSeconds } from './constant'
import { AbstractFileService } from './abstract.file.service'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(FileServiceToken)
    private readonly fileService: AbstractFileService
  ) {
    if (this.storageConf.mode == 'minio') {
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
