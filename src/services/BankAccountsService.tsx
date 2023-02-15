import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { BankAccount, BankAccountRequest } from '../interfaces/BankAccountInterfaces'
import { API_PATHS } from '../utils/constants'

export const createBankAccount = (bankAccount: BankAccount): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.BANKACCOUNTS, bankAccount)
}

export const getBankAccounts = (params?: BankAccountRequest): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.BANKACCOUNTS, {
    params: params,
  })
}

export const getBankAccount = (id: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.BANKACCOUNTS + id)
}

export const updateBankAccount = (bankAccount: BankAccount, id: number): Promise<AxiosResponse> => {
  return customAxios.put(API_PATHS.BANKACCOUNTS + id, bankAccount)
}
