import { EventEmitter } from '@ying/utils'

export type Events = {
  API_ERROR_MSG: string
}

export const globalEvent = new EventEmitter<Events>()
