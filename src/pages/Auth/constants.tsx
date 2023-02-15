import { CLIENT_CONFIRMATION_MAIL_URI, EMPTY_STRING } from '../../utils/constants'

export const EMPTY_REGISTRATION = {
  email: EMPTY_STRING,
  password: EMPTY_STRING,
  confirmPassword: EMPTY_STRING,
  clientConfirmationEmailURI: CLIENT_CONFIRMATION_MAIL_URI,
  acceptTermsAndConditions: false,
}

export const EMPTY_REGISTRATION_RESPONSE = {
  status: EMPTY_STRING,
  message: EMPTY_STRING,
}

export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/

export const LOGGED_OUT = {
  email: EMPTY_STRING,
  role: EMPTY_STRING,
  token: EMPTY_STRING,
  isFirstLogin: false,
  logoUrl: EMPTY_STRING,
}
