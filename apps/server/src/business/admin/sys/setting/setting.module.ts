import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysUserEntity } from '@ying/shared/entity'
import { SysSettingController } from './setting.controller'
import { SysSettingService } from './setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysUserEntity])],
  controllers: [SysSettingController],
  providers: [SysSettingService]
})
export class SysSettingModule {}
