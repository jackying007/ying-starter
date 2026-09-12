import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import type { ConfigType } from '@nestjs/config'
import { apiConfig, storageConfig } from '@/config'
import { FileEntity } from '@ying/shared'
import { FileServiceToken } from './constant'
import { AbstractFileService } from './abstract.file.service'
import { FileSubscriber } from './file.subscriber'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: FileServiceToken,
      useFactory(
        apiConf: ConfigType<typeof apiConfig>,
        storageConf: ConfigType<typeof storageConfig>,
        dataSource: DataSource
      ) {
        let fileService: AbstractFileService
        if (storageConf.mode === 'local') {
          fileService = new LocalFileService(dataSource, apiConf.serverUrl)
        } else {
          fileService = new MinioFileService(dataSource, storageConf)
        }
        return fileService
      },
      inject: [apiConfig.KEY, storageConfig.KEY, DataSource]
    },
    FileSubscriber
  ],
  exports: [FileServiceToken]
})
export class StorageModule {}
