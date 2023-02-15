import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../context/HiveContext'
import { USER_AUTH_LOCAL_STORAGE } from '../../utils/constants'

function Home() {
  const { userAuth, setUserAuth } = useContext(UserContext)
  const { t } = useTranslation()
  const logout = () => {
    const loggedOut = { email: '', role: '', token: '', isFirstLogin: false, logoUrl: '' }
    localStorage.setItem(USER_AUTH_LOCAL_STORAGE, JSON.stringify(loggedOut))
    setUserAuth(loggedOut)
  }

  return (
    <>
      <h1>Hive Invoicing</h1>
      <h4>
        {t('home.welcome')} <b>{userAuth.email}</b>. {t('home.yourRoleIs')} <b>{userAuth.role}</b>.
      </h4>
      {userAuth.isFirstLogin ? <p>{t('user.firstLoginCompanyInfo')}.</p> : null}
      <button onClick={logout}>{t('user.logout')}</button>
    </>
  )
}

export default Home
