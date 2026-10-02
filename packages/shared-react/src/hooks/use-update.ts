import { useState } from 'react'

export const useUpdate = () => {
  const [, updateState] = useState({})
  const forceUpdate = () => updateState({})
  return forceUpdate
}
