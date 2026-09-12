import { Inject, Injectable } from '@nestjs/common'
import { Like, Repository, TreeRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { createTreeFns } from '@ying/utils'
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { SysPermissionEntity, SysRoleEntity } from '@ying/shared'
import { RedisKey, type RedisObjs, RedisToken } from '@/common/modules/redis/constant'
import { BaseService } from '@/common/service/base.service'

@Injectable()
export class SysRoleService extends BaseService<SysRoleEntity> {
  constructor(
    @InjectRepository(SysRoleEntity)
    readonly sysRoleRepository: Repository<SysRoleEntity>,
    @InjectRepository(SysPermissionEntity)
    readonly sysPermissionRepository: TreeRepository<SysPermissionEntity>,
    @Inject(RedisToken)
    readonly redisObjs: RedisObjs
  ) {
    super(sysRoleRepository)
  }

  async list(dto: ListRoleDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    const { name, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })

    return this.sysRoleRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: ['permissions']
    })
  }

  listCount(dto: ListRoleDto) {
    const { where } = this.buildListQuery(dto)
    const { name, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })

    return this.sysRoleRepository.countBy(where)
  }

  async listPermissions() {
    const list = await this.sysPermissionRepository
      .createQueryBuilder('sysPermission')
      .addOrderBy('sysPermission.sortId is null', 'ASC')
      .addOrderBy('sysPermission.sortId', 'ASC')
      .getMany()

    return createTreeFns(list, 'code', 'parentCode').toTree(null)
  }

  create(createRoleDto: CreateRoleDto) {
    const role = this.sysRoleRepository.create(createRoleDto)
    role.permissions = createRoleDto.permissionCodes.map(code => {
      const permission = new SysPermissionEntity()
      permission.code = code
      return permission
    })
    return this.sysRoleRepository.save(role)
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const role = await this.sysRoleRepository.findOne({
      where: { id: updateRoleDto.id },
      relations: ['permissions', 'users']
    })
    if (!role) return

    if (role.permissions.map(el => el.code).toString() !== updateRoleDto.permissionCodes.toString()) {
      role.permissions = updateRoleDto.permissionCodes.map(code => {
        const permission = new SysPermissionEntity()
        permission.code = code
        return permission
      })

      role.users.forEach(el => {
        void this.redisObjs.redis.del(`${RedisKey.AdminAuthPermission}:${el.id}`)
      })
    }

    Object.assign(role, updateRoleDto)
    return this.sysRoleRepository.save(role)
  }
}
