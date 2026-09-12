import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { FileEntity, UserEntity, OAuthAccountEntity } from '@ying/shared'
import { UserModule } from '@/business/modules/user'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OAuthService } from './oauth.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OAuthAccountEntity, FileEntity]), UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, OAuthService],
  exports: [AuthService]
})
export class AuthModule {}
