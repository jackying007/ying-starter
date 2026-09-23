import { Like } from 'typeorm'
import type { ListFeedbackDto } from '@ying/shared'
import { FeedbackEntity } from '@ying/db-typeorm'
import { dataSource } from '@/common/modules/db'
import { BaseService } from '@/common/service/base.service'

export class FeedbackService extends BaseService<FeedbackEntity> {
  constructor() {
    super(dataSource.getRepository(FeedbackEntity))
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
    return this.repository.find({
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
    return this.repository.countBy(where)
  }
}
