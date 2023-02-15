import { ResponseInfo } from '../../../interfaces/shared/types'
import { STATUS_TYPES } from '../../../utils/constants'

function Alert({ message, status }: ResponseInfo) {
  return message ? (
    <div className={`alert alert-${status == STATUS_TYPES.ERROR ? 'danger' : 'success'} mt-3 mb-0`}>
      {message}
    </div>
  ) : null
}

export default Alert
