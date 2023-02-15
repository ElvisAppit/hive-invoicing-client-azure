import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { UserContext } from '../../context/HiveContext'
import UnauthorizedRoute from './UnauthorizedRoute'
import { ROLES } from '../../utils/constants'

const RestrictUserRoute = () => {
  const { userAuth } = useContext(UserContext)

  return userAuth.role === ROLES.SUPER_ADMIN ? <Outlet /> : <UnauthorizedRoute />
}

export default RestrictUserRoute
