import { Repository } from 'typeorm'
import { type StatDto, UserStatType } from '@ying/shared'
import { UserEntity } from '@ying/shared'
import { StatService } from '@/common/service/stat.service'
import { dataSource } from '@/common/modules/db'

export class UserStatService extends StatService {
  private readonly userRepository: Repository<UserEntity>
  constructor() {
    super()
    this.userRepository = dataSource.getRepository(UserEntity)
  }

  async getUserGrowthTotal() {
    return this.userRepository.count()
  }

  async getUserGrowthTrendByType(
    betweens: {
      start: Date
      end: Date
    }[],
    name?: UserStatType
  ) {
    const data = await Promise.all(
      betweens.map(between => {
        const builder = this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.oauthAccounts', 'oauthAccounts')

        builder.where('user.createAt BETWEEN :start AND :end', { start: between.start, end: between.end })

        if (name) {
          if (name === UserStatType.Register) {
            builder.andWhere('oauthAccounts.id IS NULL')
          } else {
            builder.andWhere('oauthAccounts.provider = :provider', { provider: name })
          }
        }

        return builder.getCount()
      })
    )

    return {
      name,
      data
    }
  }

  async getUserGrowthTrendAll(dto: StatDto) {
    const betweenList = this.buildBetweenList(dto)
    const betweens = betweenList.map(el => el.between)

    const data = await this.getUserGrowthTrendByType(betweens)

    return {
      categories: betweenList.map(el => el.splitName),
      list: data.data
    }
  }

  async getUserGrowthTrend(dto: StatDto) {
    const betweenList = this.buildBetweenList(dto)

    const betweens = betweenList.map(el => el.between)

    const types = await Promise.all([
      this.getUserGrowthTrendByType(betweens, UserStatType.Register),
      this.getUserGrowthTrendByType(betweens, UserStatType.Google),
      this.getUserGrowthTrendByType(betweens, UserStatType.Github)
    ])

    return {
      categories: betweenList.map(el => el.splitName),
      types
    }
  }
}
