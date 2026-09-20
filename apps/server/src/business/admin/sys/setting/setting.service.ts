import { Inject, Injectable } from '@nestjs/common'
// import { InjectDataSource } from '@nestjs/typeorm'
// import { DataSource } from 'typeorm'
import { Redis } from 'ioredis'
import { RedisToken, RedisKey } from '@/common/modules/redis/constant'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'

@Injectable()
export class SysSettingService {
  // @InjectDataSource()
  // private dataSource: DataSource

  @Inject(RedisToken)
  private readonly redis: Redis

  @Inject(FileServiceToken)
  private readonly fileService: AbstractFileService

  async clearPermissionCache() {
    const arr = await this.redis.keys(RedisKey.AdminAuthPermission + '*')
    arr.forEach(key => {
      void this.redis.del(key)
    })
  }

  clearDriftFile() {
    return this.fileService.clearDriftFile()
  }
}
