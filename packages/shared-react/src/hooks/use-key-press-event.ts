import type { RefObject } from 'react'
import { useEvent } from './use-event'

export type KeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean)

export type KeyPredicate = (event: KeyboardEvent) => boolean

export type KeyboardEventHandler = (event: KeyboardEvent) => void

export type UseKeyPressEventOptions<T> = {
  event?: 'keydown' | 'keypress' | 'keyup'
  targetRef?: RefObject<T | null>
  eventOptions?: boolean | AddEventListenerOptions
}

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate =>
  typeof keyFilter === 'function'
    ? keyFilter
    : typeof keyFilter === 'string'
      ? (event: KeyboardEvent) => event.key === keyFilter
      : keyFilter
        ? () => true
        : () => false

export const useKeyPressEvent = <T extends EventTarget = Window>(
  keyFilter: KeyFilter,
  handler: KeyboardEventHandler,
  options: UseKeyPressEventOptions<T> = {}
) => {
  const { event = 'keydown', targetRef, eventOptions } = options
  const predicate = createKeyPredicate(keyFilter)
  useEvent(event, e => predicate(e) && handler(e), targetRef, eventOptions)
}
