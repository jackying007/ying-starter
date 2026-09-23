import { Like } from 'typeorm'
import type { Column } from 'exceljs'
import dayjs from 'dayjs'
import { HTTPException } from 'hono/http-exception'
import type { ListUserDto, ResetPasswordDto } from '@ying/shared'
import { UserEntity } from '@ying/db-typeorm'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'
import { dataToXLSXDefaultSheetAndGetBuffer, generatePass } from '@/common/utils'

const columns: Partial<Column>[] = [
  { key: 'id', header: '用户ID', width: 10 },
  { key: 'name', header: '用户昵称', width: 30 },
  { key: 'email', header: '邮箱', width: 30 },
  { key: 'emailVerified', header: '邮箱是否验证', width: 20 },
  { key: 'oauthAccounts', header: '三方账号', width: 50 },
  { key: 'createAt', header: '创建时间', width: 30 }
]

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(dataSource.getRepository(UserEntity))
  }

  list(listUserDto: ListUserDto) {
    const { take, skip, where } = this.buildListQuery(listUserDto)
    const { name, email } = listUserDto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.repository.find({
      where,
      skip,
      take,
      relations: {
        avatar: true,
        oauthAccounts: true
      },
      order: {
        createAt: 'DESC'
      }
    })
  }

  listCount(listUserDto: ListUserDto) {
    const { where } = this.buildListQuery(listUserDto)
    const { name, email } = listUserDto

    Object.assign(where, {
      name: name ? Like(`%${name}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined
    })

    return this.repository.countBy(where)
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        avatar: true,
        oauthAccounts: true,
        visitors: true
      }
    })
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    const existingUser = await this.repository.findOne({
      where: { id }
    })

    if (!existingUser) throw new HTTPException(500, { message: 'error.user_not_exists' })

    if (existingUser.password && (!dto.oldPassword || existingUser.password !== generatePass(dto.oldPassword))) {
      throw new HTTPException(500, { message: 'error.old_password_error' })
    }

    existingUser.password = generatePass(dto.newPassword)

    await this.repository.save(existingUser)
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
