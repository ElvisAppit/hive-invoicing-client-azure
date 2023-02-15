import { t } from 'i18next'

export const EMPTY_BANK_ACCOUNT = {
  bankAccountId: 0,
  bankId: 0,
  bankName: null,
  accountNo: null,
  swift: null,
  iban: null,
}

export const EMPTY_BANK = {
  id: 0,
  name: t('bankAccounts.selectBank') as string,
}
