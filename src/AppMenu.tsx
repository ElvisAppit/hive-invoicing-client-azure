import React from 'react'
import { Link } from 'react-router-dom'
import AppSubmenu from './AppSubmenu'

const AppMenu = (props: any) => {
  return (
    <div className='layout-sidebar' onClick={props.onMenuClick}>
      <Link to='/' className='logo'>
        <img
          id='app-logo'
          className='logo-image'
          src='/assets/layout/images/logo-white.svg'
          alt='HIVE Invoice'
        />
        <span className='app-name'>HIVE</span>
      </Link>

      <div className='layout-menu-container'>
        <AppSubmenu
          items={props.model}
          menuMode={props.menuMode}
          parentMenuItemActive
          menuActive={props.active}
          mobileMenuActive={props.mobileMenuActive}
          root
          onMenuitemClick={props.onMenuitemClick}
          onRootMenuitemClick={props.onRootMenuitemClick}
        />
      </div>
    </div>
  )
}

export default AppMenu
