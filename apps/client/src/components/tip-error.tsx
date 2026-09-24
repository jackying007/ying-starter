import { ErrorIcon } from '@ying/shared-react/icons'

type TipErrorProps = {
  message?: string | null
}

export const TipError = ({ message }: TipErrorProps) => {
  if (!message) return null

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ErrorIcon className="text-xl shrink-0" />
      <p>{message}</p>
    </div>
  )
}
