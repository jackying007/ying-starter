import type { LinkProps } from '@tanstack/react-router'
import { Card, CardHeader, CardContent, CardFooter } from '@ying/shared-react/ui'
import { Header } from './header'
import { BackButton } from './back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel?: string
  backButtonTo?: LinkProps['to']
}

export const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonTo }: CardWrapperProps) => {
  return (
    <Card className="w-full my-0 sm:my-6 sm:w-100 flex-1 sm:flex-none rounded-none sm:rounded-md shadow-none sm:shadow-sm gap-0">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex justify-center">
        {backButtonLabel && backButtonTo && <BackButton label={backButtonLabel} to={backButtonTo} />}
      </CardFooter>
    </Card>
  )
}
