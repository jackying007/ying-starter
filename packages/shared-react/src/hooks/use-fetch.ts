import { useCallback, useEffect, useMemo, useState } from 'react'

import { debounce } from '@ying/utils'

type useFetchOptions<T, U> = {
  fetchFn: (params?: U) => Promise<T>
  immediately?: boolean
  debounceTimeout?: number
}

export const useFetch = <T, U>({ fetchFn, immediately = true, debounceTimeout = 500 }: useFetchOptions<T, U>) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()

  const run = useCallback(
    async (params?: U) => {
      try {
        setLoading(true)
        const res = await fetchFn(params)
        setData(res)
      } catch (error) {
        //
      } finally {
        setLoading(false)
      }
    },
    [fetchFn]
  )

  const debounceRun = useMemo(() => {
    return debounce(async (params?: U) => {
      try {
        setLoading(true)
        const res = await fetchFn(params)
        setData(res)
      } catch (error) {
        //
      } finally {
        setLoading(false)
      }
    }, debounceTimeout)
  }, [debounceTimeout, fetchFn])

  useEffect(() => {
    if (immediately) run()
  }, [immediately, run])

  return {
    loading,
    data,
    setData,
    run,
    debounceRun
  }
}
