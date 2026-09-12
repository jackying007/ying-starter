import { type JSX, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { pms } from '@ying/shared/permission'

import type { AppRouteObject } from '@/types/router'
import { CircleLoading } from '@/components/loading'

import {
  Dashboard,
  User,
  Feedback,
  Article,
  PushTemplate,
  PushTask,
  PushRecord,
  Visitor,
  SysRole,
  SysUser,
  SysSetting
} from './lazy-pages'

function withLoadingFallback(component: JSX.Element) {
  return <Suspense fallback={<CircleLoading />}>{component}</Suspense>
}

export const MenuRoutes: AppRouteObject[] = [
  {
    path: 'dashboard',
    meta: {
      icon: 'solar:graph-bold-duotone',
      key: '/dashboard',
      label: '首页',
      permission: pms.dashboard
    },
    element: withLoadingFallback(<Dashboard />)
  },
  {
    path: 'user',
    meta: {
      icon: 'solar:user-bold-duotone',
      key: '/user',
      label: '用户管理',
      permission: pms.user
    },
    element: withLoadingFallback(<User />)
  },
  {
    path: 'feedback',
    meta: {
      icon: 'solar:chat-line-bold-duotone',
      key: '/feedback',
      label: '反馈管理',
      permission: pms.feedback
    },
    element: withLoadingFallback(<Feedback />)
  },
  {
    path: 'article',
    meta: {
      icon: 'solar:book-bookmark-bold-duotone',
      key: '/article',
      label: '文章管理',
      permission: pms.article
    },
    element: withLoadingFallback(<Article />)
  },
  {
    path: 'notification',
    element: withLoadingFallback(<Outlet />),
    meta: {
      icon: 'solar:bell-bing-bold-duotone',
      key: '/notification',
      label: '通知管理',
      hideTab: true,
      permission: pms.notification
    },
    children: [
      {
        path: 'push-template',
        meta: {
          icon: 'solar:document-bold-duotone',
          key: '/notification/push-template',
          label: '推送模板',
          permission: pms.notification.pushTemplate
        },
        element: <PushTemplate />
      },
      {
        path: 'push-task',
        meta: {
          icon: 'solar:siren-bold-duotone',
          key: '/notification/push-task',
          label: '推送任务',
          permission: pms.notification.pushTask
        },
        element: <PushTask />
      },
      {
        path: 'push-record',
        meta: {
          icon: 'solar:record-square-bold-duotone',
          key: '/notification/push-record',
          label: '推送记录',
          permission: pms.notification.pushRecord
        },
        element: <PushRecord />
      },
      {
        path: 'visitor',
        meta: {
          icon: 'solar:user-hand-up-bold-duotone',
          key: '/notification/visitor',
          label: '浏览用户',
          permission: pms.notification.visitor
        },
        element: <Visitor />
      }
    ]
  },
  {
    path: 'sys',
    element: withLoadingFallback(<Outlet />),
    meta: {
      icon: 'solar:code-scan-bold-duotone',
      key: '/sys',
      label: '系统管理',
      hideTab: true,
      permission: pms.sys
    },
    children: [
      {
        path: 'role',
        meta: {
          icon: 'solar:share-circle-bold-duotone',
          key: '/sys/role',
          label: '系统角色',
          permission: pms.sys.role
        },
        element: <SysRole />
      },
      {
        path: 'user',
        meta: {
          icon: 'solar:shield-user-bold-duotone',
          key: '/sys/user',
          label: '系统用户',
          permission: pms.sys.user
        },
        element: <SysUser />
      },
      {
        path: 'setting',
        meta: {
          icon: 'solar:settings-bold-duotone',
          key: '/sys/setting',
          label: '系统设置',
          permission: pms.sys.setting
        },
        element: <SysSetting />
      }
    ]
  }
]
