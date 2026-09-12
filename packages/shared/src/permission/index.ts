import { genneratePermission, gennerateCodeToPermission } from './type'
import { dashboard, sys, file, feedback, user, article, notification } from './modules'

export * from './type'

const root = genneratePermission('root', {
  dashboard,
  sys,
  file,
  feedback,
  user,
  article,
  notification
})

export const pms = gennerateCodeToPermission(root)
