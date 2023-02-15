import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'i18next'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { classNames } from 'primereact/utils'
import Alert from '../Shared/Alert/Alert'
import { Register } from '../../interfaces/AuthInterfaces'
import { ResponseInfo } from '../../interfaces/shared/types'
import { registerUser } from '../../services/AuthService'
import { STATUS_TYPES, STATUS_CODES } from '../../utils/constants'
import {
  EMAIL_PATTERN,
  EMPTY_REGISTRATION,
  EMPTY_REGISTRATION_RESPONSE,
  PASSWORD_PATTERN,
} from '../../pages/Auth/constants'
import { validateRegistration } from '../../pages/Auth/helpers'

function RegistrationForm() {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [registerData, setRegisterData] = useState<Register>(EMPTY_REGISTRATION)
  const [loading, setLoading] = useState<boolean>(false)
  const [acceptTermsDialog, setAcceptTermsDialog] = useState<boolean>(false)
  const [registrationResponse, setRegistrationResponse] = useState<ResponseInfo>(
    EMPTY_REGISTRATION_RESPONSE,
  )

  const handleInput = (e: ChangeEvent<HTMLInputElement> | CheckboxChangeParams) => {
    setRegisterData((prev: Register) => {
      return {
        ...prev,
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked === true : e.target.value,
      }
    })
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    if (!validateRegistration(registerData)) return

    setLoading(true)
    handeRegistration()
    setRegistrationResponse(EMPTY_REGISTRATION_RESPONSE)
  }

  const handeRegistration = () => {
    registerUser(registerData)
      .then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          setRegistrationResponse({
            status: STATUS_TYPES.SUCCESS,
            message: t('register.successfullyRegistratedVerifiedAccount') as string,
          })
        } else {
          setRegistrationResponse({
            status: STATUS_TYPES.ERROR,
            message: t('common.defaultErrorMessage'),
          })
        }
      })
      // TODO: 401 unauthorized, response to user
      .catch((error) => {
        let message = ''
        console.log(error)

        if (!error?.response) {
          message = t('login.noServerResponse') as string
        } else if (error.response.status === STATUS_CODES.ERROR) {
          message = t('register.emailTaken') as string
        } else {
          message = t('register.registrationFailed') as string
        }

        setRegistrationResponse({
          status: STATUS_TYPES.ERROR,
          message: message,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const acceptTerms = () => {
    setRegisterData((prev: Register) => {
      return {
        ...prev,
        acceptTermsAndConditions: true,
      }
    })
    setAcceptTermsDialog(false)
  }

  const acceptTermsFooter = () => (
    <Button
      label={t('common.accept') as string}
      icon='pi pi-check'
      className='p-button-text'
      onClick={acceptTerms}
    />
  )

  return (
    <form className='login-form' onSubmit={submitForm}>
      <h2>{t('register.registerMembership')}</h2>
      <p>
        {t('login.youHaveAccount')}? <Link to='/login'>{t('login.loginHere')}!</Link>
      </p>
      {/* Mail */}
      <div className='field'>
        <InputText
          name='email'
          value={registerData.email as string}
          placeholder={t('contacts.email') as string}
          onChange={handleInput}
          autoFocus
          className={classNames({
            'p-invalid':
              submitted && (!registerData.email || !EMAIL_PATTERN.test(registerData.email)),
          })}
        />
        <p>
          {submitted && !registerData.email && (
            <small className='p-invalid'>{t('register.emailIsRequired')}</small>
          )}
          {submitted && registerData.email && !EMAIL_PATTERN.test(registerData.email) && (
            <small className='p-invalid'>{t('register.emailFormIsNotCorrect')}</small>
          )}
        </p>
      </div>

      {/* Password */}
      <div className='field'>
        <InputText
          name='password'
          type='password'
          placeholder={t('register.password') as string}
          onChange={handleInput}
          className={classNames({
            'p-invalid':
              submitted &&
              (!registerData.password || !PASSWORD_PATTERN.test(registerData.password)),
          })}
        />
        <p>
          {submitted && !registerData.password && (
            <small className='p-invalid'>{t('register.passwordIsRequired')}</small>
          )}
          {submitted && registerData.password && !PASSWORD_PATTERN.test(registerData.password) && (
            <small className='p-invalid'>{t('register.passwordIsWeak')}</small>
          )}
        </p>
      </div>

      {/* Confirm password */}
      <div className='field'>
        <InputText
          name='confirmPassword'
          type='password'
          placeholder={t('register.confirmPassword') as string}
          onChange={handleInput}
          className={classNames({
            'p-invalid':
              submitted &&
              (!registerData.confirmPassword ||
                registerData.password !== registerData.confirmPassword),
          })}
        />
        <p>
          {submitted &&
            (!registerData.confirmPassword ||
              registerData.confirmPassword !== registerData.password) && (
              <small className='p-invalid'>{t('register.confirmPasswordIsRequired')}</small>
            )}
        </p>
      </div>

      {/* Terms and conditions */}
      <div className='field'>
        <Checkbox
          name='acceptTermsAndConditions'
          checked={registerData.acceptTermsAndConditions}
          onChange={handleInput}
          className={classNames({
            'p-invalid': submitted && !registerData.acceptTermsAndConditions,
          })}
        />

        <label className='mb-0'>
          {t('register.iAgreeToThe')}
          <a onClick={() => setAcceptTermsDialog(true)}> {t('common.termsAndConditions')}</a>
          <Dialog
            visible={acceptTermsDialog}
            style={{ width: '768px' }}
            header={t('common.termsAndConditions')}
            modal
            className='p-fluid'
            footer={acceptTermsFooter}
            onHide={() => setAcceptTermsDialog(false)}
          >
            {t('common.termsAndConditions')}
          </Dialog>
        </label>
        <p>
          {submitted && !registerData.acceptTermsAndConditions && (
            <small className='p-invalid'>{t('register.termsAndConditionsRequired')}</small>
          )}
        </p>
      </div>

      <Button label={t('register.register').toString()} className='text-uppercase' type='submit'>
        {loading ? <span className='pi pi-spin pi-spinner'></span> : null}
      </Button>

      <Alert message={registrationResponse.message} status={registrationResponse.status} />

      {/* <div className='forgot-password'>
          {t('fp.forgotPassword')}? <br />
          <Link to='/forgotPassword'>{t('fp.forgotPassword')}!</Link>
          <Alert message={loginResponse.message} status={loginResponse.status} />
        </div> */}
    </form>
  )
}

export default RegistrationForm
