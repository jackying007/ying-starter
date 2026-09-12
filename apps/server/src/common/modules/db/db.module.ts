import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { ConfigType } from '@nestjs/config'
import {
  FileEntity,
  SysPermissionEntity,
  SysRoleEntity,
  SysUserEntity,
  UserEntity,
  OAuthAccountEntity,
  FeedbackEntity,
  VisitorEntity,
  PushTemplateEntity,
  PushTaskEntity,
  PushRecordEntity,
  ArticleEntity
} from '@ying/shared'
import { dbConfig } from '@/config'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (dbConf: ConfigType<typeof dbConfig>) => {
        return {
          type: 'postgres',
          host: dbConf.host,
          port: dbConf.port,
          username: dbConf.username,
          password: dbConf.password,
          database: dbConf.database,
          synchronize: dbConf.synchronize,
          logging: dbConf.logging,
          entities: [
            FileEntity,
            SysPermissionEntity,
            SysRoleEntity,
            SysUserEntity,
            UserEntity,
            OAuthAccountEntity,
            FeedbackEntity,
            VisitorEntity,
            PushTemplateEntity,
            PushTaskEntity,
            PushRecordEntity,
            ArticleEntity
          ]
        }
      },
      inject: [dbConfig.KEY]
    })
  ]
})
export class DbModule {}
