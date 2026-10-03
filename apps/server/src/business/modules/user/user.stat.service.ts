import { and, between, count, eq, isNull } from 'drizzle-orm'
import { type StatDto, UserStatType } from '@ying/shared'
import { userTable, oauthAccountTable } from '@ying/db-drizzle/schema'
import { StatService } from '@/common/service/stat.service'
import { db } from '@/common/modules/db'

export class UserStatService extends StatService {
  async getUserGrowthTrendByType(
    betweens: {
      start: Date
      end: Date
    }[],
    name?: UserStatType
  ) {
    const data = await Promise.all(
      betweens.map(async bt => {
        const conditions = [between(userTable.createAt, bt.start, bt.end)]
        if (name) {
          if (name === UserStatType.Register) {
            conditions.push(isNull(oauthAccountTable.id))
          } else {
            conditions.push(eq(oauthAccountTable.provider, name))
          }
        }

        const [result] = await db
          .select({
            count: count()
          })
          .from(userTable)
          .leftJoin(oauthAccountTable, eq(oauthAccountTable.userId, userTable.id))
          .where(and(...conditions))
        return result.count
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
