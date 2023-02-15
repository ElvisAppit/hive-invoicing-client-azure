import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Alert from '../../components/Shared/Alert/Alert'
import LoginForm from '../../components/LoginForm/LoginForm'
import { UserContext } from '../../context/HiveContext'
import { ResponseInfo } from '../../interfaces/shared/types'
import { emailConfirmation } from '../../services/AuthService'
import { STATUS_TYPES, STATUS_CODES } from '../../utils/constants'
import { useTranslation } from 'react-i18next'

function Login() {
  const [verificationResponse, setVerificationResponse] = useState<ResponseInfo>({
    status: '',
    message: '',
  })
  const { userAuth } = useContext(UserContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get('code')
  const userId = searchParams.get('userId')
  const { t } = useTranslation()
  useEffect(() => {
    if (userId && code) {
      verifyUser(userId, code)
    }
  }, [])

  const verifyUser = async (userId: string, code: string) => {
    const responseMessage = await emailConfirmation({ userId, code })

    if (responseMessage.status === STATUS_CODES.SUCCESS) {
      setVerificationResponse({
        status: STATUS_TYPES.SUCCESS,
        message: t('login.emailVerified' as string),
      })
    } else {
      setVerificationResponse({
        status: STATUS_TYPES.ERROR,
        message: t('login.emailNotVerified' as string),
      })
    }

    setSearchParams({})
  }

  return (
    <div className='container-fluid container-login'>
      {userAuth.token ? (
        <h1 className='text-center'>{t('login.youAreLoggedIn')}.</h1>
      ) : (
        <>
          <Alert message={verificationResponse.message} status={verificationResponse.status} />
          <LoginForm />
        </>
      )}
    </div>
  )
}

export default Login
