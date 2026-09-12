import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { ListFeedbackDto } from '@ying/shared'
import { FeedbackEntity } from '@ying/shared'

import { BaseService } from '@/common/service/base.service'

@Injectable()
export class FeedbackService extends BaseService<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    readonly feedbackRepository: Repository<FeedbackEntity>
  ) {
    super(feedbackRepository)
  }

  buildListQuery(dto: ListFeedbackDto) {
    const listQuery = super.buildListQuery(dto)
    const { email } = dto
    Object.assign(listQuery.where, {
      email: email ? Like(`%${email}%`) : undefined
    })
    return listQuery
  }

  list(dto: ListFeedbackDto) {
    const { where, skip, take } = this.buildListQuery(dto)
    return this.feedbackRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListFeedbackDto) {
    const { where } = this.buildListQuery(dto)
    return this.feedbackRepository.countBy(where)
  }
}
