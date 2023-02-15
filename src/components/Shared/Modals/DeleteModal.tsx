import 'bootstrap/dist/css/bootstrap.min.css'
import { ItemToDelete } from '../../../interfaces/shared/types'
import { deleteItemById } from '../../../services/shared/CommonServices'
import { useNavigate } from 'react-router-dom'
import { NAVIGATE } from '../../../utils/constants'
import { useTranslation } from 'react-i18next'

const DeleteModal = ({ id, tableName }: ItemToDelete) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div
      className='modal'
      id='modal'
      tabIndex={-1}
      data-show='true'
      role='dialog'
      aria-hidden='true'
    >
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{t('common.warning')}</h5>
            <button type='button' className='close' data-bs-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <p>{t('common.deleteWarning')}?</p>
          </div>
          <div className='modal-footer flex flex-row justify-center'>
            <button
              type='button'
              className='btn btn-danger'
              onClick={() => deleteItemById(id, tableName).then(() => navigate(NAVIGATE.BACK))}
              data-bs-dismiss='modal'
            >
              {t('common.delete')}
            </button>
            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
