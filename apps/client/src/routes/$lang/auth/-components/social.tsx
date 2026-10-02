import { FaGoogle, FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Button } from '@ying/shared-react/ui'
import { useSignIn } from '@/hooks/use-sign-in'

export const Social = () => {
  const { t } = useTranslation('auth')
  const signIn = useSignIn()

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button className="w-full flex gap-2" variant="outline" type="button" onClick={() => signIn('google')}>
        <FaGoogle className="h-5 w-5" />
        <span>{t('text.google_login')}</span>
      </Button>
      <Button className="w-full flex gap-2" variant="outline" type="button" onClick={() => signIn('github')}>
        <FaGithub className="h-5 w-5" />
        <span>{t('text.github_login')}</span>
      </Button>
    </div>
  )
}
