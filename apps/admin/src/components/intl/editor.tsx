import { useRef, useState } from 'react'
import { clientLanguagesConfig, type LngKeys, type TIntlText } from '@ying/shared'
import { type EditorHandle, type EditorProps, NormalEditor } from '@/components/editor'

import { IntlSwitch } from './intl-switch'

const { fallbackLng } = clientLanguagesConfig

type IntlEditorProps = Omit<EditorProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: TIntlText
  onChange?: (val: TIntlText) => void
}

export const IntlEditor = ({ defaultValue, onChange, ...props }: IntlEditorProps) => {
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const editorRef = useRef<EditorHandle>(null)
  const intl = useRef<TIntlText>(defaultValue ?? {})

  const changeLng = (lng: LngKeys) => {
    setCurrentLng(lng)
    const newContent = intl.current?.[lng] ?? ''
    editorRef.current?.setContent(newContent)
  }

  return (
    <>
      <IntlSwitch value={currentLng} onChange={changeLng} />
      <NormalEditor
        {...props}
        className="mt-2"
        ref={editorRef}
        defaultValue={defaultValue?.[fallbackLng]}
        onChange={val => {
          intl.current[currentLng] = val
          onChange?.(intl.current)
        }}
      />
    </>
  )
}
