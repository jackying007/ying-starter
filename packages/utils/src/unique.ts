// 各种数组去重

export function uniqueNumbers(arr: (number | number[])[]): number[] {
  return [...new Set(arr.flat(Infinity) as number[])]
}

export function uniqueBy<T, K extends keyof T>(arr: T[], key: K): T[] {
  const seen = new Set<T[K]>()
  return arr.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

export function unique<T>(arr: T[]): T[] {
  const obj: { [key in string]: number } = {}
  arr.forEach(el => (obj[JSON.stringify(el)] = 1))
  return Object.keys(obj).map(el => JSON.parse(el))
}
