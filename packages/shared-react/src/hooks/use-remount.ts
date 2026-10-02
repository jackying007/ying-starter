import { useEffect, useRef, useState } from 'react'

export const useRemount = (reRender?: boolean) => {
  const [renderKey, setRenderKey] = useState(0)
  const prev = useRef(reRender)
  useEffect(() => {
    if (!prev.current && reRender) setRenderKey(k => k + 1)
    prev.current = reRender
  }, [reRender])
  return { renderKey, setRenderKey }
}
