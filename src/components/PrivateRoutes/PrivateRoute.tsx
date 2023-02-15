import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../../context/HiveContext'
import { NAVIGATE } from '../../utils/constants'

const PrivateRoute = () => {
  const { userAuth } = useContext(UserContext)

  return userAuth.token ? <Outlet /> : <Navigate to={NAVIGATE.LOGIN} />
}

export default PrivateRoute
