import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import Login from './pages/Theme/Login'
import { Error } from './pages/Theme/Error'
import { NotFound } from './pages/Theme/NotFound'
import { Access } from './pages/Theme/Access'
import Registration from './pages/Theme/Register'

const AppWrapper = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Registration />} />
      <Route path='*' element={<App />} />
      <Route path='/notfound' element={<NotFound />} />
      <Route path='/access' element={<Access />} />
      <Route path='/error' element={<Error />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  )
}

export default AppWrapper
