import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './App.scss'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { classNames } from 'primereact/utils'
import PrimeReact from 'primereact/api'
import { Tooltip } from 'primereact/tooltip'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import AppTopbar from './AppTopbar'
import AppFooter from './AppFooter'
import AppConfig from './AppConfig'
import AppSearch from './AppSearch'
import AppRightMenu from './AppRightMenu'
import AppBreadcrumb from './AppBreadcrumb'
import Dashboard from './components/Theme/menu/Dashboard'
import PrivateRoute from './components/PrivateRoutes/PrivateRoute'
import RestrictUserRoute from './components/PrivateRoutes/RestrictUserRoute'
import Admin from './pages/Admin/Admin'
import BankAccounts from './pages/BankAccounts/BankAccounts'
import CodeBooks from './pages/CodeBooks/CodeBooks'
import Contacts from './pages/Contacts/Contacts'
import Invoice from './pages/Theme/Invoice'
import Invoices from './pages/Invoices/Invoices'
import InvoiceItems from './pages/Invoices/InvoiceItems'
import Items from './pages/Items/Items'
import Settings from './pages/User/Settings'
import { Error } from './pages/Theme/Error'
import { CodeBook, CodeBookEntity } from './interfaces/CodeBookInterfaces'
import { getCodeBookEntities, getCodeBookValues } from './services/CodeBookService'
import { CODEBOOK_ENTITIES, EMPTY_STRING, NAVIGATE } from './utils/constants'
import { UserContext } from './context/HiveContext'

const App = () => {
  const [menuActive, setMenuActive] = useState(false)
  const [menuMode, setMenuMode] = useState('horizontal')
  const [colorScheme, setColorScheme] = useState<string>('light')
  const [menuTheme, setMenuTheme] = useState('layout-sidebar-darkgray')
  const [overlayMenuActive, setOverlayMenuActive] = useState(false)
  const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false)
  const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [topbarUserMenuActive, setTopbarUserMenuActive] = useState(false)
  const [topbarNotificationMenuActive, setTopbarNotificationMenuActive] = useState(false)
  const [rightMenuActive, setRightMenuActive] = useState(false)
  const [configActive, setConfigActive] = useState(false)
  const [inputStyle, setInputStyle] = useState('outlined')
  const [ripple, setRipple] = useState(false)
  const [logoColor, setLogoColor] = useState('white')
  const [componentTheme, setComponentTheme] = useState('blue')
  const [logoUrl, setLogoUrl] = useState('/assets/layout/images/logo-dark.svg')
  const [codeBookEntities, setCodeBookEntities] = useState<CodeBookEntity[]>([])
  const { userAuth, setUserAuth } = useContext(UserContext)
  const [invoiceTypes, setInvoiceTypes] = useState<CodeBook[]>([])
  const [invoiceName, setInvoiceName] = useState<string>('')
  const [codeBookBreadCrumb, setCodeBookBreadCrumb] = useState<string>()
  const copyTooltipRef = useRef<any>()
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()

  let menuClick = false
  let searchClick = false
  let userMenuClick = false
  let notificationMenuClick = false
  let rightMenuClick = false
  let configClick = false

  useEffect(() => {
    userAuth.token === EMPTY_STRING
      ? navigate(NAVIGATE.LOGIN)
      : (getCodeBookEntitiesData(), getInvoiceTypes())
  }, [i18next.language])

  useEffect(() => {
    copyTooltipRef && copyTooltipRef?.current && copyTooltipRef.current.updateTargetEvents()
  }, [location])

  const getCodeBookEntitiesData = () => {
    getCodeBookEntities({ TakeAll: true }).then((response) => {
      const lastCodeBookEntityId = response.data.data
        .slice(-1)
        .map((id: CodeBookEntity) => id.codeBookEntityId)[0]

      response.data.data.push({
        codeBookEntityId: lastCodeBookEntityId + 1,
        entityName: t('bankAccounts.bankAccounts'),
        code: CODEBOOK_ENTITIES.BANKACCOUNT,
      })
      setCodeBookEntities(response.data.data)
    })
  }

  const getInvoiceTypes = () => {
    getCodeBookValues({ EntityCodeName: CODEBOOK_ENTITIES.INV_TYPE }).then((response) =>
      setInvoiceTypes(response.data.data),
    )
  }

  const getCodeBookBreadCrumb = (entityName: string) => {
    setCodeBookBreadCrumb(entityName)
  }

  const getBreadCrumbInvoice = (invoiceName: string) => {
    setInvoiceName(invoiceName)
  }

  const breadcrumb = [
    { path: '/', parent: 'Home', label: t('common.home') },
    { path: '/user', parent: 'Pages', label: t('common.user') },
    { path: '/contacts', parent: 'Pages', label: t('common.contacts') },
    { path: '/invoices', parent: 'Pages', label: t('common.invoice') + ' / ' + invoiceName },
    { path: '/invoice', parent: 'Pages', label: t('common.invoice') },
    { path: '/company', parent: 'Pages', label: t('common.company') },
    { path: '/items', parent: 'Pages', label: t('common.items') },
    { path: '/invoices/manage', parent: 'Pages', label: t('common.invoice') },
    { path: '/items/manage', parent: 'Pages', label: t('common.items') },
    { path: '/codebook/entities', parent: 'Pages', label: t('codeBook.codeBookEntityItems') },
    {
      path: '/codebook/entities/values',
      parent: 'Pages',
      label: t('codeBook.codebookValues') + ' / ' + codeBookBreadCrumb,
    },
    { path: '/codebook/manage', parent: 'Pages', label: t('codeBook.codeBook') },
    { path: '/bankaccounts', parent: 'Pages', label: t('bankAccounts.bankAccounts') },
    { path: '/bankaccounts/manage', parent: 'Pages', label: t('bankAccounts.banks') },
    { path: '/settings', parent: 'Pages', label: t('common.settings') },
  ]

  const menu = [
    {
      label: t('common.favorites'),
      items: [
        { label: t('common.home'), icon: 'pi pi-fw pi-home', to: '/' },
        { label: t('common.contacts'), icon: 'pi pi-fw pi-users', to: '/contacts' },
        {
          label: t('common.invoices'),
          icon: 'pi pi-fw pi-money-bill',
          items: invoiceTypes.map((codeBook: CodeBook) => ({
            key: codeBook.codeBookId,
            label: codeBook.name,
            command: () => {
              navigate(NAVIGATE.INVOICES, {
                state: { codeBookId: codeBook.codeBookId, name: codeBook.name },
              })
            },
          })),
        },
        { label: t('common.items'), icon: 'pi pi-fw pi-box', to: '/items' },
      ],
    },

    { separator: true },
    {
      label: t('common.configuration'),
      items: codeBookEntities.map((codeBookEntity: CodeBookEntity) => ({
        key: codeBookEntity.codeBookEntityId,
        label: codeBookEntity.entityName,
        icon: 'pi pi-fw pi-circle-on',
        command: () => {
          codeBookEntity.code === CODEBOOK_ENTITIES.BANKACCOUNT
            ? navigate(NAVIGATE.BANKACCOUNTS)
            : navigate(NAVIGATE.CODEBOOK_VALUES, {
                state: {
                  codeBookEntityId: codeBookEntity.codeBookEntityId,
                  dataType: codeBookEntity.dataType,
                  codeBookEntityName: codeBookEntity.entityName,
                  entityCodeName: codeBookEntity.code,
                },
              })
        },
      })),
    },
    { separator: true },
    {
      label: t('common.misc'),
      items: [
        {
          label: t('common.landing'),
          icon: 'pi pi-fw pi-send',
          url: 'assets/pages/landing.html',
          target: '_blank',
        },
      ],
    },
  ]

  const meta = breadcrumb.find((obj) => {
    return obj.path === location.pathname
  })

  const onInputStyleChange = (inputStyle: string) => {
    setInputStyle(inputStyle)
  }

  const changeMenuTheme = (name: string, logoColor: string, componentTheme: string) => {
    onMenuThemeChange(name)
    changeStyleSheetUrl('theme-css', componentTheme, 2)
    setComponentTheme(componentTheme)

    const appLogoLink = document.getElementById('app-logo') as HTMLImageElement
    const appLogoUrl = `assets/layout/images/logo-${logoColor === 'dark' ? 'dark' : 'white'}.svg`
    const horizontalLogoLink = document.getElementById('logo-horizontal') as HTMLImageElement
    const horizontalLogoUrl = `assets/layout/images/logo-${
      logoColor === 'dark' ? 'dark' : 'white'
    }.svg`

    if (appLogoLink) {
      appLogoLink.src = appLogoUrl
    }
    if (horizontalLogoLink) {
      horizontalLogoLink.src = horizontalLogoUrl
    }
    setLogoColor(logoColor)
  }

  const changeComponentTheme = (theme: string) => {
    setComponentTheme(theme)
    changeStyleSheetUrl('theme-css', theme, 3)
  }

  const changeColorScheme = (e: HTMLSelectElement) => {
    setColorScheme(e.value as string)

    const scheme = e.value as string
    changeStyleSheetUrl('layout-css', 'layout-' + scheme + '.css', 1)
    changeStyleSheetUrl('theme-css', 'theme-' + scheme + '.css', 1)

    changeLogo(scheme)
  }

  const changeStyleSheetUrl = (id: string, value: string, from: number) => {
    const element = document.getElementById(id as string)
    const urlTokens = element?.getAttribute('href')?.split('/') as string[]

    if (from === 1) {
      urlTokens[urlTokens.length - 1] = value
    } else if (from === 2) {
      if (value !== null) {
        urlTokens[urlTokens.length - 2] = value
      }
    } else if (from === 3) {
      urlTokens[urlTokens.length - 2] = value
    }

    const newURL = urlTokens.join('/')

    replaceLink(element, newURL)
  }

  const changeLogo = (scheme: string) => {
    const appLogoLink = document.getElementById('app-logo') as HTMLImageElement
    const mobileLogoLink = document.getElementById('logo-mobile') as HTMLImageElement
    const invoiceLogoLink = document.getElementById('invoice-logo') as HTMLImageElement
    const footerLogoLink = document.getElementById('footer-logo') as HTMLImageElement
    const horizontalLogoLink = document.getElementById('logo-horizontal') as HTMLImageElement
    setLogoUrl(`assets/layout/images/logo-${scheme === 'light' ? 'dark' : 'white'}.svg`)

    if (appLogoLink) {
      appLogoLink.src = `assets/layout/images/logo-${scheme === 'light' ? logoColor : 'white'}.svg`
    }

    if (horizontalLogoLink) {
      horizontalLogoLink.src = `assets/layout/images/logo-${
        scheme === 'light' ? logoColor : 'white'
      }.svg`
    }

    if (mobileLogoLink) {
      mobileLogoLink.src = logoUrl
    }

    if (invoiceLogoLink) {
      invoiceLogoLink.src = logoUrl
    }

    if (footerLogoLink) {
      footerLogoLink.src = logoUrl
    }
  }

  const replaceLink = (linkElement: any, href: any) => {
    if (isIE()) {
      linkElement.setAttribute('href', href as string)
    } else {
      const id = linkElement.getAttribute('id')
      const cloneLinkElement = linkElement.cloneNode(true)

      cloneLinkElement.setAttribute('href', href)
      cloneLinkElement.setAttribute('id', id + '-clone')

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove()
        const _linkElement = document.getElementById(id)
        _linkElement && _linkElement.remove()
        cloneLinkElement.setAttribute('id', id)
      })
    }
  }

  const isIE = () => {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
  }

  const onRippleChange = (e: any) => {
    PrimeReact.ripple = e.value
    setRipple(e.value)
  }

  const onDocumentClick = () => {
    if (!searchClick && searchActive) {
      onSearchHide()
    }

    if (!userMenuClick) {
      setTopbarUserMenuActive(false)
    }

    if (!notificationMenuClick) {
      setTopbarNotificationMenuActive(false)
    }

    if (!rightMenuClick) {
      setRightMenuActive(false)
    }

    if (!menuClick) {
      if (isSlim() || isHorizontal()) {
        setMenuActive(false)
      }

      if (overlayMenuActive || staticMenuMobileActive) {
        hideOverlayMenu()
      }

      unblockBodyScroll()
    }

    if (configActive && !configClick) {
      setConfigActive(false)
    }

    searchClick = false
    configClick = false
    userMenuClick = false
    rightMenuClick = false
    notificationMenuClick = false
    menuClick = false
  }

  const onMenuClick = () => {
    menuClick = true
  }

  const onMenuButtonClick = (event: any) => {
    menuClick = true
    setTopbarUserMenuActive(false)
    setTopbarNotificationMenuActive(false)
    setRightMenuActive(false)

    if (isOverlay()) {
      setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive)
    }

    if (isDesktop()) {
      setStaticMenuDesktopInactive(
        (prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive,
      )
    } else {
      setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive)
    }

    event.preventDefault()
  }

  const onMenuitemClick = (event: any) => {
    if (!event.item.items) {
      hideOverlayMenu()

      if (isSlim() || isHorizontal()) {
        setMenuActive(false)
      }
    }
  }

  const onRootMenuitemClick = () => {
    setMenuActive((prevMenuActive) => !prevMenuActive)
  }

  const onMenuThemeChange = (name: string) => {
    setMenuTheme('layout-sidebar-' + name)
  }

  const onMenuModeChange = (e: any) => {
    setMenuMode(e.value)
    if (e.value === 'static') {
      setStaticMenuDesktopInactive(false)
    }
  }

  const onTopbarUserMenuButtonClick = (event: MouseEvent) => {
    userMenuClick = true
    setTopbarUserMenuActive((prevTopbarUserMenuActive) => !prevTopbarUserMenuActive)
    hideOverlayMenu()

    event.preventDefault()
  }

  const onTopbarNotificationMenuButtonClick = (event: MouseEvent) => {
    notificationMenuClick = true
    setTopbarNotificationMenuActive(
      (prevTopbarNotificationMenuActive) => !prevTopbarNotificationMenuActive,
    )

    hideOverlayMenu()

    event.preventDefault()
  }

  const toggleSearch = () => {
    setSearchActive((prevSearchActive) => !prevSearchActive)
    searchClick = true
  }

  const onSearchClick = () => {
    searchClick = true
  }

  const onSearchHide = () => {
    setSearchActive(false)
    searchClick = false
  }

  const onRightMenuClick = () => {
    rightMenuClick = true
  }

  const onRightMenuButtonClick = (event: MouseEvent) => {
    rightMenuClick = true
    setRightMenuActive((prevRightMenuActive) => !prevRightMenuActive)
    hideOverlayMenu()
    event.preventDefault()
  }

  function onConfigClick(): void {
    configClick = true
  }

  const onConfigButtonClick = () => {
    setConfigActive((prevConfigActive) => !prevConfigActive)
    configClick = true
  }

  const hideOverlayMenu = () => {
    setOverlayMenuActive(false)
    setStaticMenuMobileActive(false)
    unblockBodyScroll()
  }

  const unblockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll')
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' ',
      )
    }
  }

  const isSlim = () => {
    return menuMode === 'slim'
  }

  const isHorizontal = () => {
    return menuMode === 'horizontal'
  }

  const isOverlay = () => {
    return menuMode === 'overlay'
  }

  const isDesktop = () => {
    return window.innerWidth > 1091
  }

  const containerClassName = classNames(
    'layout-wrapper',
    {
      'layout-overlay': menuMode === 'overlay',
      'layout-static': menuMode === 'static',
      'layout-slim': menuMode === 'slim',
      'layout-horizontal': menuMode === 'horizontal',
      'layout-sidebar-dim': colorScheme === 'dim',
      'layout-sidebar-dark': colorScheme === 'dark',
      'layout-overlay-active': overlayMenuActive,
      'layout-mobile-active': staticMenuMobileActive,
      'layout-static-inactive': staticMenuDesktopInactive && menuMode === 'static',
      'p-input-filled': inputStyle === 'filled',
      'p-ripple-disabled': !ripple,
    },
    colorScheme === 'light' ? menuTheme : '',
  )

  return (
    <div className={containerClassName} data-theme={colorScheme} onClick={onDocumentClick}>
      <Tooltip
        ref={copyTooltipRef}
        target='.block-action-copy'
        position='bottom'
        content='Copied to clipboard'
        event='focus'
      />

      <div className='layout-content-wrapper'>
        <AppTopbar
          meta={meta}
          topbarNotificationMenuActive={topbarNotificationMenuActive}
          topbarUserMenuActive={topbarUserMenuActive}
          onMenuButtonClick={onMenuButtonClick}
          onSearchClick={toggleSearch}
          onTopbarNotification={onTopbarNotificationMenuButtonClick}
          onTopbarUserMenu={onTopbarUserMenuButtonClick}
          onRightMenuClick={onRightMenuButtonClick}
          onRightMenuButtonClick={onRightMenuButtonClick}
          menu={menu}
          menuMode={menuMode}
          menuActive={menuActive}
          staticMenuMobileActive={staticMenuMobileActive}
          onMenuClick={onMenuClick}
          onMenuitemClick={onMenuitemClick}
          onRootMenuitemClick={onRootMenuitemClick}
        ></AppTopbar>

        <div className='layout-content'>
          <div className='layout-breadcrumb viewname' style={{ textTransform: 'uppercase' }}>
            <AppBreadcrumb meta={meta} />
          </div>

          <Routes>
            {/* private route */}
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/contacts' element={<Contacts />} />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/invoices'
                element={<Invoices setBreadCrumbInvoice={getBreadCrumbInvoice} />}
              />
              {/* <Route path='/user' element={<User />} />
              <Route path='/company' element={<Company />} /> */}
              <Route path='/settings' element={<Settings />} />
              <Route path='/invoices/manage' element={<InvoiceItems />} />
              <Route path='/invoice' element={<Invoice logoUrl={logoUrl} location={location} />} />
              <Route
                path='/codebook/entities/values'
                element={<CodeBooks setBreadCrumbName={getCodeBookBreadCrumb} />}
              />
              <Route path='/items' element={<Items />} />
              <Route path='bankaccounts' element={<BankAccounts />} />
              {/* restrict access for user role to the following pages*/}
              <Route element={<RestrictUserRoute />}>
                <Route path='admin' element={<Admin />} />
              </Route>
            </Route>
            <Route path='*' element={<Error />} />
          </Routes>
        </div>
        <AppFooter />
      </div>

      <AppRightMenu
        rightMenuActive={rightMenuActive}
        onRightMenuClick={onRightMenuClick}
      ></AppRightMenu>

      {window.location.pathname === NAVIGATE.SETTINGS ? (
        <AppConfig
          configActive={configActive}
          menuMode={menuMode}
          onMenuModeChange={onMenuModeChange}
          colorScheme={colorScheme}
          changeColorScheme={changeColorScheme}
          menuTheme={menuTheme}
          changeMenuTheme={changeMenuTheme}
          componentTheme={componentTheme}
          changeComponentTheme={changeComponentTheme}
          onConfigClick={onConfigClick}
          onConfigButtonClick={onConfigButtonClick}
          rippleActive={ripple}
          onRippleChange={onRippleChange}
          inputStyle={inputStyle}
          onInputStyleChange={onInputStyleChange}
        ></AppConfig>
      ) : null}

      <AppSearch
        searchActive={searchActive}
        onSearchClick={onSearchClick}
        onSearchHide={onSearchHide}
      />
    </div>
  )
}
export default App
