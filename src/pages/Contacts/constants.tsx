import { t } from 'i18next'

export const EMPTY_CONTACT = {
  contactId: 0,
  name: '',
  address: null,
  city: null,
  zip: null,
  country: null,
  phone: null,
  mobile: null,
  email: null,
  website: null,
  idNumber: null,
  taxNumber: null,
  isCompany: true,
}

export const CONTACT_TYPES = [
  { label: t('contacts.company'), value: true },
  { label: t('contacts.individual'), value: false },
]
