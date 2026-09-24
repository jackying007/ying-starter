import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from '@tanstack/react-router'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@ying/shared-react/ui'
import { languages } from '@/i18n/config'
import { CookieEnum } from '@/enum'
import { getCookie, setCookie } from '@/cookie'

const languagesMap: Record<(typeof languages)[number], string> = {
  en: 'English',
  zh: '中文'
}

const lngs = languages.map(l => ({ label: languagesMap[l], value: l }))

export const SwitchLanguage = () => {
  const { pathname, search } = useLocation()
  const { lang } = useParams({ from: '/$lang' })
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  function selectLanguage(changeLng: string) {
    i18n.changeLanguage(changeLng)
    navigate({
      to: pathname.replace(`/${lang}`, `/${changeLng}`),
      search,
      replace: true
    })
  }

  useEffect(() => {
    const cookieLang = getCookie(CookieEnum.Language)
    if (cookieLang !== lang) {
      setCookie(CookieEnum.Language, lang)
    }
  }, [lang])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{t('language')}</span>
      <Select onValueChange={selectLanguage} defaultValue={lang} value={lang}>
        <SelectTrigger className="w-37.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {lngs.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
