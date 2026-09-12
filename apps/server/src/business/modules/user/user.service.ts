import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import type { Column } from 'exceljs'
import dayjs from 'dayjs'

import { UserEntity } from '@ying/shared/entity'
import { ListUserDto, ResetPasswordDto, UpdateUserInfoDto } from '@ying/shared/dto'

import { BaseService } from '@/common/service/base.service'
import { dataToXLSXDefaultSheetAndGetBuffer, generatePass } from '@/common/utils'

const columns: Partial<Column>[] = [
  { key: 'id', header: '用户ID', width: 10 },
  { key: 'name', header: '用户昵称', width: 30 },
  { key: 'email', header: '邮箱', width: 30 },
  { key: 'emailVerified', header: '邮箱是否验证', width: 20 },
  { key: 'oauthAccounts', header: '三方账号', width: 50 },
  { key: 'createAt', header: '创建时间', width: 30 }
]

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository)
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
    return this.userRepository.findOne({
      where: { id },
      relations: {
        avatar: true,
        oauthAccounts: true,
        visitors: true
      }
    })
  }

  updateInfo(dto: UpdateUserInfoDto, id: number) {
    return this.userRepository.update({ id }, dto)
  }

  async resetPassword(dto: ResetPasswordDto, id: number) {
    const existingUser = await this.userRepository.findOne({
      where: { id }
    })

    if (!existingUser) throw new InternalServerErrorException('error.user_not_exists')

    if (existingUser.password && existingUser.password !== generatePass(dto.oldPassword)) {
      throw new InternalServerErrorException('error.old_password_error')
    }

    existingUser.password = generatePass(dto.newPassword)

    await this.userRepository.save(existingUser)
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
