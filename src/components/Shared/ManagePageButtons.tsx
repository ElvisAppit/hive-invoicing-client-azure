import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { t } from 'i18next'
import { ManagePageButtonsProps } from '../../interfaces/shared/types'
import { NAVIGATE } from '../../utils/constants'

const ManagePageButtons = ({
  isView,
  setIsView,
  tableId,
  cancelEdit,
  setDeleteDialogOpen,
  hookForm,
  navigateTo,
  navigateState,
}: ManagePageButtonsProps) => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>()

  return (
    <div className='buttons-manage-page'>
      <Button
        // icon='pi pi-pencil'
        type='button'
        label={t('common.edit').toString()}
        onClick={() => setIsView(!isView)}
        visible={isView && (tableId > 0 || tableId !== 0)}
      />
      <Button
        // icon='pi pi-save'
        label={t('common.save').toString()}
        type='submit'
        visible={!isView || !tableId}
        form={hookForm ? 'hook-form' : undefined}
        onSubmit={() => formRef.current && formRef.current.handleSubmit}
      />
      <Button
        // icon='pi pi-trash'
        type='button'
        label={t('common.delete').toString()}
        className='p-button-danger'
        visible={isView && tableId > 0}
        onClick={() => (setDeleteDialogOpen ? setDeleteDialogOpen(true) : null)}
      />
      <Button
        type='button'
        // icon='pi pi-times'
        label={isView ? t('common.close').toString() : t('common.cancel').toString()}
        className='p-button-text p-button-plain'
        aria-label='Cancel'
        onClick={
          isView
            ? () =>
                navigateTo
                  ? navigate(navigateTo, { state: navigateState })
                  : navigate(NAVIGATE.BACK)
            : cancelEdit
        }
      />
    </div>
  )
}
export default ManagePageButtons
