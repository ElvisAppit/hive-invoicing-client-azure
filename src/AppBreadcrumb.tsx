import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const AppBreadcrumb = (props: any) => {
  const location = useLocation()
  const { t } = useTranslation()
  const label = props.meta.label
  return <>{location.pathname === '/' ? <span>{t('common.home')}</span> : <span>{label}</span>}</>
}
export default AppBreadcrumb
