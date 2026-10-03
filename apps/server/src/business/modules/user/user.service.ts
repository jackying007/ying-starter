import type { Column } from 'exceljs'
import dayjs from 'dayjs'
import { HTTPException } from 'hono/http-exception'
import { and, like, eq } from 'drizzle-orm'
import type { ListUserDto, UpdateUserInfoDto, ResetPasswordDto } from '@ying/shared'
import { userTable } from '@ying/db-drizzle/schema'
import { mapOptional } from '@ying/utils'
import { DrizzleService, type DrizzleServiceConfig } from '@/common/service/drizzle.service'
import { db } from '@/common/modules/db'
import { dataToXLSXDefaultSheetAndGetBuffer, generatePass } from '@/common/utils'

const columns: Partial<Column>[] = [
  { key: 'id', header: '用户ID', width: 10 },
  { key: 'name', header: '用户昵称', width: 30 },
  { key: 'email', header: '邮箱', width: 30 },
  { key: 'emailVerified', header: '邮箱是否验证', width: 20 },
  { key: 'oauthAccounts', header: '三方账号', width: 50 },
  { key: 'createAt', header: '创建时间', width: 30 }
]

const config: DrizzleServiceConfig = {
  table: userTable,
  pk: userTable.id
}
export class UserService extends DrizzleService<typeof config> {
  constructor() {
    super(config)
  }

  list(dto: ListUserDto) {
    const { limit, offset } = this.buildLimitAndOffset(dto)
    const { name, email, date } = dto

    return db.query.userTable.findMany({
      where: {
        name: name ? { like: `%${name}%` } : undefined,
        email: email ? { like: `%${email}%` } : undefined,
        createAt: this.buildQueryDateBetween(date)
      },
      limit,
      offset,
      with: {
        avatar: true,
        oauthAccounts: true
      },
      orderBy: {
        createAt: 'desc'
      }
    })
  }

  async listCount(dto: ListUserDto) {
    const { name, email, date } = dto
    return this.countBy(
      and(
        mapOptional(name, name => like(userTable.name, `%${name}%`)),
        mapOptional(email, email => like(userTable.email, `%${email}%`)),
        this.buildDateBetween(userTable.createAt, date)
      )
    )
  }

  findById(id: number) {
    return db.query.userTable.findFirst({
      where: { id },
      with: {
        avatar: true,
        oauthAccounts: true,
        visitors: true
      }
    })
  }

  updateUserInfo(userId: number, dto: UpdateUserInfoDto) {
    return db.update(userTable).set(dto).where(eq(userTable.id, userId))
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    const existingUser = await db.query.userTable.findFirst({ where: { id } })
    if (!existingUser) throw new HTTPException(500, { message: 'error.user_not_exists' })

    if (existingUser.password && (!dto.oldPassword || existingUser.password !== generatePass(dto.oldPassword))) {
      throw new HTTPException(500, { message: 'error.old_password_error' })
    }
    await db
      .update(userTable)
      .set({ password: generatePass(dto.newPassword) })
      .where(eq(userTable.id, id))
  }

  async export(dto: ListUserDto) {
    const list = await this.list(dto)
    if (!list) return

    const excelBuffer = await dataToXLSXDefaultSheetAndGetBuffer(
      columns,
      list.map(el => ({
        ...el,
        emailVerified: el.emailVerified ? '是' : '否',
        oauthAccounts: el.oauthAccounts?.map(el => `${el.provider}:${el.name},${el.providerAccountId}`).join(';'),
        createAt: dayjs(el.createAt).format('YYYY-MM-DD/HH:mm:ss')
      }))
    )

    return {
      fileName: `用户信息_${dayjs().format('YYYY年MM月DD日HH时mm分ss秒')}`,
      excelBuffer
    }
  }
}
