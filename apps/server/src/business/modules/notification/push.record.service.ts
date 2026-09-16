import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import type { ListPushRecordDto } from '@ying/shared'
import { PushRecordEntity } from '@ying/shared'

import { BaseService } from '@/common/service/base.service'

@Injectable()
export class PushRecordService extends BaseService<PushRecordEntity> {
  constructor(
    @InjectRepository(PushRecordEntity)
    readonly pushRecordRepository: Repository<PushRecordEntity>
  ) {
    super(pushRecordRepository)
  }

  detail(id: number) {
    return this.pushRecordRepository.findOne({
      where: { id }
    })
  }

  buildListQuery(dto: ListPushRecordDto) {
    const listQuery = super.buildListQuery(dto)
    const { visitorId, pushTaskId, status } = dto

    Object.assign(listQuery.where, {
      visitorId: visitorId ? visitorId : undefined,
      pushTaskId,
      status
    })
    return listQuery
  }

  list(dto: ListPushRecordDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    return this.pushRecordRepository.find({
      where,
      relations: {
        pushTask: true
      },
      skip,
      take,
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListPushRecordDto) {
    const { where } = this.buildListQuery(dto)
    return this.pushRecordRepository.countBy(where)
  }

  click(id: string) {
    return this.pushRecordRepository.update(id, { clicked: 1 })
  }
}
