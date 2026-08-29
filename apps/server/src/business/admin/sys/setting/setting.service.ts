import { Inject, Injectable } from '@nestjs/common'
// import { InjectDataSource } from '@nestjs/typeorm'
// import { DataSource } from 'typeorm'
import { RedisToken, RedisKey, type RedisObjs } from '@/common/modules/redis/constant'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'

@Injectable()
export class SysSettingService {
  // @InjectDataSource()
  // private dataSource: DataSource

  @Inject(RedisToken)
  private readonly redisObjs: RedisObjs

  @Inject(FileServiceToken)
  private readonly fileService: AbstractFileService

  async clearPermissionCache() {
    const arr = await this.redisObjs.redis.keys(RedisKey.AdminAuthPermission + '*')
    arr.forEach(key => {
      void this.redisObjs.redis.del(key)
    })
  }

  clearDriftFile() {
    return this.fileService.clearDriftFile()
  }
}
