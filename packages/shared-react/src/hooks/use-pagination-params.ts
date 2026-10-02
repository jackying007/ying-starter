import { useEffect, useState } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { debounce } from '@ying/utils'

export const usePaginationParams = <T extends FieldValues>() => {
  const [params, setParams] = useState<T>()
  const { control, watch, getValues, reset } = useForm<T>()

  useEffect(() => {
    const subscription = watch(
      debounce(() => {
        setParams(getValues())
      }, 500)
    )
    return () => subscription.unsubscribe()
  }, [watch, getValues])

  return {
    params,
    control,
    watch,
    getValues,
    reset
  }
}
