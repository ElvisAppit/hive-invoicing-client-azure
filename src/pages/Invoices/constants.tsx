import { t } from 'i18next'

export const EMPTY_INVOICE_HEADER = {
  invoiceId: 0,
  invoiceNumber: null,
  saleDate: null,
  validityDate: null,
  contactId: 0,
  contactName: null,
  invoiceTypeId: 0,
  invoiceTypeName: null,
  paymentTermId: 0,
  paymentTermName: null,
  total: 0,
  note: null,
  bankAccountId: 0,
  bankAccountName: null,
  fiscalNumber: null,
  referenceNumber: null,
}

export const EMPTY_CONTACT = {
  id: null,
  name: t('invoices.selectContact'),
}

export const EMPTY_INVOICE = {
  initInvoice: {
    header: {
      invoiceId: 0,
      invoiceNumber: null,
      saleDate: null,
      validityDate: null,
      contactId: null,
      contactName: null,
      invoiceTypeId: 0,
      invoiceTypeName: null,
      paymentTermId: null,
      paymentTermName: null,
      total: 0,
      note: null,
      bankAccountId: null,
      bankAccountName: null,
      fiscalNumber: null,
      referenceNumber: null,
    },
    items: [
      {
        invoiceId: 0,
        itemId: 0,
        itemName: null,
        description: null,
        quantity: 0,
        unitPrice: 0,
        discount: 0,
        total: 0,
        taxId: null,
        taxName: null,
        taxValue: 0,
        invoiceItemId: 0,
        isDeleted: false,
      },
    ],
  },
  initInoviceHeaderData: {
    invTypes: [],
    payTerms: [],
  },
}

export const EMPTY_ITEM = {
  id: null,
  name: t('items.selectItem'),
}

export const EMPTY_TAX = {
  id: null,
  name: t('codeBook.selectTax'),
}

export const EMPTY_BANKACCOUNT = {
  id: null,
  name: t('bankAccounts.selectBankAccount'),
}

export const EMPTY_PAYTERM = {
  id: null,
  name: t('invoices.selectPaymentTerm'),
}
