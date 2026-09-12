import { Controller, Get, Query } from '@nestjs/common'

import { StatDto } from '@ying/shared'

import { AdminScope } from '@/common/decorator'
import { UserStatService } from '@/business/modules/user'

@Controller('admin/user-stat')
@AdminScope()
export class UserStatController {
  constructor(readonly userStatService: UserStatService) {}

  @Get('growth-total')
  getUserGrowthTotal() {
    return this.userStatService.getUserGrowthTotal()
  }

  @Get('growth-trend-all')
  getUserGrowthTrendAll(@Query() dto: StatDto) {
    return this.userStatService.getUserGrowthTrendAll(dto)
  }

  @Get('growth-trend')
  getUserGrowthTrend(@Query() dto: StatDto) {
    return this.userStatService.getUserGrowthTrend(dto)
  }
}
