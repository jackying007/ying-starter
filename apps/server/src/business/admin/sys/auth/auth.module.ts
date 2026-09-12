import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { SysPermissionEntity, SysRoleEntity, SysUserEntity } from '@ying/shared/entity'
import { SysAuthController } from './auth.controller'
import { SysAuthService } from './auth.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysPermissionEntity, SysRoleEntity, SysUserEntity]), JwtModule.register({})],
  controllers: [SysAuthController],
  providers: [SysAuthService],
  exports: [SysAuthService]
})
export class SysAuthModule {}
