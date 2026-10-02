import { cn } from '@ying/shared-react/ui'

type LoadingBarProps = {
  loading?: boolean
  classNames?: {
    wrapper?: string
    bar?: string
  }
}

export const LoadingBar = ({ loading = true, classNames }: LoadingBarProps) => {
  return (
    <div className={cn('w-full h-1 bg-transparent rounded-full overflow-hidden', classNames?.wrapper)}>
      {loading && (
        <div
          className={cn(
            'h-full w-1/3 via-black/70 bg-linear-to-r from-transparent to-transparent animate-loading',
            classNames?.bar
          )}
        />
      )}
    </div>
  )
}
