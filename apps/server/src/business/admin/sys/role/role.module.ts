import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysPermissionEntity, SysRoleEntity, SysUserEntity } from '@ying/shared'
import { SysRoleService } from './role.service'
import { SysRoleController } from './role.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SysPermissionEntity, SysRoleEntity, SysUserEntity])],
  controllers: [SysRoleController],
  providers: [SysRoleService]
})
export class SysRoleModule {}
