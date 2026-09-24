import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@ying/shared-react/ui'
import { TipError } from '@/components/tip-error'
import { MaxWidthWrapper } from './max-width-wrapper'

export const Error = ({ error, reset }: ErrorComponentProps) => {
  return (
    <MaxWidthWrapper className="my-auto fc flex-col gap-3">
      <TipError message={(error as Error)?.message ?? String(error)} />
      <Button size="sm" variant="outline" onClick={reset}>
        重试
      </Button>
    </MaxWidthWrapper>
  )
}
