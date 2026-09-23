import { storageConfig } from '@/config'

import type { AbstractFileService } from './abstract.file.service'
import { LocalFileService } from './local.file.service'
import { MinioFileService } from './minio.file.service'
import { FileSubscriber } from './file.subscriber'

export * from './constant'
export * from './file.middleware'

export const fileService: AbstractFileService =
  storageConfig.mode === 'local' ? new LocalFileService() : new MinioFileService()

export const fileSubscriber = new FileSubscriber(fileService)
