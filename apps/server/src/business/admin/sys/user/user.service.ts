import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { faker } from '@faker-js/faker'
import { FileSourceType, FileType } from '@ying/shared'
import {
  CreateSysUserDto,
  ListSysUserDto,
  UpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfPasswordDto,
  UpdateSysUserSelfUserInfoDto
} from '@ying/shared'
import { SysRoleEntity, SysUserEntity } from '@ying/shared'
import { comparePass, generatePass } from '@/common/utils'
import { RedisKey, type RedisObjs, RedisToken } from '@/common/modules/redis/constant'
import { BaseService } from '@/common/service/base.service'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'

@Injectable()
export class SysUserService extends BaseService<SysUserEntity> {
  constructor(
    @InjectRepository(SysUserEntity)
    readonly sysUserRepository: Repository<SysUserEntity>,
    @Inject(RedisToken)
    readonly redisObjs: RedisObjs,
    @Inject(FileServiceToken)
    readonly fileService: AbstractFileService
  ) {
    super(sysUserRepository)
  }

  buildQb(dto: ListSysUserDto) {
    const { name, account, status, roleIds, date } = dto
    const qb = this.sysUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.avatar', 'avatar')

    if (name) {
      qb.andWhere('user.name LIKE :name', { name: `%${name}%` })
    }
    if (account) {
      qb.andWhere('user.account LIKE :account', { account: `%${account}%` })
    }
    if (status !== undefined) {
      qb.andWhere('user.status = :status', { status })
    }
    if (roleIds && roleIds.length > 0) {
      qb.andWhere(
        qb => {
          const subQuery = qb
            .subQuery()
            .select('subUser.id')
            .from(SysUserEntity, 'subUser')
            .innerJoin('subUser.roles', 'subRole')
            .where('subRole.id IN (:...roleIds)')
            .groupBy('subUser.id')
            .having('COUNT(DISTINCT subRole.id) = :roleCount')
            .getQuery()
          return 'user.id IN ' + subQuery
        },
        { roleIds, roleCount: roleIds.length }
      )
    }
    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      qb.andWhere('user.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
    }
    return qb
  }

  async list(dto: ListSysUserDto) {
    const qb = this.buildQb(dto)
    qb.orderBy('user.createAt', 'DESC')
    this.qbPostProcess(qb, dto)
    return qb.getMany()
  }

  listCount(dto: ListSysUserDto) {
    const qb = this.buildQb(dto)
    return qb.getCount()
  }

  async create(dto: CreateSysUserDto) {
    const sysUser = this.sysUserRepository.create(dto)
    sysUser.password = generatePass(dto.password)
    sysUser.roles = dto.roleIds.map(id => {
      const entity = new SysRoleEntity()
      entity.id = id
      return entity
    })

    const newSysUser = await this.sysUserRepository.save(sysUser)

    const newFile = await this.fileService.addFile({
      url: faker.image.avatar(),
      fileType: FileType.Image,
      from: FileSourceType.Admin,
      userId: newSysUser.id
    })

    void this.sysUserRepository.update(
      {
        id: newSysUser.id
      },
      {
        avatar: newFile
      }
    )
    return newSysUser
  }

  async update(dto: UpdateSysUserDto) {
    const sysUser = this.sysUserRepository.create(dto)
    sysUser.roles = dto.roleIds.map(id => {
      const entity = new SysRoleEntity()
      entity.id = id
      return entity
    })
    await this.redisObjs.redis.del(`${RedisKey.AdminAuthPermission}:${sysUser.id}`)
    return this.sysUserRepository.save(sysUser)
  }

  updatePassword(dto: UpdateSysUserPasswordDto) {
    const sysUser = this.sysUserRepository.create(dto)
    sysUser.password = generatePass(dto.password)
    return this.sysUserRepository.save(sysUser)
  }

  async updateSelfInfo(dto: UpdateSysUserSelfUserInfoDto, id: number) {
    return this.sysUserRepository.update({ id }, dto)
  }

  async updateSelfPassword(dto: UpdateSysUserSelfPasswordDto, id: number) {
    const user = await this.sysUserRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new InternalServerErrorException('User does not exist!')
    }
    if (!comparePass(dto.oldPass, user.password)) {
      throw new InternalServerErrorException('The password is incorrect!')
    }

    const sysUser = this.sysUserRepository.create({ id })
    sysUser.password = generatePass(dto.newPass)

    return this.sysUserRepository.save(sysUser)
  }
}
