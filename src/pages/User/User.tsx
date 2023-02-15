import { forwardRef, useContext, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { useTranslation } from 'react-i18next'
import { ManagePageButtonsProps } from '../../interfaces/shared/types'
import { UserContext } from '../../context/HiveContext'

// TODO - refactor whole code - used just for testing tabs on the Settings Page
const User = forwardRef(function userFunction({ isView, setIsView }: ManagePageButtonsProps, ref) {
  const { t } = useTranslation()
  const { userAuth } = useContext(UserContext)
  const { handleSubmit } = useForm()

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }))

  const saveUserInfo = () => {
    setIsView(!isView)
  }

  return (
    <form id='hook-form' onSubmit={handleSubmit(saveUserInfo)}>
      <div className='col-12'>
        <div className='formgrid'>
          <div className='field col-12 lg:col-4 p-0'>
            <label>{t('contacts.email')}: </label>
            <InputText
              type='text'
              disabled={isView}
              value={userAuth.email}
              className='text-primary'
            />
          </div>
          <div className='field col-12 lg:col-4 p-0'>
            <label>{t('common.role')}: </label>
            <InputText type='text' disabled={isView} value={userAuth.role} />
          </div>
        </div>
      </div>
    </form>
  )
})

export default User
