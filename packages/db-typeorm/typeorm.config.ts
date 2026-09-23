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
} from './dist'

export default new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'ying123456',
  database: 'ying',
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
  ],
  migrations: ['migrations/*.ts']
})
