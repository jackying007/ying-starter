import dayjs from 'dayjs'
import { LuEye } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'

import type { LngKeys } from '@ying/shared'
import type { ArticleEntity } from '@ying/shared'
import { cn, Badge } from '@ying/frontend/ui'
import { LazyImage } from '@ying/frontend/components'

type ArticleItemProps = {
  article: ArticleEntity
}

export const ArticleItem = ({ article }: ArticleItemProps) => {
  const { i18n } = useTranslation()
  const lang = i18n.language as LngKeys
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'bg-background rounded-md overflow-hidden cursor-pointer transition-all duration-300 flex flex-col sm:flex-row sm:h-40 text-gray-500',
        'shadow-sm hover:-translate-y-1'
      )}
      onClick={() => navigate({ to: '/$lang/article/$id', params: { lang, id: article.id } })}
    >
      <div className="relative pb-[calc(5/9*100%)] w-auto sm:pb-0 sm:w-72.5">
        <LazyImage classNames={{ wrap: 'absolute' }} src={article.cover.url} />
      </div>
      <div className="flex-1 text-base p-3 gap-2 flex flex-col justify-between">
        <div>
          <div className="text-md line-clamp-3">{article.title[lang]}</div>
          <div className="flex gap-2 flex-wrap mt-2">
            {article.keywords?.map(el => (
              <Badge variant="secondary" className="text-xs px-2" key={el}>
                {el}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <LuEye />
            {article.view}
          </div>
          <div>{dayjs(article.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    </div>
  )
}
