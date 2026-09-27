export function deepClone<T>(obj: T): T {
  const objectMap = new Map()
  const _deepClone = (value: any) => {
    if (value === null || typeof value !== 'object') {
      return value
    }
    if (objectMap.has(value)) return objectMap.get(value)
    const result: any = Array.isArray(value) ? [] : {}
    objectMap.set(value, result)
    for (const key in value) {
      result[key] = _deepClone(value[key])
    }
    return result
  }
  return _deepClone(obj)
}
