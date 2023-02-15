import { MutableRefObject, SetStateAction } from 'react'
import { BaseRequest } from './shared/types'

export type BankAccount = {
  bankAccountId: number
  bankId: number | null
  bankName: string | null
  accountNo: string | null
  swift: string | null
  iban: string | null
}

export type BankAccountRequest = {
  BankName?: string
  PageSize?: number
}

export type BankAccountProps = {
  bankAccounts: BankAccount[]
}

export type BankAccountManageProps = {
  bankAccount: BankAccount
  setBankAccount: (value: SetStateAction<BankAccount>) => void
  initialBankAccountValue: MutableRefObject<BankAccount>
}

export type BankAccountFilter = BaseRequest & {
  BankId?: number
  AccountNo?: string
  Swift?: string
  Iban?: string
}
