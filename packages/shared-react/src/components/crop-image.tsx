import { type Ref, useState, useImperativeHandle, useRef, useCallback } from 'react'
import { Rnd } from 'react-rnd'

export type TSaveRes = {
  file: File
  url: string
}

export type TCropImageHandle = {
  save: () => Promise<TSaveRes | undefined>
}

type CropImageProps = {
  ref?: Ref<TCropImageHandle>
  url: string
  type: string
  name: string
  // 宽/高的值
  aspectRatio?: number
}

type RenderData = {
  containerW: number
  containerH: number
  renderW: number
  renderH: number
  renderX: number
  renderY: number
}

export const CropImage = ({ ref, url, type, name, aspectRatio }: CropImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [renderData, setRenderData] = useState<RenderData>({
    containerW: 0,
    containerH: 0,
    renderW: 0,
    renderH: 0,
    renderX: 0,
    renderY: 0
  })

  const [renderRnd, setRenderRnd] = useState(false)

  const setImage = useCallback(async () => {
    setTimeout(() => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()

      const half2W = width / 2
      const half2H = height / 2

      // 默认裁剪区域显示宽高的一半并居中
      let renderW = half2W
      let renderH = half2H
      let renderX = renderW - renderW / 2
      let renderY = renderH - renderH / 2

      // // 默认裁剪区域整张图片
      // let renderW = width
      // let renderH = height
      // let renderX = 0
      // let renderY = 0

      if (aspectRatio) {
        if (renderW > renderH) {
          renderW = renderH * aspectRatio
        } else {
          renderH = renderW / aspectRatio
        }

        renderX = half2W - renderW / 2
        renderY = half2H - renderH / 2
      }

      setRenderData(prev => ({
        ...prev,
        containerW: width,
        containerH: height,
        renderW,
        renderH,
        renderX,
        renderY
      }))
      setRenderRnd(true)
    }, 300)
  }, [aspectRatio])

  useImperativeHandle(ref, () => ({
    save: async () => {
      const { containerW, containerH, renderW, renderH, renderX, renderY } = renderData

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const drawImage = new Image()
      drawImage.crossOrigin = 'anonymous'
      drawImage.src = url
      await new Promise(resolve => (drawImage.onload = resolve))

      const { width: originWidth, height: originHeight } = drawImage

      const xRatio = originWidth / containerW
      const yRatio = originHeight / containerH

      const cutW = Math.round(renderW * xRatio)
      const cutH = Math.round(renderH * yRatio)
      canvas.width = cutW
      canvas.height = cutH

      ctx?.drawImage(
        drawImage,
        Math.round(renderX * yRatio),
        Math.round(renderY * yRatio),
        cutW,
        cutH,
        0,
        0,
        cutW,
        cutH
      )

      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, type, 0.7))
      if (blob) {
        return { file: new File([blob], name, { type }), url: URL.createObjectURL(blob) }
      }
    }
  }))

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      <img src={url} className="w-full h-full rounded-none" onLoad={setImage} />
      {renderRnd && (
        <Rnd
          className="z-10 border-2 border-primary shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]"
          lockAspectRatio={aspectRatio}
          default={{
            x: renderData.renderX,
            y: renderData.renderY,
            width: renderData.renderW,
            height: renderData.renderH
          }}
          resizeHandleComponent={{
            bottomLeft: <HandleComponent />,
            bottomRight: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />
          }}
          onResizeStop={(_, __, elemRef, ___, { x, y }) => {
            setRenderData(prev => ({
              ...prev,
              renderW: parseInt(elemRef.style.width.slice(0, -2)),
              renderH: parseInt(elemRef.style.height.slice(0, -2)),
              renderX: x,
              renderY: y
            }))
          }}
          onDragStop={(_, { x, y }) => {
            setRenderData(prev => ({ ...prev, renderX: x, renderY: y }))
          }}
        />
      )}
    </div>
  )
}

const HandleComponent = () => {
  return <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
}
