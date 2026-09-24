import { useTranslation } from 'react-i18next'
import { EmptyBoxIcon } from '@ying/shared-react/icons'

type EmptyProps = {
  desc?: string
}

export const Empty = ({ desc }: EmptyProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full flex flex-col items-center gap-y-1 text-gray-400 text-base py-4">
      <EmptyBoxIcon className="text-5xl" />
      {desc || t('No data')}
    </div>
  )
}
