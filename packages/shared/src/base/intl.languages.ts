const fallbackLng = 'en' as const
const constLngs = [fallbackLng, 'zh'] as const

export type LngKeys = (typeof constLngs)[number]

export type TIntlText = {
  [key in LngKeys]?: string
}

export const clientLanguagesConfig = {
  fallbackLng,
  languages: constLngs.map(lng => lng) // 这里是为了把 as const 的数组转回普通类型
}
