import { useRef, useState } from 'react'
import { Input } from 'antd'
import type { TextAreaProps } from 'antd/lib/input'

import { clientLanguagesConfig, type LngKeys, type TIntlText } from '@ying/shared'

import { IntlSwitch } from './intl-switch'
import { cn } from '@ying/frontend/ui'

const { fallbackLng, languages } = clientLanguagesConfig

type IntlTextAreaProps = Omit<TextAreaProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: TIntlText
  onChange?: (val: TIntlText) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IntlTextArea = ({ value, defaultValue, onChange, ...props }: IntlTextAreaProps) => {
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const intlText = useRef<TIntlText>(defaultValue ?? {})

  return (
    <>
      <IntlSwitch value={currentLng} onChange={setCurrentLng} />
      {languages.map(lng => (
        <Input.TextArea
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
