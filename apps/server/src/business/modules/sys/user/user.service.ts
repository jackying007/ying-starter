import { faker } from '@faker-js/faker'
import { and, desc, eq, inArray, like, sql } from 'drizzle-orm'
import { FileSourceType, FileType } from '@ying/shared'
import type { ListSysUserDto, CreateOrUpdateSysUserDto, UpdateSysUserPasswordDto } from '@ying/shared'
import { mapOptional } from '@ying/utils'
import { sysRoleTable, sysRoleToSysUserTable, sysUserTable, fileTable } from '@ying/db-drizzle/schema'
import { generatePass } from '@/common/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db, mergeSqlResults } from '@/common/modules/db'
import { redis } from '@/common/modules/redis'
import { CacheKey } from '@/business/modules/sys/auth'

const config: DrizzleServiceConfig = {
  table: sysUserTable,
  pk: sysUserTable.id
}
export class SysUserService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  buildWhere(dto: ListSysUserDto) {
    const { name, account, status, roleIds, date } = dto
    return and(
      mapOptional(name, _ => like(sysUserTable.name, `%${_}%`)),
      mapOptional(account, _ => like(sysUserTable.account, `%${_}%`)),
      mapOptional(status, _ => eq(sysUserTable.status, _)),
      mapOptional(roleIds, _ => {
        // 用户必须拥有 roleIds 中的全部角色
        const roleUserIds = db
          .select({
            userId: sysRoleToSysUserTable.sysUserId
          })
          .from(sysRoleToSysUserTable)
          .where(inArray(sysRoleToSysUserTable.sysRoleId, _))
          .groupBy(sysRoleToSysUserTable.sysUserId)
          .having(sql`count(distinct ${sysRoleToSysUserTable.sysRoleId}) = ${_.length}`)
        return inArray(sysUserTable.id, roleUserIds)
      }),
      this.buildDateBetween(sysUserTable.createAt, date)
    )
  }

  async list(dto: ListSysUserDto) {
    const list = await db
      .select({
        user: sysUserTable,
        role: sysRoleTable,
        avatar: fileTable
      })
      .from(sysUserTable)
      .leftJoin(sysRoleToSysUserTable, eq(sysUserTable.id, sysRoleToSysUserTable.sysUserId))
      .leftJoin(sysRoleTable, eq(sysRoleToSysUserTable.sysRoleId, sysRoleTable.id))
      .leftJoin(fileTable, eq(sysUserTable.avatarId, fileTable.id))
      .where(this.buildWhere(dto))
      .orderBy(desc(sysUserTable.createAt))
    return mergeSqlResults(list, 'user', 'id', ['role'], ['avatar'])
  }

  async listCount(dto: ListSysUserDto) {
    return this.countBy(this.buildWhere(dto))
  }

  async create(dto: CreateOrUpdateSysUserDto) {
    await db.transaction(async tx => {
      const [newSysUser] = await tx
        .insert(sysUserTable)
        .values({
          ...dto,
          password: generatePass(dto.password!)
        })
        .returning()

      const url = faker.image.avatar()
      const newAvatar = (
        await tx
          .insert(fileTable)
          .values({
            type: FileType.Image,
            from: FileSourceType.Admin,
            isExternal: true,
            userId: newSysUser.id,
            path: url,
            url
          })
          .returning()
      )[0]
      await tx
        .update(sysUserTable)
        .set({
          avatarId: newAvatar.id
        })
        .where(eq(sysUserTable.id, newSysUser.id))
        .returning()

      if (dto.roleIds.length) {
        await tx.insert(sysRoleToSysUserTable).values(
          dto.roleIds.map(sysRoleId => ({
            sysRoleId,
            sysUserId: newSysUser.id
          }))
        )
      }
    })
  }

  async update(dto: CreateOrUpdateSysUserDto) {
    const sysUser = await db.query.sysUserTable.findFirst({ where: { id: dto.id }, with: { roles: true } })
    if (!sysUser) throw Error('sysUser is not exist.')

    await db.transaction(async tx => {
      await tx.update(sysUserTable).set(dto).where(eq(sysUserTable.id, sysUser.id))
      const newRoleIds = dto.roleIds
      if (newRoleIds?.length) {
        const oldRoleIds = sysUser.roles.map(el => el.id)
        const waitDeleteIds = oldRoleIds.filter(o => !newRoleIds.includes(o))
        const waitCreateIds = newRoleIds.filter(n => !oldRoleIds.includes(n))
        if (waitDeleteIds.length)
          await tx
            .delete(sysRoleToSysUserTable)
            .where(
              and(
                eq(sysRoleToSysUserTable.sysUserId, sysUser.id),
                inArray(sysRoleToSysUserTable.sysRoleId, waitDeleteIds)
              )
            )
        if (waitCreateIds.length)
          await tx.insert(sysRoleToSysUserTable).values(
            waitCreateIds.map(sysRoleId => ({
              sysRoleId,
              sysUserId: sysUser.id
            }))
          )
        await redis.del(`${CacheKey.AdminAuthPermission}:${sysUser.id}`)
      }
    })
  }

  async createOrUpdate(dto: CreateOrUpdateSysUserDto) {
    if (dto.id) {
      await this.update(dto)
    } else {
      await this.create(dto)
    }
  }

  async updatePassword(dto: UpdateSysUserPasswordDto) {
    await db
      .update(sysUserTable)
      .set({ password: generatePass(dto.password) })
      .where(eq(sysUserTable.id, dto.id))
  }
}
