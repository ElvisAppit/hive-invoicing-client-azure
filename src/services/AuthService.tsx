import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { EmailConfirmation, Login, Register } from '../interfaces/AuthInterfaces'

export const registerUser = (data: Register): Promise<AxiosResponse> => {
  return customAxios.post('account/registration', data)
}

export const emailConfirmation = ({ userId, code }: EmailConfirmation): Promise<AxiosResponse> => {
  return customAxios.get('account/emailconfirmation', {
    params: { userId, code },
  })
}

export const loginUser = (data: Login): Promise<AxiosResponse> => {
  return customAxios.post('account/token', data)
}
