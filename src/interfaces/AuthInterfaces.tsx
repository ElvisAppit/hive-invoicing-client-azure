export type Login = {
  email: string
  password: string
}

export type Register = Login & {
  confirmPassword: string
  clientConfirmationEmailURI: string
  acceptTermsAndConditions: boolean // TODO: Check with backend if it is needed to send this property
}

export type EmailConfirmation = {
  userId: string
  code: string
}

export type UserAuth = {
  email: string
  role: string
  token: string
  isFirstLogin: boolean
  logoUrl: string
}
export type UserContextInterface = {
  userAuth: UserAuth
  setUserAuth: (value: UserAuth) => void
}
