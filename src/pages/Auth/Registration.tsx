import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import { UserContext } from '../../context/HiveContext'

function Registration() {
  const { userAuth } = useContext(UserContext)
  const { t } = useTranslation()
  return (
    <div className='container-fluid container-register'>
      {userAuth.token ? (
        <h1 className='text-center'>{t('login.youAreLoggedIn')}.</h1>
      ) : (
        <RegistrationForm />
      )}
    </div>
  )
}

export default Registration
