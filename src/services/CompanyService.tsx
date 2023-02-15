import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { CompanyInfo } from '../interfaces/CompanyInterfaces'
import { API_PATHS } from '../utils/constants'

export const getCompanyInfo = (): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.COMPANY_GET)
}

export const manageCompanyInfo = (companyInfo: CompanyInfo): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.COMPANY_POST, companyInfo)
}

export const uploadCompanyPicture = (file: FormData): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.LOGO_UPLOAD, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const removeCompanyPicture = (): Promise<AxiosResponse> => {
  return customAxios.delete(API_PATHS.LOGO_REMOVE)
}
