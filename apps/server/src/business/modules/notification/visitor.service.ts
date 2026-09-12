import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { CreateVisitorDto, ListVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import { VisitorEntity, UserEntity } from '@ying/shared'

import { BaseService } from '@/common/service/base.service'

@Injectable()
export class VisitorService extends BaseService<VisitorEntity> {
  constructor(
    @InjectRepository(VisitorEntity)
    readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>
  ) {
    super(visitorRepository)
  }

  async createVisitor(dto: CreateVisitorDto) {
    const existVisitor = await this.visitorRepository.findOne({
      where: {
        visitorId: dto.visitorId
      }
    })
    if (existVisitor) return
    await this.visitorRepository.save(this.visitorRepository.create(dto))
    return
  }

  subscribe(dto: NoticeSubscribeDto) {
    return this.visitorRepository.update({ visitorId: dto.visitorId }, { pushSubscription: dto.pushSubscription })
  }

  async bindUser(visitorId: string, userId: number) {
    const existVisitor = await this.visitorRepository.findOne({
      where: { visitorId },
      relations: {
        users: true
      }
    })
    const existUser = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!existVisitor || !existUser) return

    if (existVisitor.users) {
      existVisitor.users.push(existUser)
    } else {
      existVisitor.users = [existUser]
    }
    return this.visitorRepository.save(existVisitor)
  }

  buildListQuery(dto: ListVisitorDto) {
    const listQuery = super.buildListQuery(dto)
    const { language, deviceType } = dto
    Object.assign(listQuery.where, {
      languages: language ? Like(`%${language}%`) : undefined,
      deviceType: deviceType ? Like(`%${deviceType}%`) : undefined
    })
    return listQuery
  }

  list(dto: ListVisitorDto) {
    const { where, take, skip } = this.buildListQuery(dto)

    return this.visitorRepository.find({
      where,
      relations: {
        users: true
      },
      skip,
      take,
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(dto: ListVisitorDto) {
    const { where } = this.buildListQuery(dto)

    return this.visitorRepository.countBy(where)
  }
}
