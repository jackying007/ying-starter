export type TPermission = {
  label: string
  code?: string
  [key: string]: TPermission | string | undefined
}

export function genneratePermission<T extends Record<string, TPermission>>(label: string, children?: T) {
  return {
    label,
    ...children
  } as {
    label: string
  } & T
}

export function permissionAddCode(permission: TPermission, parentCode?: string) {
  Object.keys(permission).forEach(key => {
    if (key !== 'label' && key !== 'code') {
      const permissionChild = permission[key] as TPermission
      const code = parentCode ? `${parentCode}:${key}` : key
      permissionChild.code = code
      permissionAddCode(permissionChild, code)
    }
  })
}

export function gennerateCodeToPermission<T extends TPermission>(permission: T) {
  const newPermission = permission
  permissionAddCode(newPermission)
  return newPermission
}
