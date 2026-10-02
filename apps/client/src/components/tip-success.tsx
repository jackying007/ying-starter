import { SuccessIcon } from '@ying/shared-react/icons'

type TipSuccessProps = {
  message?: string
}

export const TipSuccess = ({ message }: TipSuccessProps) => {
  if (!message) return null

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <SuccessIcon className="text-xl shrink-0" />
      <p>{message}</p>
    </div>
  )
}
