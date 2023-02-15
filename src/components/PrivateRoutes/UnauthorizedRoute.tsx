import { useTranslation } from 'react-i18next'

function UnauthorizedRoute() {
  const { t } = useTranslation()
  return <p>{t('register.unauthorizedAccess')}.</p>
}

export default UnauthorizedRoute
