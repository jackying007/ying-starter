import type { ListPushTemplateDto } from '@ying/shared'
import { PushTemplateEntity } from '@ying/db-typeorm'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'

export class PushTemplateService extends BaseService<PushTemplateEntity> {
  constructor() {
    super(dataSource.getRepository(PushTemplateEntity))
  }

  buildQb(dto: ListPushTemplateDto) {
    const { name, title, date } = dto
    const qb = this.repository.createQueryBuilder('pushTemplate').leftJoinAndSelect('pushTemplate.image', 'image')

    if (name) {
      qb.andWhere('pushTemplate.name LIKE :name', { name: `%${name}%` })
    }
    if (title) {
      qb.andWhere('"pushTemplate"."title"::text LIKE :title', { title: `%${title}%` })
    }
    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      qb.andWhere('pushTemplate.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
    }
    return qb
  }

  async list(dto: ListPushTemplateDto) {
    const qb = this.buildQb(dto)
    qb.orderBy('pushTemplate.createAt', 'DESC')
    this.qbPostProcess(qb, dto)
    return qb.getMany()
  }

  listCount(dto: ListPushTemplateDto) {
    const qb = this.buildQb(dto)
    return qb.getCount()
  }

  detail(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        image: true
      }
    })
  }
}
