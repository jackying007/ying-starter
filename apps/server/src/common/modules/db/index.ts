import { DataSource } from 'typeorm'
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
} from '@ying/db-typeorm'
import { dbConfig } from '@/config'
import { appLogger } from '@/app.logger'

export const dataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
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
})
await dataSource.initialize()
appLogger.log('Database initialized.')
