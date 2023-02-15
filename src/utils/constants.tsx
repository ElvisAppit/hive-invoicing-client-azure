import { t } from 'i18next'

//  Empty string
export const EMPTY_STRING = ''

//  URLs
export const CLIENT_CONFIRMATION_MAIL_URI = process.env
  .REACT_APP_CLIENT_CONFIRMATION_MAIL_URI as string
export const API_URL = process.env.REACT_APP_API_URL

//  Statuses
export const STATUS_TYPES = {
  INFO: 'info',
  WARN: 'warn',
  SUCCESS: 'success',
  ERROR: 'error',
}
export const STATUS_CODES = {
  SUCCESS: 200,
  ERROR: 400,
}

//  Auth
export const USER_AUTH_LOCAL_STORAGE = 'UserAuth'
export const ROLES = {
  SUPER_ADMIN: 'SuperAdministrator',
  USER: 'User',
}

//  CodeBook
export const CODEBOOK_ENTITIES = {
  INV_TYPE: 'INVTYPE',
  PAY_TERM: 'PAYTERM',
  TAX: 'TAX',
  PROD_TYPE: 'PRODTYPE',
  BANK: 'BANK',
  BANKACCOUNT: 'BANKACC',
  SEQ_TYPE: 'SEQTYPE',
}

//  Types
export const DATA_TYPE = ['string', 'int', 'decimal', 'datetime', 'bool']
export const DATA_TYPE_VALUES = {
  STRING: 'stringValue',
  INT: 'intValue',
  DECIMAL: 'decimalValue',
  DATETIME: 'datetime',
  BOOLEAN: 'boolValue',
}
export const INPUT_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  DATETIME: 'datetime-local',
  CHECKBOX: 'checkbox',
  FILE: 'file',
}

//  Common api paths
export const API_PATHS = {
  CODEBOOK: 'codebook/',
  CODEBOOK_ENTITIES: 'codebook/entities',
  CONTACTS: 'contacts/',
  COMPANY_GET: 'companies/current-user',
  COMPANY_POST: 'companies/manage',
  ITEMS: 'items/',
  INVOICES: 'invoices/',
  REPORT: 'invoices/report/',
  BANKACCOUNTS: 'bankaccounts/',
  LOGO_UPLOAD: 'companies/upload-logo',
  LOGO_REMOVE: 'companies/remove-logo',
  SEQNUMBERTYPE: 'sequencenumbers',
}

//  Navigate
export const NAVIGATE = {
  APP: '/',
  LOGIN: '/login',
  CODEBOOK_ENTITIES: '/codebook/entities',
  CODEBOOK_VALUES: '/codebook/entities/values',
  CODEBOOK_MANAGE: '/codebook/manage',
  CONTACTS: '/contacts',
  CONTACTS_MANAGE: '/contacts/manage',
  INVOICES: '/invoices',
  INVOICES_MANAGE: '/invoices/manage',
  COMPANY: '/company',
  ITEMS: '/items',
  ITEMS_MANAGE: '/items/manage',
  BACK: -1,
  BANKACCOUNT_MANAGE: '/bankaccounts/manage',
  BANKACCOUNTS: '/bankaccounts',
  USER_PAGE: '/user',
  SETTINGS: '/settings',
}

//  Request filters
export const REQUEST_FILTERS = {
  SORT_ACS: 'asc',
  SORT_DESC: 'desc',
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SORT_BY_NAME: 'Name',
  DEFAULT_SORT_BY_DATE: 'DateCreated',
}

//  Delays
export const SEARCH_DELAY = 500
export const FILTER_DELAY = 800
export const TOAST_DELAY = 3000

// Image allowed types
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpeg']

// Common toast messages
export const TOAST_MESSAGES = {
  INFO: t('common.info'),
  WARN: t('common.warning'),
  SUCCESSFUL: t('common.successful'),
  UNSUCCESSFUL: t('common.unsuccessful'),
}

// Rows per page
export const ROWS_PER_PAGE = [10, 20, 30]
