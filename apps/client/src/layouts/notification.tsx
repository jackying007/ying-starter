import { useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotificationSw } from '@/providers/use-notification-sw'
import { Button } from '@ying/shared-react/ui'

export const Notification = () => {
  const { t } = useTranslation()
  const { subscribeState, subscribe } = useNotificationSw()
  const [loading, startTransition] = useTransition()

  if (subscribeState === 'no-sub') {
    return (
      <Button
        variant="default"
        size="xs"
        onClick={() => startTransition(subscribe)}
        disabled={loading}
        loading={loading}
      >
        {t('enable_subscription')}
      </Button>
    )
  }
  if (subscribeState === 'has-sub') {
    return (
      <Button variant="secondary" size="xs" disabled>
        {t('subscribed')}
      </Button>
    )
  }
  return null
}
