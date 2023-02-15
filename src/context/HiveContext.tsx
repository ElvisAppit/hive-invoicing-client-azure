import { createContext, useState } from 'react'
import { UserAuth, UserContextInterface } from '../interfaces/AuthInterfaces'
import { ContextProps } from '../interfaces/shared/types'
import { USER_AUTH_LOCAL_STORAGE } from '../utils/constants'

const UserContext = createContext({} as UserContextInterface)

function UserContextProvider({ children }: ContextProps) {
  const userAuthLocalStorage = localStorage.getItem(USER_AUTH_LOCAL_STORAGE)
  const [userAuth, setUserAuth] = useState<UserAuth>({
    email: userAuthLocalStorage ? JSON.parse(userAuthLocalStorage).email : '',
    role: userAuthLocalStorage ? JSON.parse(userAuthLocalStorage).role : '',
    token: userAuthLocalStorage ? JSON.parse(userAuthLocalStorage).token : '',
    isFirstLogin: userAuthLocalStorage ? false : true,
    logoUrl: userAuthLocalStorage ? JSON.parse(userAuthLocalStorage).logoUrl : '',
  })

  return (
    <UserContext.Provider
      value={{
        userAuth,
        setUserAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const UserConsumer = UserContext.Consumer

export { UserContextProvider, UserConsumer, UserContext }
