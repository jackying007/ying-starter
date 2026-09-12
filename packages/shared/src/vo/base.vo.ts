export type ErrorVo = {
  status: number
  message: string | string[]
  path: string
  timestamp: string
}

export type BaseVo<TStatus extends string | number, TData> = {
  status: TStatus
  data: TData
  message?: string
}

const baseVoKeys = ['status', 'data', 'message']
export function isBaseVo(data: any): data is BaseVo<string | number, any> {
  if (typeof data === 'object' && 'status' in data) {
    const keys = Object.keys(data)
    if (keys.some(el => !baseVoKeys.includes(el))) return false
    return true
  }
  return false
}

export function wrapBaseVo<TStatus extends string | number, TData>(
  status: TStatus,
  data: TData,
  message?: string
): BaseVo<TStatus, TData> {
  return {
    status,
    data,
    message
  }
}
