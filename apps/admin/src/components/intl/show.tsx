import { useState } from 'react'
import { Tooltip } from 'antd'

import { clientLanguagesConfig, type LngKeys, type TIntlText } from '@ying/shared'

import { IntlSwitch } from './intl-switch'

const { fallbackLng, languages } = clientLanguagesConfig

type IntlShowProps = {
  value?: TIntlText | null
}

export const IntlShow = ({ value }: IntlShowProps) => {
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)

  if (!value) return null

  return (
    <>
      <IntlSwitch value={currentLng} onChange={setCurrentLng} size="small" />
      {languages.map(
        lng =>
          currentLng === lng && (
            <Tooltip
              key={lng}
              title={<div className="truncate whitespace-pre-wrap">{value[lng]}</div>}
              placement="topLeft"
            >
              <div className="truncate whitespace-pre-wrap line-clamp-1">{value[lng]}</div>
            </Tooltip>
          )
      )}
    </>
  )
}
