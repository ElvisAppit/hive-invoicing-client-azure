import { t } from 'i18next'
import { ToastSeverityType } from 'primereact/toast'
import { EMPTY_STRING, STATUS_TYPES, TOAST_DELAY, TOAST_MESSAGES } from './constants'

export const infoToast = (detail?: string) => {
  return {
    severity: STATUS_TYPES.INFO as ToastSeverityType,
    summary: TOAST_MESSAGES.INFO,
    detail: detail === EMPTY_STRING ? t('common.defaultInfoMessage') : detail,
    life: TOAST_DELAY,
  }
}

export const warnToast = (detail?: string) => {
  return {
    severity: STATUS_TYPES.WARN as ToastSeverityType,
    summary: TOAST_MESSAGES.WARN,
    detail: detail === EMPTY_STRING ? t('common.defaultWarnMessage') : detail,
    life: TOAST_DELAY,
  }
}

export const successToast = (detail?: string) => {
  return {
    severity: STATUS_TYPES.SUCCESS as ToastSeverityType,
    summary: TOAST_MESSAGES.SUCCESSFUL,
    detail: detail === EMPTY_STRING ? t('common.defaultSuccessMessage') : detail,
    life: TOAST_DELAY,
  }
}

export const errorToast = (detail?: string) => {
  return {
    severity: STATUS_TYPES.ERROR as ToastSeverityType,
    summary: TOAST_MESSAGES.UNSUCCESSFUL,
    detail: detail === EMPTY_STRING ? t('common.defaultErrorMessage') : detail,
    life: TOAST_DELAY,
  }
}
