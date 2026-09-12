import { useEffect } from 'react'
import { create } from 'zustand'

import type { ConfigVo } from '@ying/shared'

import { commonApi } from '@/api'

type ConfigStore = {
  config?: ConfigVo
}

const useConfigStore = create<ConfigStore>(() => ({
  config: undefined
}))

export const useConfig = () => {
  const config = useConfigStore(state => state.config)
  async function getConfig() {
    const config = await commonApi.getConfig()
    useConfigStore.setState({ config })
  }
  useEffect(() => {
    if (!config) getConfig()
  }, [config])

  return {
    config,
    getConfig
  }
}
