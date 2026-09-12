import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Between } from 'typeorm'

import { StatDto } from '@ying/shared'

@Injectable()
export class StatService {
  buildBetweenList(dto: StatDto) {
    const { date, type } = dto

    let splitMilliseconds = 0
    let splitNum = 0
    let startDateNum = 0
    let endDateNum = 0

    if (type === 'day') {
      splitMilliseconds = 1000 * 60 * 60 * 24
    } else if (type === 'hour') {
      splitMilliseconds = 1000 * 60 * 60
    } else {
      throw new InternalServerErrorException('invalid type!')
    }

    startDateNum = Date.parse(date[0])
    endDateNum = Date.parse(date[1])

    splitNum = Math.round((endDateNum - startDateNum) / splitMilliseconds)

    const betweenList = Array.from({ length: splitNum }).map((_, index) => {
      const start = new Date(startDateNum + splitMilliseconds * index)
      const end = new Date(startDateNum + splitMilliseconds * (index + 1))

      let splitName = ''
      if (type === 'day') {
        splitName = start.getMonth() + 1 + '-' + start.getDate()
      } else if (type === 'hour') {
        splitName = start.getHours() + ''
      }

      return {
        splitName,
        between: Between(start, end)
      }
    })

    return betweenList
  }
}
