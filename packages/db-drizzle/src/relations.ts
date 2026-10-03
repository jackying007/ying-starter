import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, r => ({
  sysRoleTable: {
    permissions: r.many.sysPermissionTable({
      from: r.sysRoleTable.id.through(r.sysRoleToSysPermissionTable.sysRoleId),
      to: r.sysPermissionTable.code.through(r.sysRoleToSysPermissionTable.sysPermissionCode)
    }),
    users: r.many.sysUserTable({
      from: r.sysRoleTable.id.through(r.sysRoleToSysUserTable.sysRoleId),
      to: r.sysUserTable.id.through(r.sysRoleToSysUserTable.sysUserId)
    })
  },
  sysUserTable: {
    roles: r.many.sysRoleTable({
      from: r.sysUserTable.id.through(r.sysRoleToSysUserTable.sysUserId),
      to: r.sysRoleTable.id.through(r.sysRoleToSysUserTable.sysRoleId)
    }),
    avatar: r.one.fileTable({
      from: r.sysUserTable.avatarId,
      to: r.fileTable.id
    })
  },
  userTable: {
    avatar: r.one.fileTable({
      from: r.userTable.avatarId,
      to: r.fileTable.id
    }),
    oauthAccounts: r.many.oauthAccountTable({
      from: r.userTable.id,
      to: r.oauthAccountTable.userId
    }),
    visitors: r.many.visitorTable({
      from: r.userTable.id.through(r.visitorToUserTable.userId),
      to: r.visitorTable.id.through(r.visitorToUserTable.visitorId)
    })
  },
  oauthAccountTable: {
    user: r.one.userTable({
      from: r.oauthAccountTable.userId,
      to: r.userTable.id
    })
  },
  articleTable: {
    cover: r.one.fileTable({
      from: r.articleTable.coverId,
      to: r.fileTable.id
    }),
    associatedFiles: r.many.fileTable({
      from: r.articleTable.id.through(r.articleToFileTable.articleId),
      to: r.fileTable.id.through(r.articleToFileTable.fileId)
    })
  },
  visitorTable: {
    users: r.many.userTable({
      from: r.visitorTable.id.through(r.visitorToUserTable.visitorId),
      to: r.userTable.id.through(r.visitorToUserTable.userId)
    })
  },
  pushTemplateTable: {
    image: r.one.fileTable({
      from: r.pushTemplateTable.imageId,
      to: r.fileTable.id
    })
  },
  pushTaskTable: {
    pushTemplate: r.one.pushTemplateTable({
      from: r.pushTaskTable.pushTemplateId,
      to: r.pushTemplateTable.id
    }),
    pushRecords: r.many.pushRecordTable({
      from: r.pushTaskTable.id,
      to: r.pushRecordTable.pushTaskId
    })
  },
  pushRecordTable: {
    pushTask: r.one.pushTaskTable({
      from: r.pushRecordTable.pushTaskId,
      to: r.pushTaskTable.id
    })
  }
}))
