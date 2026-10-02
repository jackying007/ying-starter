import type { ArticleListVo } from '@ying/server/types-client'

import { MaxWidthWrapper } from '@/layouts/max-width-wrapper'
import { Paginations } from '@/components/paginations'
import { articleAPI } from '@/api'
import { usePagination } from '@/hooks/use-pagination'

import { ArticleItem } from './-article-item'

type ArticleListProps = {
  initialPage?: number
  initialList?: ArticleListVo
  initialListCount?: number
}

export const ArticleList = (props: ArticleListProps) => {
  const { list, pagination } = usePagination({
    key: 'article',
    getList: articleAPI.list,
    getListCount: articleAPI.listCount,
    ...props
  })

  return (
    <MaxWidthWrapper className="py-5">
      <div className="flex flex-col gap-5 wrap-break-word">
        {list?.map(el => (
          <ArticleItem key={el.id} article={el} />
        ))}
      </div>
      <Paginations className="mt-3" {...pagination} />
    </MaxWidthWrapper>
  )
}
