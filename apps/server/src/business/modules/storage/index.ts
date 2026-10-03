import { storageConfig } from '@/config'

import type { AbstractFileService } from './abstract.file.service'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'

export * from './file.middleware'

export const fileService: AbstractFileService =
  storageConfig.mode === 'local' ? new LocalFileService() : new MinioFileService()
