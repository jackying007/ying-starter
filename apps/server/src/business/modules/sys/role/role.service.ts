import { Like, TreeRepository } from 'typeorm'
import { createTreeFns } from '@ying/utils'
import type { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { SysPermissionEntity, SysRoleEntity } from '@ying/shared'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'
import { redis } from '@/common/modules/redis'
import { CacheKey } from '@/business/modules/sys/auth'

export class SysRoleService extends BaseService<SysRoleEntity> {
  private readonly sysPermissionRepository: TreeRepository<SysPermissionEntity>
  constructor() {
    super(dataSource.getRepository(SysRoleEntity))
    this.sysPermissionRepository = dataSource.getTreeRepository(SysPermissionEntity)
  }

  async list(dto: ListRoleDto) {
    const { where, take, skip } = this.buildListQuery(dto)
    const { name, status } = dto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })

    return this.repository.find({
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

    return this.repository.countBy(where)
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
    const role = this.repository.create(createRoleDto)
    role.permissions = createRoleDto.permissionCodes.map(code => {
      const permission = new SysPermissionEntity()
      permission.code = code
      return permission
    })
    return this.repository.save(role)
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const role = await this.repository.findOne({
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
        void redis.del(`${CacheKey.AdminAuthPermission}:${el.id}`)
      })
    }

    Object.assign(role, updateRoleDto)
    return this.repository.save(role)
  }
}
