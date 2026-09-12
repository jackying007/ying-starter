import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { CreatePushTemplateDto, ListPushTemplateDto } from '@ying/shared'
import { PushTemplateEntity } from '@ying/shared'

import { BaseService } from '@/common/service/base.service'

@Injectable()
export class PushTemplateService extends BaseService<PushTemplateEntity> {
  constructor(
    @InjectRepository(PushTemplateEntity)
    readonly pushTemplateRepository: Repository<PushTemplateEntity>
  ) {
    super(pushTemplateRepository)
  }

  async create(dto: CreatePushTemplateDto) {
    return this.pushTemplateRepository.save(this.pushTemplateRepository.create(dto))
  }

  detail(id: number) {
    return this.pushTemplateRepository.findOne({
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
    return this.pushTemplateRepository.find({
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
    return this.pushTemplateRepository.countBy(where)
  }
}
