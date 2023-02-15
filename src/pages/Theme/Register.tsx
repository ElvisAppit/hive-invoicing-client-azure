import React, { useEffect, useState } from 'react'
import { STATUS_CODES, STATUS_TYPES } from '../../utils/constants'
import { useSearchParams } from 'react-router-dom'
import { ResponseInfo } from '../../interfaces/shared/types'
import { emailConfirmation } from '../../services/AuthService'
import Alert from '../../components/Shared/Alert/Alert'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import { useTranslation } from 'react-i18next'

function Register() {
  const { t } = useTranslation()
  const [verificationResponse, setVerificationResponse] = useState<ResponseInfo>({
    status: '',
    message: '',
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get('code')
  const userId = searchParams.get('userId')
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
    <div className='login-body'>
      <div className='login-wrapper'>
        <div className='login-panel'>
          <img src='assets/layout/images/logo-blue.svg' className='logo' alt='hive-layout' />
          <Alert message={verificationResponse.message} status={verificationResponse.status} />
          <RegistrationForm />

          {/* <div className='login-form'>
            <h2>Login</h2>
            <p>
              Already have an account? <a href='/'>Login</a>
            </p>
            <InputText placeholder='Full Name' />
            <InputText placeholder='Email' />
            <Password placeholder='Password' />
            <Button label='CONTINUE' type='button'></Button>
          </div> */}

          <p>
            A problem? <a href='/'>Click here</a> and let us help you.
          </p>
        </div>
        <div className='login-image'>
          <div className='login-image-content'>
            <h1>Access to your</h1>
            <h1>Hive</h1>
            <h1>Account</h1>
            <h3>
              Discover the ideal solution <br />
              for creating and following up <br />
              on your invoices online
            </h3>
          </div>
          <div className='image-footer'>
            <p>Visit Us</p>
            <div className='icons'>
              <a href='http://appit.ba/' target={'_blank'} rel='noreferrer'>
                <i className='pi pi-globe'></i>
              </a>
              <a href='https://www.facebook.com/appitba/' target={'_blank'} rel='noreferrer'>
                <i className='pi pi-facebook'></i>
              </a>
              <a href='https://www.linkedin.com/company/app-it-d-o-o/mycompany/' target={'_blank'} rel='noreferrer'>
                <i className='pi pi-linkedin'></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
