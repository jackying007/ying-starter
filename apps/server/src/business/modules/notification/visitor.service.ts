import { Like, Repository } from 'typeorm'
import type { CreateVisitorDto, ListVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import { VisitorEntity, UserEntity } from '@ying/db-typeorm'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'

export class VisitorService extends BaseService<VisitorEntity> {
  private readonly userRepository: Repository<UserEntity>
  constructor() {
    super(dataSource.getRepository(VisitorEntity))
    this.userRepository = dataSource.getRepository(UserEntity)
  }

  async createVisitor(dto: CreateVisitorDto) {
    const existVisitor = await this.repository.findOne({
      where: {
        visitorId: dto.visitorId
      }
    })
    if (existVisitor) return
    await this.repository.save(this.repository.create(dto))
    return
  }

  subscribe(dto: NoticeSubscribeDto) {
    return this.repository.update({ visitorId: dto.visitorId }, { pushSubscription: dto.pushSubscription })
  }

  async bindUser(visitorId: string, userId: number) {
    const existVisitor = await this.repository.findOne({
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
    return this.repository.save(existVisitor)
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

    return this.repository.find({
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

    return this.repository.countBy(where)
  }
}
