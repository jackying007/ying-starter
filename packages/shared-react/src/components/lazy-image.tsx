import { type ReactNode, type Ref, useEffect, useRef, useState } from 'react'
import { LoadingIconV1 } from '../icons'
import { useInView } from '../hooks'
import { cn } from '../ui'

type LazyImageProps = {
  ref?: Ref<HTMLImageElement>
  classNames?: {
    wrap?: string
    img?: string
    loadingWrap?: string
  }
  src: string
  onLoad?: (element: HTMLImageElement) => void
  imageExtra?: ReactNode
}

export const LazyImage = ({ ref, classNames, src, onLoad, imageExtra }: LazyImageProps) => {
  const divRef = useRef(null)
  const inView = useInView(divRef, { once: true })

  const [imageSrc, setImageSrc] = useState<string>()
  const [imageLoaded, setImageLoaded] = useState(false)
  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = e => {
    setImageLoaded(true)
    onLoad?.(e.currentTarget)
  }

  useEffect(() => {
    if (inView) setImageSrc(src)
  }, [inView, src])

  return (
    <div className={cn('relative w-full h-full', classNames?.wrap)} ref={divRef}>
      <img
        ref={ref}
        className={cn('w-full h-full object-cover', classNames?.img)}
        src={imageSrc}
        onLoad={onImageLoad}
      />
      {imageExtra}
      {!imageLoaded && (
        <div
          className={cn(
            'bg-accent absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center text-2xl',
            classNames?.loadingWrap
          )}
        >
          <LoadingIconV1 />
        </div>
      )}
    </div>
  )
}
