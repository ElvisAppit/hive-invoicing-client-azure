import { useTranslation } from 'react-i18next'

function Error() {
  const { t } = useTranslation()
  return <p>{t('login.errorPage')}!</p>
}

export default Error
