import { Inject, Injectable } from '@nestjs/common'
// import { ConfigType } from '@nestjs/config'

import { ConfigDto } from '@ying/shared'
import type { ConfigVo } from '@ying/shared'

import { RedisKey, type RedisObjs, RedisToken } from '@/common/modules/redis/constant'
// import { apiConfig } from '@/config'

const DefaultCustomerConfig = {
  debugUserIds: ''
}

@Injectable()
export class ConfigService {
  @Inject(RedisToken)
  private readonly redisObjs: RedisObjs
  // @Inject(apiConfig.KEY)
  // private readonly apiConf: ConfigType<typeof apiConfig>

  async getConfig() {
    let configStr = await this.redisObjs.redis.get(RedisKey.Config)
    if (!configStr) {
      configStr = JSON.stringify(DefaultCustomerConfig)
      await this.redisObjs.redis.set(RedisKey.Config, configStr)
    }
    return {
      ...JSON.parse(configStr)
    } as ConfigVo
  }

  async setConfig(dto: ConfigDto) {
    const config = JSON.parse((await this.redisObjs.redis.get(RedisKey.Config)) ?? '{}') as object
    await this.redisObjs.redis.set(RedisKey.Config, JSON.stringify(Object.assign(config, dto)))
  }
}
