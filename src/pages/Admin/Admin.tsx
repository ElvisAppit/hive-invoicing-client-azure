import { useTranslation } from 'react-i18next'

function Admin() {
  const { t } = useTranslation()
  return (
    <div className='container mt-3'>
      <h1 className='text-center'>{t('login.adminPage')}</h1>
    </div>
  )
}

export default Admin
