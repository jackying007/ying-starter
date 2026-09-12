import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '@ying/shared/entity'

import { UserService } from './user.service'
import { UserStatService } from './user.stat.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserStatService],
  exports: [UserService, UserStatService]
})
export class UserModule {}
