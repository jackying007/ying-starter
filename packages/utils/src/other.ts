export function createTreeFns<T extends { children?: T[] }>(
  array: T[] = [],
  idField = 'id',
  parentIdFiled = 'parentId'
) {
  function toTree(parentId: any): T[] {
    return array
      .filter(el => el[parentIdFiled as keyof T] === parentId)
      .map(el => ({ ...el, children: toTree(el[idField as keyof T]) }))
  }

  return {
    toTree
  }
}

export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return trees.reduce<T[]>((prev, cur) => {
    if (cur.children) {
      return prev.concat(cur, ...flattenTrees(cur.children))
    } else {
      return prev.concat(cur)
    }
  }, [])
}

export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay = 200
): (...args: Parameters<T>) => void {
  let timer = 0
  return function (...params: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      callback(...params)
    }, delay)
  }
}

export function getOption<T extends { label: string; value: string | number }>(arr: T[], value: number): T | undefined {
  return arr.find(el => el.value === value)
}

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

export function deepCopyArray<T>(arr: T[]): T[] {
  return arr.map(item => deepCopy(item))
}

export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    const arrCopy: T[] = []
    for (const item of obj) {
      arrCopy.push(deepCopy(item))
    }
    return arrCopy as unknown as T
  }

  const objCopy: { [key: string]: any } = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objCopy[key] = deepCopy(obj[key])
    }
  }

  return objCopy as T
}

// 让传入异步函数最少经过固定的秒数才返回内容
export function delyFunc<T extends (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>>(func: T, dely: number) {
  return async (...args: Parameters<typeof func>): Promise<Awaited<ReturnType<typeof func>>> => {
    const time = Date.now()
    const res = await func(...args)
    const afterTime = Date.now() - time
    const finalDely = dely - afterTime
    if (finalDely > 0) {
      await new Promise(re => setTimeout(re, finalDely))
    }
    return res
  }
}

export function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function getRandomElementFromArr<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export function weightedPick<T>(arr: T[], probs: number[]): T | undefined {
  if (arr.length !== probs.length || arr.length === 0) return undefined
  let total = probs.reduce((s, w) => s + w, 0)
  if (total <= 0) return undefined

  let r = Math.random() * total
  for (let i = 0; i < arr.length; i++) {
    r -= probs[i]
    if (r < 0) {
      return arr[i]
    }
  }
  return arr[arr.length - 1]
}

export function chunkArray<T>(arr: T[], chunkSize: number) {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

export function strClipping(str: string) {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`
}

export function formatDecimalStr(s: string) {
  // 如果字符串中不包含小数点，直接返回原字符串
  if (!s.includes('.')) {
    return s
  }

  const [integerPart, decimalPart] = s.split('.')
  if (!decimalPart) return s
  let count = 0
  for (const ch of decimalPart) {
    if (ch === '0') {
      count++
    } else {
      break
    }
  }

  if (count <= 1) {
    return s
  }

  // 余下的部分
  const remaining = decimalPart.slice(count)
  return `${integerPart}.{${count}}${remaining}`
}

export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString()

  const negative = display.startsWith('-')
  if (negative) display = display.slice(1)

  display = display.padStart(decimals, '0')

  const [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)]
  const fractionReplace = fraction.replace(/(0+)$/, '')
  return `${negative ? '-' : ''}${integer || '0'}${fractionReplace ? `.${fractionReplace}` : ''}`
}

export function parseUnits(value: string, decimals: number) {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value)) throw new Error(`parseUnits 值错误 ${value}`)

  let [integer, fraction = '0'] = value.split('.')
  if (!integer) throw new Error(`parseUnits 值错误 ${value}`)
  const negative = integer.startsWith('-')
  if (negative) integer = integer.slice(1)

  // trim trailing zeros.
  fraction = fraction.replace(/(0+)$/, '')

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1) integer = `${BigInt(integer) + 1n}`
    fraction = ''
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals)
    ]

    const rounded = Math.round(Number(`${unit}.${right}`))
    if (rounded > 9) fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0')
    else fraction = `${left}${rounded}`

    if (fraction.length > decimals) {
      fraction = fraction.slice(1)
      integer = `${BigInt(integer) + 1n}`
    }

    fraction = fraction.slice(0, decimals)
  } else {
    fraction = fraction.padEnd(decimals, '0')
  }

  return BigInt(`${negative ? '-' : ''}${integer}${fraction}`)
}

/**
 * 根据指定的概率随机抛出一个错误
 * @param probability - 出错的概率，必须是 0 到 1 之间的数字（例如：0.3 表示 30% 的概率会抛出错误）
 */
export function maybeThrowError(probability: number): void {
  if (probability < 0 || probability > 1) {
    throw new Error('概率参数必须介于 0 和 1 之间')
  }
  if (Math.random() < probability) {
    throw new Error('随机错误发生了')
  }
}

export function getMaxBigInt(array: bigint[]) {
  return array.reduce((a, b) => (a > b ? a : b))
}

export function getMinBigInt(array: bigint[]) {
  return array.reduce((a, b) => (a < b ? a : b))
}

export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result as Omit<T, K>
}

export function omitArray<T extends Record<string, any>, K extends keyof T>(arr: T[], ...keys: K[]): Omit<T, K>[] {
  return arr.map(obj => omit(obj, ...keys))
}

export function nullToUndefined<T>(value: T): T {
  if (value === null) {
    return undefined as T
  }
  if (Array.isArray(value)) {
    return value.map(nullToUndefined) as T
  }
  if (typeof value === 'object') {
    const result = {} as Record<string, unknown>
    for (const [key, val] of Object.entries(value as object)) {
      result[key] = nullToUndefined(val)
    }
    return result as T
  }
  return value
}
