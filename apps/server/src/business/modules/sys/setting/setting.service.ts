import { redis } from '@/common/modules/redis'
import { fileService } from '@/business/modules/storage'
import { CacheKey } from '@/business/modules/sys/auth'

export class SysSettingService {
  async clearPermissionCache() {
    const arr = await redis.keys(CacheKey.AdminAuthPermission + '*')
    arr.forEach(key => {
      void redis.del(key)
    })
  }

  clearDriftFile() {
    return fileService.clearDriftFile()
  }
}
