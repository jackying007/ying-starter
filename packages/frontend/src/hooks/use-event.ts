import { type RefObject, useEffect } from 'react'

export type TargetEventMap<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : HTMLElementEventMap

export const useEvent = <T extends EventTarget = Window, K extends keyof TargetEventMap<T> = keyof TargetEventMap<T>>(
  event: K,
  handler?: (this: T, ev: TargetEventMap<T>[K]) => any,
  targetRef?: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
) => {
  const currentTarget = targetRef !== undefined ? targetRef.current : window

  useEffect(() => {
    if (!handler || !currentTarget) return
    const listener = handler as EventListener
    currentTarget.addEventListener(event as string, listener, options)
    return () => {
      currentTarget.removeEventListener(event as string, listener, options)
    }
  }, [event, handler, currentTarget, options])
}
