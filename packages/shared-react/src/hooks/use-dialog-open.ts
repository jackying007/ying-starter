import { useCallback, useState } from 'react'

type UseDialogOpenProps = {
  defaultOpen?: boolean
}

export const useDialogOpen = <TFormValue>(props: UseDialogOpenProps = {}) => {
  const { defaultOpen = false } = props
  const [open, setOpen] = useState(defaultOpen)
  const [formValue, setFormValue] = useState<TFormValue | undefined>()

  const onOpen = useCallback((value?: TFormValue) => {
    if (value) {
      setFormValue(value)
    } else {
      setFormValue(undefined)
    }
    setOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onOpenChange = useCallback((val: boolean) => {
    setOpen(val)
  }, [])

  return {
    open,
    formValue,
    onOpen,
    onClose,
    onOpenChange
  }
}
