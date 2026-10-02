import { useState } from 'react'

export const useToggle = (initialValue: boolean) => {
  const [state, setState] = useState(initialValue)
  const toggle = (value?: boolean) => {
    if (typeof value !== 'undefined') {
      setState(value)
    } else {
      setState(prev => !prev)
    }
  }
  return [state, toggle] as const
}
