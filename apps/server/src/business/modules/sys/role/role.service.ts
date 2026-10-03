import { and, asc, eq, inArray, like } from 'drizzle-orm'
import { arrayToTree } from '@ying/utils'
import type { CreateOrUpdateRoleDto, ListRoleDto } from '@ying/shared'
import { sysPermissionTable, sysRoleTable, sysRoleToSysPermissionTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'
import { redis } from '@/common/modules/redis'
import { CacheKey } from '@/business/modules/sys/auth'

const config: DrizzleServiceConfig = {
  table: sysRoleTable,
  pk: sysRoleTable.id
}
export class SysRoleService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  async list(dto: ListRoleDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { name, status, date } = dto
    return db.query.sysRoleTable.findMany({
      where: {
        name: name ? { like: `%${name}%` } : undefined,
        status,
        createAt: this.buildQueryDateBetween(date)
      },
      with: {
        permissions: true
      },
      limit,
      offset,
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  listCount(dto: ListRoleDto) {
    const { name, status, date } = dto
    return this.countBy(
      and(
        mapOptional(name, _ => like(sysRoleTable.name, `%${_}%`)),
        mapOptional(status, _ => eq(sysRoleTable.status, _)),
        this.buildDateBetween(sysRoleTable.createAt, date)
      )
    )
  }

  async listPermissions() {
    const list = await db.select().from(sysPermissionTable).orderBy(asc(sysPermissionTable.sort))
    return arrayToTree(list, 'code', 'parentCode')
  }

  async create(dto: CreateOrUpdateRoleDto) {
    await db.transaction(async tx => {
      const [sysRole] = await tx.insert(sysRoleTable).values(dto).returning()
      if (dto.permissionCodes.length) {
        await tx.insert(sysRoleToSysPermissionTable).values(
          dto.permissionCodes.map(code => ({
            sysPermissionCode: code,
            sysRoleId: sysRole.id
          }))
        )
      }
    })
  }

  async update(dto: CreateOrUpdateRoleDto) {
    const sysRole = await db.query.sysRoleTable.findFirst({
      where: { id: dto.id },
      with: {
        permissions: true,
        users: true
      }
    })
    if (!sysRole) throw Error('sysRole is not exist.')

    await db.transaction(async tx => {
      await tx.update(sysRoleTable).set(dto).where(eq(sysRoleTable.id, sysRole.id))
      const newPermissionCodes = dto.permissionCodes
      if (newPermissionCodes?.length) {
        const oldPermissionCodes = sysRole.permissions.map(el => el.code)
        const waitDeleteCodes = oldPermissionCodes.filter(o => !newPermissionCodes.includes(o))
        const waitCreateCodes = newPermissionCodes.filter(n => !oldPermissionCodes.includes(n))
        if (waitDeleteCodes.length)
          await tx
            .delete(sysRoleToSysPermissionTable)
            .where(
              and(
                eq(sysRoleToSysPermissionTable.sysRoleId, sysRole.id),
                inArray(sysRoleToSysPermissionTable.sysPermissionCode, waitDeleteCodes)
              )
            )
        if (waitCreateCodes.length)
          await tx.insert(sysRoleToSysPermissionTable).values(
            waitCreateCodes.map(sysPermissionCode => ({
              sysRoleId: sysRole.id,
              sysPermissionCode
            }))
          )
        sysRole.users.forEach(el => {
          void redis.del(`${CacheKey.AdminAuthPermission}:${el.id}`)
        })
      }
    })
  }

  async createOrUpdate(dto: CreateOrUpdateRoleDto) {
    if (dto.id) {
      await this.update(dto)
    } else {
      await this.create(dto)
    }
  }
}
