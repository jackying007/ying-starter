import { useRef, useState } from 'react'
import { Input } from 'antd'
import type { InputProps } from 'antd/lib/input'

import { clientLanguagesConfig, type LngKeys, type TIntlText } from '@ying/shared'

import { IntlSwitch } from './intl-switch'
import { cn } from '@ying/frontend/ui'

const { fallbackLng, languages } = clientLanguagesConfig

type IntlInputProps = Omit<InputProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: TIntlText
  onChange?: (val: TIntlText) => void
}

// oxlint-disable-next-line no-unused-vars
export const IntlInput = ({ value, defaultValue, onChange, ...props }: IntlInputProps) => {
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const intlText = useRef<TIntlText>(defaultValue ?? {})

  return (
    <>
      <IntlSwitch value={currentLng} onChange={setCurrentLng} />
      {languages.map(lng => (
        <Input
          {...props}
          className={cn('mt-1.5! hidden!', currentLng === lng && 'inline-flex!')}
          key={lng}
          defaultValue={defaultValue?.[lng]}
          onChange={e => {
            intlText.current[lng] = e.target.value
            onChange?.(intlText.current)
          }}
        />
      ))}
    </>
  )
}
