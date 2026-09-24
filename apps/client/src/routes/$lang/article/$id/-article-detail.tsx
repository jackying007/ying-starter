import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LuEye } from 'react-icons/lu'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import type { LngKeys } from '@ying/shared'
import type { ArticleVo } from '@ying/server/types-client'
import { Badge } from '@ying/shared-react/ui'
import { LazyImage } from '@ying/shared-react/components'

import { MaxWidthWrapper } from '@/layouts/max-width-wrapper'
import { RichContent } from '@/components/rich-content'

import { articleAPI } from '@/api'

type ArticleDetailProps = {
  article: ArticleVo
}

export const ArticleDetail = ({ article }: ArticleDetailProps) => {
  const { i18n } = useTranslation()
  const lang = i18n.language as LngKeys
  const htmlText = article.content?.[lang]

  const bottomRef = useRef(null)
  const inView = useInView(bottomRef, { once: true })

  useEffect(() => {
    if (inView) {
      articleAPI.view(article.id)
    }
  }, [inView, article])

  return (
    <MaxWidthWrapper className="py-4 md:px-4 max-w-3xl">
      <div className="bg-background rounded-md overflow-hidden transition-all duration-300 shadow-sm flex flex-col text-gray-500">
        <div className="relative pb-[calc(5/9*100%)]">
          <LazyImage classNames={{ wrap: 'absolute' }} src={article.cover.url} />
        </div>
        <div className="flex-1 text-base p-4 gap-2 flex flex-col justify-between">
          <div>
            <div className="text-xl">{article.title[lang]}</div>
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
          <RichContent htmlText={htmlText} associatedFiles={article.associatedFiles} />
        </div>
        <motion.div ref={bottomRef} className="opacity-0" />
      </div>
    </MaxWidthWrapper>
  )
}
