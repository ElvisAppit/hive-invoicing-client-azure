import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { t } from 'i18next'
import i18n from './i18n'
import AppBreadcrumb from './AppBreadcrumb'
import AppMenu from './AppMenu'
import { UserContext } from './context/HiveContext'
import { EMPTY_STRING, NAVIGATE, USER_AUTH_LOCAL_STORAGE } from './utils/constants'
import { EMPTY_COMPANY_INFO } from './pages/Company/constants'
import { LOGGED_OUT } from './pages/Auth/constants'

const AppTopbar = (props: any) => {
  const navigate = useNavigate()
  const { userAuth, setUserAuth } = useContext(UserContext)
  const logout = () => {
    localStorage.setItem(USER_AUTH_LOCAL_STORAGE, JSON.stringify(LOGGED_OUT))
    setUserAuth(LOGGED_OUT)
    navigate(NAVIGATE.LOGIN)
  }

  const languages = [
    { name: t('common.english'), code: 'GB' },
    { name: t('common.bosnian'), code: 'BA' },
  ]
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const languageChange = (e: string) => {
    i18n.changeLanguage(e)
    setSelectedLanguage(e)
    setIsDisabled(!isDisabled)
  }

  const notificationsItemClassName = classNames('notifications-item', {
    'active-menuitem': props.topbarNotificationMenuActive,
    display: 'inline-flex',
  })
  const profileItemClassName = classNames('profile-item', {
    'active-menuitem fadeInDown': props.topbarUserMenuActive,
  })

  const itemTemplate = (option: any) => {
    return (
      <div className='flex align-items-center'>
        <span
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: '18px', height: '12px' }}
        />
        <span>{option.name}</span>
      </div>
    )
  }

  return (
    <div className='layout-topbar'>
      <div className='topbar-left'>
        <button type='button' className='menu-button p-link' onClick={props.onMenuButtonClick}>
          <i className='pi pi-chevron-left'></i>
        </button>

        <Link to='/'>
          <img
            id='logo-horizontal'
            className='horizontal-logo'
            src='/assets/layout/images/logo-white.svg'
            alt='hive-layout'
          />
        </Link>

        <span className='topbar-separator'></span>

        <div className='layout-breadcrumb viewname' style={{ textTransform: 'uppercase' }}>
          <AppBreadcrumb meta={props.meta} />
        </div>

        <img
          id='logo-mobile'
          className='mobile-logo'
          src='/assets/layout/images/logo-dark.svg'
          alt='hive-layout'
        />
      </div>

      <AppMenu
        model={props.menu}
        menuMode={props.menuMode}
        active={props.menuActive}
        mobileMenuActive={props.staticMenuMobileActive}
        onMenuClick={props.onMenuClick}
        onMenuitemClick={props.onMenuitemClick}
        onRootMenuitemClick={props.onRootMenuitemClick}
      ></AppMenu>

      <div className='layout-mask modal-in'></div>

      <div className='topbar-right'>
        <ul className='topbar-menu'>
          <li className={notificationsItemClassName}>
            <Dropdown
              value={languages.find((language) => language.name.toLowerCase() == selectedLanguage)}
              options={languages}
              optionLabel='name'
              onChange={(e) => {
                languageChange(e.value.name.toLowerCase())
              }}
              className='p-dropdown'
              itemTemplate={itemTemplate}
              valueTemplate={itemTemplate}
            />
          </li>
          <li className={profileItemClassName}>
            <button type='button' className='p-link' onClick={props.onTopbarUserMenu}>
              <img
                src={userAuth.logoUrl ? userAuth.logoUrl : EMPTY_COMPANY_INFO.logoUrl} // TODO - refactor code - logoUrl should not be in userAuth - new task
                alt='diamond-layout'
                className='profile-image border-circle'
              />
              <span className='profile-name'>
                {userAuth.email !== EMPTY_STRING ? userAuth.email : 'Please login!'}
              </span>
            </button>
            <ul className='profile-menu fade-in-up'>
              <li>
                <button
                  type='button'
                  className='p-link'
                  onClick={() => navigate(NAVIGATE.SETTINGS)}
                >
                  <i className='pi pi-cog'></i>
                  <span>{t('common.settings')}</span>
                </button>
              </li>
              <li>
                <button type='button' className='p-link'>
                  <i className='pi pi-calendar'></i>
                  <span>Calendar</span>
                </button>
              </li>
              <li>
                <button type='button' className='p-link'>
                  <i className='pi pi-inbox'></i>
                  <span>Inbox</span>
                </button>
              </li>
              <li>
                <button type='button' className='p-link' onClick={logout}>
                  <i className='pi pi-power-off'></i>
                  <span>{t('user.logout').toString()}</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AppTopbar
