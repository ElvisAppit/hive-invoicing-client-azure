import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { Contact, ContactsFilters } from '../interfaces/ContactInterfaces'
import { API_PATHS } from '../utils/constants'

export const createContact = (contact: Contact): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.CONTACTS, contact)
}

export const getContacts = (params?: ContactsFilters): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CONTACTS, {
    params: params,
  })
}

export const getContact = (id: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CONTACTS + id)
}

export const updateContact = (contact: Contact, id: number): Promise<AxiosResponse> => {
  return customAxios.put(API_PATHS.CONTACTS + id, contact)
}
