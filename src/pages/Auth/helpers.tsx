import { Register } from '../../interfaces/AuthInterfaces'
import { EMAIL_PATTERN, PASSWORD_PATTERN } from './constants'

// TODO: refactor after refactoring register page
export const validateRegistration = (registerData: Register) => {
  if (
    !registerData.email ||
    !EMAIL_PATTERN.test(registerData.email) ||
    !registerData.password ||
    !PASSWORD_PATTERN.test(registerData.password) ||
    !registerData.confirmPassword ||
    registerData.password !== registerData.confirmPassword ||
    !registerData.acceptTermsAndConditions
  )
    return false

  return true
}
