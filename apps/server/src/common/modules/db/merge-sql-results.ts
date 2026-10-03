type ObjectKey<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? K : never
}[keyof T]

type MergeSqlResult<
  T extends object,
  MainKey extends ObjectKey<T>,
  MergeKey extends Extract<keyof T, string>,
  DirectKey extends Extract<keyof T, string>
> = T[MainKey] & {
  [K in DirectKey]: T[K]
} & {
  [K in MergeKey as `${K}s`]: NonNullable<T[K]>[]
}
// MainKey 主表字段
// MergeKey 需要合并的字段
// directKeys：直接挂到结果对象
export function mergeSqlResults<
  T extends object,
  MainKey extends ObjectKey<T>,
  MainKeyId extends keyof T[MainKey],
  const MergeKeys extends readonly Extract<keyof T, string>[],
  const DirectKeys extends readonly Extract<keyof T, string>[]
>(
  list: T[],
  mainKey: MainKey,
  mainKeyId: MainKeyId,
  mergeKeys: MergeKeys,
  directKeys: DirectKeys
): MergeSqlResult<T, MainKey, MergeKeys[number], DirectKeys[number]>[] {
  type Result = MergeSqlResult<T, MainKey, MergeKeys[number], DirectKeys[number]>

  return Array.from(
    list
      .reduce((map, row) => {
        const id = row[mainKey][mainKeyId]
        let data = map.get(id)
        const keys = Object.keys(row) as Extract<keyof T, string>[]
        if (!data) {
          data = {
            ...row[mainKey]
          } as Result
          for (const key of keys) {
            if (mergeKeys.includes(key)) {
              ;(data as Record<string, unknown>)[`${key}s`] = []
            } else if ((directKeys as readonly string[]).includes(key)) {
              ;(data as Record<string, unknown>)[key] = row[key]
            }
          }
          map.set(id, data)
        }
        for (const key of keys) {
          if (mergeKeys.includes(key) && row[key]) {
            ;(data as Record<string, unknown[]>)[`${key}s`].push(row[key])
          }
        }
        return map
      }, new Map<T[MainKey][MainKeyId], Result>())
      .values()
  )
}
