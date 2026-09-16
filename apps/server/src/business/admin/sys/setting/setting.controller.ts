import { Body, Controller, Get, Post } from '@nestjs/common'
import { configDto, type ConfigDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { ConfigService } from '@/common/modules/config/config.service'
import { SysSettingService } from './setting.service'

@PermissionDecorator(pms.sys.setting)
@AdminScope()
@Controller('admin/sys/setting')
export class SysSettingController {
  constructor(
    private readonly sysSettingService: SysSettingService,
    private readonly configService: ConfigService
  ) {}

  @PermissionDecorator(pms.sys.setting.clearPermissionCache)
  @Get('clear-permission-cache')
  clearPermissionCache() {
    return this.sysSettingService.clearPermissionCache()
  }

  @PermissionDecorator(pms.sys.setting.clearDriftFile)
  @Get('clear-drift-file')
  clearDriftFile() {
    return this.sysSettingService.clearDriftFile()
  }

  @PermissionDecorator(pms.sys.setting.updateSetting)
  @Post()
  updateSetting(@Body({ schema: configDto }) dto: ConfigDto) {
    return this.configService.setConfig(dto)
  }
}
