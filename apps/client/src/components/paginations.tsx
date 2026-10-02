import { useTranslation } from 'react-i18next'
import {
  cn,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ying/shared-react/ui'
import { LoadingBar } from '@/components/loading-bar'

export type PaginationsProps = {
  className?: string
  total?: number
  page: number
  pageSize?: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  disabled?: boolean
  loading?: boolean
  onChange: (page: number, pageSize: number) => void
}

export const Paginations = ({
  className,
  total,
  page,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50, 80, 100],
  showSizeChanger = true,
  disabled,
  loading,
  onChange
}: PaginationsProps) => {
  const prevPageFirst = page - 1
  const prevPageSecond = page - 2
  const prevPageThird = page - 3
  const showFirstPage = page !== 1

  const nextPageFirst = page + 1
  const nextPageSecond = page + 2
  const nextPageThird = page + 3
  const lastPage = Math.ceil((total ?? 0) / pageSize)
  const showLastPage = page !== lastPage

  const goPrevPage = () => {
    const prevPage = page - 1
    if (prevPage < 1) return
    onChange(prevPage, pageSize)
  }

  const goNextPage = () => {
    const nextPage = page + 1
    if (nextPage > lastPage) return
    onChange(nextPage, pageSize)
  }

  const onPageSizeChange = (newPageSize: number) => {
    const newLastPage = Math.ceil((total ?? 0) / newPageSize)
    if (page > newLastPage) {
      onChange(newLastPage, newPageSize)
    } else {
      onChange(page, newPageSize)
    }
  }

  const { t } = useTranslation()

  return (
    <Pagination className={className}>
      <PaginationContent className={cn('flex-wrap', !total && 'w-full')}>
        <LoadingBar loading={!total || loading} />
        {total && (
          <>
            <PaginationItem>
              <PaginationPrevious text={t('prev')} disabled={disabled} onClick={goPrevPage} />
            </PaginationItem>
            {showFirstPage && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(1, pageSize)}>
                  1
                </PaginationButton>
              </PaginationItem>
            )}
            {prevPageThird > 1 &&
              (prevPageThird > 2 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem>
                  <PaginationButton disabled={disabled} onClick={() => onChange(prevPageThird, pageSize)}>
                    {prevPageThird}
                  </PaginationButton>
                </PaginationItem>
              ))}
            {prevPageSecond > 1 && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(prevPageSecond, pageSize)}>
                  {prevPageSecond}
                </PaginationButton>
              </PaginationItem>
            )}
            {prevPageFirst > 1 && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(prevPageFirst, pageSize)}>
                  {prevPageFirst}
                </PaginationButton>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationButton isActive>{page}</PaginationButton>
            </PaginationItem>
            {nextPageFirst < lastPage && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(nextPageFirst, pageSize)}>
                  {nextPageFirst}
                </PaginationButton>
              </PaginationItem>
            )}
            {nextPageSecond < lastPage && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(nextPageSecond, pageSize)}>
                  {nextPageSecond}
                </PaginationButton>
              </PaginationItem>
            )}
            {nextPageThird < lastPage &&
              (nextPageThird < lastPage - 1 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem>
                  <PaginationButton disabled={disabled} onClick={() => onChange(nextPageThird, pageSize)}>
                    {nextPageThird}
                  </PaginationButton>
                </PaginationItem>
              ))}
            {showLastPage && (
              <PaginationItem>
                <PaginationButton disabled={disabled} onClick={() => onChange(lastPage, pageSize)}>
                  {lastPage}
                </PaginationButton>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext text={t('next')} disabled={disabled} onClick={goNextPage} />
            </PaginationItem>
            {showSizeChanger && !!pageSizeOptions.length && (
              <PaginationItem>
                <Select
                  disabled={disabled}
                  onValueChange={val => onPageSizeChange(Number(val))}
                  value={String(pageSize)}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-28" position="popper" align="start">
                    <SelectGroup>
                      {pageSizeOptions.map(el => (
                        <SelectItem key={el} value={String(el)}>
                          {el + ' '}
                          {t('items_per_page')}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </PaginationItem>
            )}
          </>
        )}
      </PaginationContent>
    </Pagination>
  )
}
