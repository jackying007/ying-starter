import { useEffect, useState, type RefObject } from 'react'

type InViewCallbackFn = (entry: IntersectionObserverEntry) => void
type ObserveData = {
  once: boolean
  onInView: InViewCallbackFn
}

const activeObservingElements = new WeakMap<Element, ObserveData>()

const onIntersectionChange: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach(entry => {
    const observeData = activeObservingElements.get(entry.target)
    if (!observeData) return
    observeData.onInView(entry)
    if (observeData.once && entry.isIntersecting) {
      activeObservingElements.delete(entry.target)
      observer.unobserve(entry.target)
    }
  })
}

const isClient = typeof window !== 'undefined'

const intersectionObserver = isClient ? new IntersectionObserver(onIntersectionChange) : undefined

function observeElement(element: Element, observeData: ObserveData) {
  activeObservingElements.set(element, observeData)
  intersectionObserver?.observe(element)
  return () => {
    activeObservingElements.delete(element)
    intersectionObserver?.unobserve(element)
  }
}

type UseInViewOptions = {
  once?: boolean
  initial?: boolean
}

export const useInView = (ref: RefObject<Element | null>, { once = false, initial = false }: UseInViewOptions = {}) => {
  const [isInView, setInView] = useState(initial)

  useEffect(() => {
    if (!ref.current || (once && isInView)) return

    return observeElement(ref.current, {
      once,
      onInView: entry => setInView(entry.isIntersecting)
    })
  }, [isInView, once, ref])

  return isInView
}
