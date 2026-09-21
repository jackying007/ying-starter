import { Like } from 'typeorm'
import type { ListPushTemplateDto, CreateOrUpdatePushTemplateDto } from '@ying/shared'
import { PushTemplateEntity } from '@ying/shared'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'

export class PushTemplateService extends BaseService<PushTemplateEntity> {
  constructor() {
    super(dataSource.getRepository(PushTemplateEntity))
  }

  async createOrUpdate(dto: CreateOrUpdatePushTemplateDto) {
    if (dto.id) {
      return this.updateById(dto.id, dto)
    } else {
      return this.create(dto)
    }
  }

  detail(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        image: true
      }
    })
  }

  buildListQuery(dto: ListPushTemplateDto) {
    const listQuery = super.buildListQuery(dto)
    const { name, title } = dto
    Object.assign(listQuery.where, {
      name: name ? Like(`%${name}%`) : undefined,
      title: title ? Like(`%${title}%`) : undefined
    })
    return listQuery
  }

  list(dto: ListPushTemplateDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    return this.repository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: {
        image: true
      }
    })
  }

  listCount(dto: ListPushTemplateDto) {
    const { where } = this.buildListQuery(dto)
    return this.repository.countBy(where)
  }
}
