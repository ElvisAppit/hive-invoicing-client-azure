import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/HiveContext'
import { Login } from '../../interfaces/AuthInterfaces'
import { ResponseInfo } from '../../interfaces/shared/types'
import { loginUser } from '../../services/AuthService'
import {
  STATUS_TYPES,
  STATUS_CODES,
  USER_AUTH_LOCAL_STORAGE,
  NAVIGATE,
} from '../../utils/constants'
import Alert from '../Shared/Alert/Alert'
import { useTranslation } from 'react-i18next'

function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [loginResponse, setLoginResponse] = useState<ResponseInfo>({
    status: '',
    message: '',
  })
  const { setUserAuth } = useContext(UserContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>()

  const login = (data: Login) => {
    setLoading(true)
    setLoginResponse({ message: '', status: '' })
    handleLogin(data)
  }

  const handleLogin = async (data: Login) => {
    await loginUser(data)
      .then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          const userAuth = {
            email: response.data.email as string,
            role: response.data.role as string,
            token: response.data.token as string,
            isFirstLogin: (localStorage.getItem(USER_AUTH_LOCAL_STORAGE) ? true : false) as boolean,
            logoUrl: response.data.imageUrl as string,
          }

          localStorage.setItem(USER_AUTH_LOCAL_STORAGE, JSON.stringify(userAuth))
          setUserAuth(userAuth)
          navigate(NAVIGATE.APP)
        }
      })
      .catch((error) => {
        let message = ''

        if (!error?.response) {
          message = t('login.noServerResponse') as string
        } else if (error.response.status === STATUS_CODES.ERROR) {
          message = error.response.data.errors[0]
        } else {
          message = t('login.loginFailed') as string
        }

        setLoginResponse({
          status: STATUS_TYPES.ERROR,
          message: message,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <form className='login-form' onSubmit={handleSubmit(login)}>
        <h2>{t('login.memberLogin')}</h2>
        <p>
          {t('register.youDoNotHaveAccount')}?{' '}
          <Link to='/register'>{t('register.registerHere')}!</Link>
        </p>
        <InputText
          className='field'
          type='mail'
          placeholder='Email'
          {...register('email', {
            required: t('register.emailIsRequired') as string,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('register.emailFormIsNotCorrect') as string,
            },
            onChange: () => setLoginResponse({ message: '', status: '' }),
          })}
        />
        {errors.email && <div className='error'>{errors.email.message}</div>}
        <InputText
          type='password'
          className='field'
          placeholder={t('register.password') as string}
          {...register('password', {
            required: t('register.passwordIsRequired') as string,
            pattern: {
              value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
              message: t('register.passwordIsWeak') as string,
            },
          })}
        />
        {errors.password && <div className='error'>{errors.password.message}</div>}
        <Button label={t('login.login').toString()} className='text-uppercase' type='submit'>
          {loading ? <span className='pi pi-spin pi-spinner'></span> : null}
        </Button>
        {/* <Button label='Success' className='p-button-success' type='button' onClick={showSuccess} />*/}
        <Alert message={loginResponse.message} status={loginResponse.status} />
        {/* <div className='forgot-password'>
          {t('fp.forgotPassword')}? <br />
          <Link to='/forgotPassword'>{t('fp.forgotPassword')}!</Link>
          <Alert message={loginResponse.message} status={loginResponse.status} />
        </div> */}
      </form>
    </>
    // <form onSubmit={handleSubmit(login)}>
    //   {
    //     <div>
    //       <h3 className='text-center'>{t('login.memberLogin')}</h3>
    //       <div className='field'>
    //         <input
    //           className='field'
    //           placeholder='Email'
    //           type='mail'
    //           {...register('email', {
    //             required: t('register.emailIsRequired') as string,
    //             pattern: {
    //               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    //               message: t('register.emailFormIsNotCorrect') as string,
    //             },
    //             onChange: () => setLoginResponse({ message: '', status: '' }),
    //           })}
    //         />
    //         {errors.email && <div className='error_message'>{errors.email.message}</div>}
    //       </div>
    //       <div className='form-group'>
    //         <span className='input-icon'>
    //           <i className='fa fa-lock'></i>
    //         </span>
    //         <input
    //           type='password'
    //           className='form-control'
    //           placeholder={t('register.password') as string}
    //           {...register('password', {
    //             required: t('register.passwordIsRequired') as string,
    //             pattern: {
    //               value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
    //               message: t('register.passwordStrength') as string,
    //             },
    //           })}
    //         />
    //         {errors.password && <div className='error_message'>{errors.password.message}</div>}
    //       </div>
    //       <button className='btn signin'>
    //         {t('login.login')}
    //         {loading ? <span className='spinner-border spinner-border-sm mx-2'></span> : null}
    //       </button>
    //       <span className='forgot-pass'>
    //         <p className='mb-0 text-center'>
    //           {t('register.youDoNotHaveAccount')}? <br />
    //           <Link to='/register'>{t('register.registerHere')}!</Link>
    //           <Alert message={loginResponse.message} status={loginResponse.status} />
    //         </p>
    //       </span>
    //     </div>
    //   }
    // </form>
  )
}

export default LoginForm
