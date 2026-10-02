export const getItem = <T>(key: string): T | undefined => {
  let value: T | undefined
  try {
    const result = localStorage.getItem(key)
    if (result) {
      value = JSON.parse(result)
    }
  } catch (error) {
    console.error(error)
  }
  return value
}

export const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getStringItem = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const setStringItem = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

export const removeItem = (key: string): void => {
  localStorage.removeItem(key)
}

export const clearItems = () => {
  localStorage.clear()
}

type ItemWithExpire<T> = {
  expiredTime: number
  value: T
}

export const setItemWithExpire = <T>(key: string, value: T, expireSec = 24 * 60 * 60): void => {
  const storeData: ItemWithExpire<T> = {
    expiredTime: Date.now() + expireSec * 1000,
    value
  }
  localStorage.setItem(key, JSON.stringify(storeData))
}

export const getItemWithExpire = <T>(key: string): T | null => {
  let value: T | null = null
  try {
    const result = localStorage.getItem(key)
    if (result) {
      const storeData = JSON.parse(result) as ItemWithExpire<T>
      if (Date.now() < storeData.expiredTime) {
        value = storeData.value
      }
    }
  } catch (error) {
    console.error(error)
  }
  return value
}
