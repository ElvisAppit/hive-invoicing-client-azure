import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/HiveContext'
import i18n from '../../i18n'
import { NAVIGATE, ROLES } from '../../utils/constants'

function Navbar() {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const languageChange = (e: string) => {
    i18n.changeLanguage(e)
    setIsDisabled(!isDisabled)
  }
  const { t } = useTranslation()

  const { userAuth } = useContext(UserContext)

  if (!userAuth.role) return <></>

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <div className='container-fluid'>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item mx-2'>
              <Link to='/'>{t('common.home')} </Link>
            </li>
            {userAuth.role == ROLES.USER || userAuth.role == ROLES.SUPER_ADMIN ? (
              <>
                <li className='nav-item mx-2'>
                  <Link to='/user'> {t('common.user')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.CONTACTS}> {t('contacts.contacts')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.INVOICES}> {t('invoices.invoices')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.CODEBOOK_ENTITIES}> {t('codeBook.codeBook')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.COMPANY}> {t('contacts.company')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.ITEMS}> {t('items.items')} </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link to={NAVIGATE.BANKACCOUNTS}> {t('bankAccounts.bankAccounts')} </Link>
                </li>
                <li className='nav-item float-end'>
                  <button onClick={() => languageChange('en')} disabled={!isDisabled}>
                    {t('common.english')}
                  </button>
                  <button onClick={() => languageChange('bs')} disabled={isDisabled}>
                    {t('common.bosnian')}
                  </button>
                </li>
              </>
            ) : null}

            {userAuth.role == ROLES.SUPER_ADMIN ? (
              <li className='nav-item mx-2'>
                <Link to='/admin'> Admin </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
