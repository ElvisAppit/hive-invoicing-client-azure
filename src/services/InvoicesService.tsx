import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { Invoice, InvoicesFilters } from '../interfaces/InvoiceInterfaces'
import { API_PATHS } from '../utils/constants'

export const createInvoice = (invoice: Invoice): Promise<AxiosResponse> => {
  return customAxios.post('invoices', invoice)
}

export const getInvoices = (filters: InvoicesFilters): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.INVOICES, { params: filters })
}

export const getInvoice = (invoiceId: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.INVOICES + invoiceId)
}

export const updateInvoice = (invoiceId: number, invoice: Invoice): Promise<AxiosResponse> => {
  return customAxios.put(API_PATHS.INVOICES + invoiceId, invoice)
}

export const deleteInvoice = (invoiceId: number): Promise<AxiosResponse> =>
  customAxios.delete(API_PATHS.INVOICES + invoiceId)

export const getReport = (invoiceId: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.REPORT + invoiceId, { responseType: 'blob' })
}
