import type { ConfigDto } from './config.dto'

export type ConfigVo = ConfigDto & {
  clientUrl: string
}
