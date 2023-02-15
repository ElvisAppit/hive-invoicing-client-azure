import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { CodeBook } from './CodeBookInterfaces'
import { BaseRequest } from './shared/types'

export type Invoice = {
  header: InvoiceHeader
  items: InvoiceItem[]
}

export type InvoiceHeader = {
  invoiceId: number
  invoiceNumber: string | null
  saleDate: string | null
  validityDate: string | null
  contactId: number | null
  contactName: string | null
  invoiceTypeId: number
  invoiceTypeName: string | null
  paymentTermId: number | null
  paymentTermName: string | null
  total: number
  note: string | null
  bankAccountId: number | null
  bankAccountName: string | null
  fiscalNumber: string | null
  referenceNumber: string | null
}

export type InvoiceItem = {
  itemId: number
  invoiceId: number
  itemName: string | null
  description: string | null
  quantity: number
  unitPrice: number
  discount: number
  total: number
  taxId: number | null
  taxName: string | null
  taxValue: number
  isDeleted: boolean
  invoiceItemId: number
}

export type InvoiceHeaderData = {
  invTypes: CodeBook[]
  payTerms: CodeBook[]
}

export type InvoiceInfo = {
  invoiceId: number
  invoiceTypeId: number
}

export type InvoicesProps = {
  invoices: InvoiceHeader[]
}

export type InvoiceManageProps = {
  headerData: InvoiceHeaderData
  initialInvoice: MutableRefObject<Invoice>
  invoice: Invoice
  setInvoice: Dispatch<SetStateAction<Invoice>>
  addInvoiceItem(): void
  deleteInvoiceItem(index: number): void
}

export type InvoicesFilters = BaseRequest & {
  InvoiceNumber?: string
  ContactId?: number
  InvoiceTypeId?: number
  SaleDateFrom?: string
  SaleDateTo?: string
}

export type TaxValues = {
  taxValue: number
  taxName: string
}

export type InvoiceBreadCrumbProps = {
  setBreadCrumbInvoice(invoiceName: string): void
}
