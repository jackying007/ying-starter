import type { ListPushRecordDto } from '@ying/shared'
import { PushRecordEntity } from '@ying/shared'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'

export class PushRecordService extends BaseService<PushRecordEntity> {
  constructor() {
    super(dataSource.getRepository(PushRecordEntity))
  }

  detail(id: number) {
    return this.repository.findOne({
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
    return this.repository.find({
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
    return this.repository.countBy(where)
  }

  click(id: number) {
    return this.repository.update(id, { clicked: 1 })
  }
}
