import { Controller, Get } from '@nestjs/common'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { SysSettingService } from './setting.service'

@PermissionDecorator(pms.sys.setting)
@AdminScope()
@Controller('admin/sys/setting')
export class SysSettingController {
  constructor(private readonly sysSettingService: SysSettingService) {}

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
}
