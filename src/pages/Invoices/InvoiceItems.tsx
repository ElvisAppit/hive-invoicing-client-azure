import React, {
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import i18next, { t } from 'i18next'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dialog } from 'primereact/dialog'
import ManagePageButtons from '../../components/Shared/ManagePageButtons'
import { getCodeBookValues } from '../../services/CodeBookService'
import { getBankAccounts } from '../../services/BankAccountsService'
import { getContacts } from '../../services/ContactsService'
import { createInvoice, getReport, updateInvoice, getInvoice } from '../../services/InvoicesService'
import { getItems } from '../../services/ItemsService'
import { deleteItemById } from '../../services/shared/CommonServices'
import { BankAccount } from '../../interfaces/BankAccountInterfaces'
import { Invoice, InvoiceInfo, InvoiceItem, TaxValues } from '../../interfaces/InvoiceInterfaces'
import { CodeBook } from '../../interfaces/CodeBookInterfaces'
import { Contact } from '../../interfaces/ContactInterfaces'
import { Item } from '../../interfaces/ItemInterfaces'
import { DropdownItem, FieldsToUpdate } from '../../interfaces/shared/types'
import {
  EMPTY_BANKACCOUNT,
  EMPTY_CONTACT,
  EMPTY_ITEM,
  EMPTY_TAX,
  EMPTY_INVOICE,
  EMPTY_PAYTERM,
} from './constants'
import {
  API_PATHS,
  CODEBOOK_ENTITIES,
  EMPTY_STRING,
  NAVIGATE,
  SEARCH_DELAY,
  STATUS_CODES,
} from '../../utils/constants'
import { emptyStringsToNull, prepareDateFormat, round2Decimals } from '../../utils/helpers'
import { errorToast, successToast } from '../../utils/ToastCommon'

const InvoiceItems = () => {
  const toast = useRef<Toast>({} as Toast)
  const location = useLocation()
  const navigate = useNavigate()
  const params = location.state as InvoiceInfo
  const initialInvoice = useRef<Invoice>({} as Invoice)
  const [invoice, setInvoice] = useState<Invoice>(EMPTY_INVOICE.initInvoice)
  const [contacts, setContacts] = useState<DropdownItem[]>([])
  const [taxes, setTaxes] = useState<DropdownItem[]>([])
  const [items, setItems] = useState<DropdownItem[]>([])
  const [bankAccounts, setBankAccounts] = useState<DropdownItem[]>([])
  const [payTerms, setPayTerms] = useState<DropdownItem[]>([])
  const [groupedTaxValues, setGroupedTaxValues] = useState<TaxValues[]>([])
  const [totalBeforeTax, setTotalBeforeTax] = useState<number>(invoice.header.total)
  const [total, setTotal] = useState<number>()
  const [isView, setIsView] = useState<boolean>(true)
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState<boolean>(false)
  const contact = EMPTY_CONTACT
  const tax = EMPTY_TAX
  const item = EMPTY_ITEM
  const bankAccount = EMPTY_BANKACCOUNT
  const payTerm = EMPTY_PAYTERM

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    setInvoiceHeader({ invoiceTypeId: params.invoiceTypeId })
    searchContacts('')
    searchTaxes('')
    searchItems('')
    searchBankAccounts('')
    searchPaymentTerms('')
  }, [])

  useEffect(() => {
    setTotalBeforeTax(sumInoviceItems)
    groupTaxValues()
    setTotal(sumTotal)
  }, [invoice.items])

  useEffect(() => {
    if (params.invoiceId) {
      getInovicesData(params.invoiceId)
    }
  }, [i18next.language, editSwitcher])

  const getInovicesData = (invoiceId: number) => {
    getInvoice(invoiceId).then((response) => {
      setInvoice(response.data)
      initialInvoice.current = response.data
    })
  }

  const searchContacts = (searchValue: string) =>
    getContacts({
      Name: searchValue,
    }).then((res) =>
      setContacts(
        res.data.data.map((contact: Contact) => {
          return {
            id: contact.contactId,
            name: contact.name,
          }
        }),
      ),
    )

  const searchTaxes = (searchValue: string) =>
    getCodeBookValues({
      EntityCodeName: CODEBOOK_ENTITIES.TAX,
      CodeBookValue: searchValue,
    }).then((res) => {
      setTaxes(
        res.data.data.map((codeBook: CodeBook) => {
          return {
            id: codeBook.codeBookId,
            name: codeBook.name,
            amount: codeBook.decimalValue,
          }
        }),
      )
    })

  const searchPaymentTerms = (searchValue: string) =>
    getCodeBookValues({
      EntityCodeName: CODEBOOK_ENTITIES.PAY_TERM,
      CodeBookValue: searchValue,
    }).then((res) => {
      setPayTerms(
        res.data.data.map((codeBook: CodeBook) => {
          return {
            id: codeBook.codeBookId,
            name: codeBook.name,
            amount: codeBook.intValue,
          }
        }),
      )
    })

  const searchItems = (searchValue: string) =>
    getItems({
      Name: searchValue,
    }).then((res) => {
      setItems(
        res.data.data.map((item: Item) => {
          return {
            id: item.itemId,
            name: item.name,
            amount: item.price,
          }
        }),
      )
    })

  const searchBankAccounts = (searchValue: string) =>
    getBankAccounts({
      BankName: searchValue,
    }).then((res) => {
      setBankAccounts(
        res.data.data.map((bankAccount: BankAccount) => {
          return {
            id: bankAccount.bankAccountId,
            name: bankAccount.bankName + ' - ' + bankAccount.accountNo,
          }
        }),
      )
    })

  const addInvoiceItem = () => {
    setInvoice((current: Invoice) => ({
      ...current,
      items: [
        ...current.items,
        {
          ...EMPTY_INVOICE.initInvoice.items[0],
        },
      ],
    }))
  }

  const saveInvoice = (event?: FormEvent<HTMLFormElement>) => {
    emptyStringsToNull(invoice.header)

    invoice.items.forEach((item) => {
      emptyStringsToNull(item)
    })

    event?.preventDefault()
    if (invoice.header.invoiceId === 0) {
      createInvoice(invoice).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('invoices.invoiceCreated').toString()))
          setEditSwitcher(!editSwitcher)
          navigate(NAVIGATE.INVOICES_MANAGE, {
            state: {
              invoiceId: response.data.header.invoiceId,
              invoiceTypeId: params.invoiceTypeId,
            },
          })
        } else {
          toast.current.show(errorToast())
        }
      })
    } else {
      updateInvoice(invoice.header.invoiceId, invoice).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('invoices.invoiceUpdate').toString()))
          setEditSwitcher(!editSwitcher)
        } else {
          toast.current.show(errorToast())
        }
        setIsView(true)
      })
    }
  }

  const deleteInvoice = () => {
    deleteItemById(invoice.header.invoiceId, API_PATHS.INVOICES).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setDeleteInvoiceDialog(false)
        toast.current.show(successToast(t('invoices.invoiceDeleted').toString()))
        navigate(NAVIGATE.BACK)
      } else {
        errorToast()
      }
    })
  }

  const deleteInvoiceItem = (index: number) => {
    if (invoice.header.invoiceId === 0 || invoice.items[index].invoiceItemId === 0) {
      setInvoice((current: Invoice) => ({
        ...current,
        items: current.items.filter((item, i) => i !== index),
      }))
    } else {
      invoice.items[index].isDeleted = true // refaktorisat
      updateInvoice(invoice.header.invoiceId, invoice).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('invoices.invoiceItemDeleted').toString()))
          setEditSwitcher(!editSwitcher)
        } else {
          toast.current.show(errorToast())
        }
      })
    }
  }

  const setInvoiceItem = (updateFields: FieldsToUpdate, index: number) => {
    setInvoice((prev: Invoice) => {
      const item = { ...prev.items[index], ...updateFields }
      const items = [...prev.items]
      items[index] = item
      return {
        ...prev,
        items,
      }
    })
  }

  const setInvoiceHeader = (updateFields: FieldsToUpdate) => {
    setInvoice((prev) => ({
      ...prev,
      header: { ...prev.header, ...updateFields },
    }))
  }

  const cancelEdit = () => {
    setInvoice(initialInvoice.current)
    setIsView(true)
  }

  const printInvoice = (invoiceId: number) => {
    getReport(invoiceId).then((response) => {
      const fileURL = URL.createObjectURL(response.data)
      const pdfWindow = window.open()
      pdfWindow ? (pdfWindow.location.href = fileURL) : null
    })
  }

  const sumInoviceItems = (): number => {
    return invoice.items.reduce((accumulator, currentValue) => {
      accumulator += currentValue.total
      return accumulator
    }, 0)
  }

  const sumTotal = (): number => {
    return (
      invoice.items
        .filter((x) => x.taxId)
        .map((invoiceItem: InvoiceItem) => {
          return {
            taxValue: invoiceItem.total * (1 + invoiceItem.taxValue / 100) - invoiceItem.total,
            taxName: invoiceItem.taxName,
          }
        })
        .reduce((accumulator, currentValue) => {
          accumulator += round2Decimals(currentValue.taxValue)
          return accumulator
        }, 0) +
      invoice.items.reduce((accumulator, currentValue) => {
        accumulator += currentValue.total
        return accumulator
      }, 0)
    )
  }

  const groupTaxValues = () => {
    const helper: any = {}
    setGroupedTaxValues(
      invoice.items
        .filter((x) => x.taxId)
        .map((invoiceItem: InvoiceItem) => {
          return {
            taxValue: invoiceItem.total * (1 + invoiceItem.taxValue / 100) - invoiceItem.total,
            taxName: invoiceItem.taxName,
          }
        })
        .reduce(function (r: TaxValues[], o) {
          const key = o.taxName || ''

          if (!helper[key]) {
            helper[key] = Object.assign({}, o)
            r.push(helper[key])
          } else {
            helper[key].taxValue += o.taxValue
          }
          return r
        }, []),
    )
  }

  const hideDeleteInvoiceDialog = () => {
    setDeleteInvoiceDialog(false)
  }

  const setTimeoutAndSearchValue = (
    e: ChangeEvent<HTMLInputElement>,
    searchDropdown: (searchValue: string) => Promise<void>,
  ) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      searchDropdown(e.target.value.toLowerCase())
    }, SEARCH_DELAY)
  }

  const inputDropdownFilterTemplate = (searchDropdown: (searchValue: string) => Promise<void>) => {
    return (
      <InputText
        type='text'
        onChange={(e) => setTimeoutAndSearchValue(e, searchDropdown)}
        style={{ width: '100%', height: '2rem' }}
      />
    )
  }

  const itemOptionTemplate = (item: DropdownItem) => {
    return <div>{item.name}</div>
  }

  const selectedOptionTemplate = (placeholder: string, selectedName: string) => {
    if (selectedName) {
      return <div>{selectedName}</div>
    }
    return <span>{placeholder}</span>
  }

  const deleteInvoiceDialogFooter = (
    hideDialog: MouseEventHandler<HTMLButtonElement>,
    deleteFunction: MouseEventHandler<HTMLButtonElement>,
  ) => (
    <>
      <Button
        label={t('common.no') as string}
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label={t('common.yes') as string}
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteFunction}
      />
    </>
  )

  return (
    <div>
      <form onSubmit={saveInvoice}>
        {/* MANAGE BUTTONS */}
        <div className='flex justify-content-between align-content-center min-w-max '>
          <ManagePageButtons
            isView={isView}
            setIsView={setIsView}
            tableId={invoice.header.invoiceId}
            cancelEdit={cancelEdit}
            setDeleteDialogOpen={setDeleteInvoiceDialog}
            navigateTo={NAVIGATE.INVOICES}
            navigateState={{
              codeBookId: params.invoiceTypeId,
              name: invoice.header.invoiceTypeName,
            }}
          />
          {/* PRINT BUTTON */}
          <Button
            type='button'
            label='Print'
            // icon='pi pi-print'
            onClick={() => printInvoice(invoice.header.invoiceId)}
            visible={isView && invoice.header.invoiceId > 0}
            className='buttons-manage-page'
          ></Button>
        </div>
        <Toast ref={toast} />

        {/* invoice cars min-width for mobile */}
        <div className='card' style={{ minWidth: '768px' }}>
          {/* bill to */}
          <div className='col-12'>
            <div className='grid formgrid'>
              <div className='col-12 md:col-6 lg:col-3 xl:col-3'>
                <div className='field'>
                  {/* title */}
                  <div className='text-l font-bold uppercase pt-1 pb-4'>
                    {t('invoices.billTo')}:
                  </div>
                  {/* contact name */}
                  <label htmlFor='contactId' className='invoice-label'>
                    {t('invoices.contactName')}:
                  </label>
                  <Dropdown
                    id='contactId'
                    value={contact}
                    disabled={invoice.header.invoiceId ? isView : false}
                    name='contactId'
                    options={contacts}
                    onChange={(e: DropdownChangeParams) => {
                      setInvoiceHeader({
                        [e.target.name]: e.value ? e.value.id : null,
                        contactName: e.value ? e.value.name : null,
                      })
                    }}
                    optionLabel='name'
                    filter
                    filterTemplate={inputDropdownFilterTemplate(searchContacts)}
                    resetFilterOnHide={true}
                    onHide={() => searchContacts('')}
                    emptyMessage={t('common.resultsNotFound')}
                    showClear={invoice.header.contactId ? true : false}
                    placeholder={t('invoices.selectContact') as string}
                    itemTemplate={itemOptionTemplate}
                    valueTemplate={selectedOptionTemplate(
                      t('invoices.selectContact'),
                      invoice.header.contactName || EMPTY_STRING,
                    )}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className='field'>
                  {/* bankaccount */}
                  <label htmlFor='bankAccountId'>{t('bankAccounts.viewBankAccount')}:</label>

                  <Dropdown
                    inputId='bankAccountId'
                    value={bankAccount}
                    disabled={invoice.header.invoiceId ? isView : false}
                    name='bankAccountId'
                    options={bankAccounts}
                    onChange={(e: DropdownChangeParams) => {
                      setInvoiceHeader({
                        [e.target.name]: e.value ? e.value.id : null,
                        bankAccountName: e.value ? e.value.name : null,
                      })
                    }}
                    optionLabel='name'
                    filter
                    filterTemplate={inputDropdownFilterTemplate(searchBankAccounts)}
                    resetFilterOnHide={true}
                    onHide={() => searchBankAccounts('')}
                    emptyMessage={t('common.resultsNotFound')}
                    showClear={invoice.header.bankAccountId ? true : false}
                    placeholder={t('bankAccounts.selectBankAccount') as string}
                    itemTemplate={itemOptionTemplate}
                    valueTemplate={selectedOptionTemplate(
                      t('bankAccounts.selectBankAccount'),
                      invoice.header.bankAccountName || EMPTY_STRING,
                    )}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className='col-12 md:col-3 lg:col-3 lg:col-offset-3 pt-6'>
                {/* sale date calendar */}
                <div className='field '>
                  <label htmlFor='saleDate'>{t('invoices.saleDate')}:</label>
                  <Calendar
                    id='saleDate'
                    showIcon
                    disabled={invoice.header.invoiceId ? isView : false}
                    name='saleDate'
                    onChange={(e) => {
                      setInvoiceHeader({
                        [e.target.name]: prepareDateFormat(e.value as string),
                      })
                    }}
                    placeholder={
                      invoice.header.saleDate
                        ? prepareDateFormat(invoice.header.saleDate, true)
                        : (t('invoices.saleDate') as string)
                    }
                    dateFormat='dd/mm/yy'
                    style={{ width: '100%' }}
                  ></Calendar>
                </div>
                {/* validity date calendar */}
                <div className='field '>
                  <label htmlFor='validityDate'>{t('common.dueDate')}:</label>
                  <Calendar
                    id='validityDate'
                    style={{ width: '100%' }}
                    showIcon
                    disabled={invoice.header.invoiceId ? isView : false}
                    name='validityDate'
                    onChange={(e) =>
                      setInvoiceHeader({
                        [e.target.name]: prepareDateFormat(e.value as string),
                      })
                    }
                    dateFormat='dd/mm/yy'
                    placeholder={
                      invoice.header.validityDate
                        ? prepareDateFormat(invoice.header.validityDate, true)
                        : (t('invoices.validitiyDate') as string)
                    }
                  ></Calendar>
                </div>
                <div className='field '>
                  <label htmlFor='payTerm'> {t('common.or')}</label>

                  {/* payterm */}
                  <Dropdown
                    id='payTerm'
                    value={payTerm}
                    style={{ width: '100%' }}
                    name='paymentTermId'
                    disabled={invoice.header.invoiceId ? isView : false}
                    options={payTerms}
                    onChange={(e: DropdownChangeParams) => {
                      setInvoiceHeader({
                        [e.target.value]: e.value ? e.value.id : null,
                        paymentTermName: e.value ? e.value.name : null,
                      })
                    }}
                    filter
                    filterTemplate={inputDropdownFilterTemplate(searchPaymentTerms)}
                    resetFilterOnHide={true}
                    onHide={() => searchPaymentTerms('')}
                    emptyMessage={t('common.resultsNotFound')}
                    showClear={invoice.header.paymentTermId ? true : false}
                    placeholder={t('invoices.selectPaymentTerm') as string}
                    itemTemplate={itemOptionTemplate}
                    valueTemplate={selectedOptionTemplate(
                      t('invoices.selectPaymentTerm'),
                      invoice.header.paymentTermName || EMPTY_STRING,
                    )}
                  />
                </div>
              </div>

              <div className='col-12 md:col-3 lg:col-3 pt-6'>
                {/* invoice number */}
                <div className='field '>
                  <label htmlFor='invoiceNumber'>{t('invoices.invoiceNumber')}:</label>
                  <InputText
                    id='invoiceNumber'
                    type='text'
                    name='invoiceNumber'
                    value={invoice.header.invoiceNumber || EMPTY_STRING}
                    onChange={(e) => setInvoiceHeader({ [e.target.name]: e.target.value })}
                    disabled
                  />
                </div>

                {/* fiscal number */}
                <div className='field '>
                  <label htmlFor='fiscalNumber'>{t('invoices.fiscalNumber')}:</label>
                  <InputText
                    id='fiscalNumber'
                    type='text'
                    name='fiscalNumber'
                    value={invoice.header.fiscalNumber || EMPTY_STRING}
                    onChange={(e) => setInvoiceHeader({ [e.target.name]: e.target.value })}
                    disabled={invoice.header.invoiceId ? isView : false}
                  />
                </div>

                {/* reference number */}
                <div className='field '>
                  <label htmlFor='referenceNumber'>{t('invoices.referenceNumber')}:</label>
                  <InputText
                    id='referenceNumber'
                    type='text'
                    name='referenceNumber'
                    value={invoice.header.referenceNumber || ''}
                    onChange={(e) => setInvoiceHeader({ [e.target.name]: e.target.value })}
                    disabled={invoice.header.invoiceId ? isView : false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className='table-divider-top'></div>

          {/* items */}
          <div className='table-responsive'>
            <table className='table min-w-full py-2 px-4'>
              <thead>
                <tr className='text-left'>
                  <th>{t('items.item')}</th>
                  <th>{t('invoices.description')}</th>
                  <th>{t('items.price')}</th>
                  <th>{t('invoices.quantity')}</th>
                  <th>{t('invoices.discount')}</th>
                  <th>{t('invoices.tax')}</th>
                  <th className='text-right'>{t('invoices.subtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items &&
                  invoice.items.map((invoiceItem: InvoiceItem, index: number) => (
                    <tr key={index} style={{ cursor: 'pointer' }}>
                      <td>
                        {/* invoice id */}
                        <input
                          value={invoice.header.invoiceId}
                          name='invoiceId'
                          required
                          readOnly
                          hidden
                        />
                        {/* item name */}
                        <Dropdown
                          style={{ width: '100%' }}
                          value={item}
                          name='itemId'
                          disabled={invoice.header.invoiceId ? isView : false}
                          options={items}
                          onChange={(e: DropdownChangeParams) => {
                            setInvoiceItem(
                              {
                                [e.target.name]: e.value ? e.value.id : null,
                                itemName: e.value ? e.value.name : null,
                                unitPrice: e.value ? e.value.amount : 0,
                                description: e.value ? e.value.name : EMPTY_STRING,
                                quantity: 1,
                                total: e.value
                                  ? e.value.amount
                                  : 0 * invoiceItem.quantity * (1 - invoiceItem.discount / 100),
                              },
                              index,
                            )
                          }}
                          optionLabel='name'
                          filter
                          filterTemplate={inputDropdownFilterTemplate(searchItems)}
                          resetFilterOnHide={true}
                          onHide={() => searchItems('')}
                          emptyMessage={t('common.resultsNotFound')}
                          showClear={invoice.items[index].itemId ? true : false}
                          placeholder={t('items.selectItem') as string}
                          itemTemplate={itemOptionTemplate}
                          valueTemplate={selectedOptionTemplate(
                            t('items.selectItem'),
                            invoice.items[index].itemName || EMPTY_STRING,
                          )}
                        />
                      </td>
                      {/* descripton */}
                      <td>
                        <InputText
                          style={{ width: '100%' }}
                          type='text'
                          name='description'
                          value={invoiceItem.description || EMPTY_STRING}
                          onChange={(e) =>
                            setInvoiceItem({ [e.target.name]: e.target.value }, index)
                          }
                          disabled={invoice.header.invoiceId ? isView : false}
                        />
                      </td>
                      {/* unit price */}
                      <td>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={invoiceItem.unitPrice}
                          required
                          disabled={invoice.header.invoiceId ? isView : false}
                          onChange={(e) => {
                            setInvoiceItem(
                              {
                                unitPrice: e.value as number,
                                total:
                                  ((e.value as number) ? (e.value as number) : 0) *
                                  invoiceItem.quantity *
                                  (1 - invoiceItem.discount / 100),
                              },
                              index,
                            )
                          }}
                        />
                      </td>
                      {/* quantity */}
                      <td>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={invoiceItem.quantity}
                          required
                          disabled={invoice.header.invoiceId ? isView : false}
                          onChange={(e) => {
                            setInvoiceItem(
                              {
                                quantity: e.value as number,
                                total:
                                  ((e.value as number) ? (e.value as number) : 0) *
                                  invoiceItem.unitPrice *
                                  (1 - invoiceItem.discount / 100),
                              },
                              index,
                            )
                          }}
                        />
                      </td>
                      {/* discount*/}
                      <td>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={invoiceItem.discount}
                          disabled={invoice.header.invoiceId ? isView : false}
                          onChange={(e) => {
                            setInvoiceItem(
                              {
                                discount: e.value as number,
                                total:
                                  invoiceItem.unitPrice *
                                  invoiceItem.quantity *
                                  (1 - ((e.value as number) ? (e.value as number) : 0) / 100),
                              },
                              index,
                            )
                          }}
                        />
                      </td>
                      {/* tax */}
                      <td>
                        <Dropdown
                          style={{ width: '100%', textAlign: 'left' }}
                          disabled={invoice.header.invoiceId ? isView : false}
                          value={tax}
                          name='taxId'
                          options={taxes}
                          onChange={(e: DropdownChangeParams) => {
                            const tax = e.value ? e.value.amount : 0
                            setInvoiceItem(
                              {
                                [e.target.name]: e.value ? e.value.id : null,
                                taxName: e.value ? e.value.name : null,
                                taxValue: tax,
                              },
                              index,
                            )
                          }}
                          optionLabel='name'
                          filter
                          filterTemplate={inputDropdownFilterTemplate(searchTaxes)}
                          resetFilterOnHide={true}
                          onHide={() => searchTaxes('')}
                          emptyMessage={t('common.resultsNotFound')}
                          showClear={invoice.items[index].taxId ? true : false}
                          placeholder={t('codeBook.selectTax') as string}
                          itemTemplate={itemOptionTemplate}
                          valueTemplate={selectedOptionTemplate(
                            t('codeBook.selectTax'),
                            invoice.items[index].taxName || EMPTY_STRING,
                          )}
                        />
                      </td>
                      {/* subtotal */}
                      <td>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={invoiceItem.total}
                          disabled
                          onChange={(e) => {
                            setInvoiceItem({ total: e.value as number }, index)
                          }}
                          inputClassName='text-right'
                        />
                      </td>
                      <td>
                        {/* delete button */}
                        <Button
                          icon='pi pi-trash'
                          className='p-button-text mt-2'
                          type='button'
                          onClick={() => deleteInvoiceItem(index)}
                          visible={!isView || !invoice.header.invoiceId}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* button add item */}
          <Button
            type='button'
            className='p-button-primary p-button-sm ml-4'
            label={t('invoices.addProduct').toString()}
            // icon='pi pi-plus'
            onClick={() => addInvoiceItem()}
            visible={!isView || invoice.header.invoiceId < 1}
          />

          {/* divider */}
          <div className='table-divider-top'></div>

          <div className='col-12'>
            <div className='grid formgrid'>
              <div className='col-12 sm:col-4 md:col-6 lg:col-6'>
                {/* note */}
                <InputTextarea
                  name='note'
                  rows={4}
                  disabled={invoice.header.invoiceId ? isView : false}
                  value={invoice.header.note || ''}
                  maxLength={2000}
                  onChange={(e) => setInvoiceHeader({ [e.target.name]: e.target.value })}
                  placeholder={t('invoices.enterNote') as string}
                  className='w-75'
                ></InputTextarea>
              </div>

              {/* total calculation */}
              <div className='col-12 sm:col-8 md:col-6 lg:col-4 lg:col-offset-2 border-300 pr-5'>
                <div className='flex col-12 mb-3'>
                  {/* total before taxes */}
                  <label className='text-l uppercase mr-5' style={{ width: '50%' }}>
                    {t('invoices.totalBeforeTaxes')}:
                  </label>
                  <label className='text-l text-right' style={{ width: '50%' }}>
                    {totalBeforeTax}
                  </label>
                </div>
                {/* taxes */}
                {groupedTaxValues.map((groupedTaxValues: TaxValues, index: number) => (
                  <div
                    key={index}
                    style={{ cursor: 'pointer' }}
                    className='flex col-12 mb-3 border-300'
                  >
                    <label className='text-l uppercase  mr-5' style={{ width: '50%' }}>
                      {index === 0 ? t('invoices.tax') + ':' : null}
                    </label>
                    <label className='text-l' style={{ width: '25%' }}>
                      {groupedTaxValues.taxName}
                    </label>
                    <label className='text-l text-right' style={{ width: '25%' }}>
                      {round2Decimals(groupedTaxValues.taxValue).toString()}
                    </label>
                  </div>
                ))}
                {/* total */}
                <div className='flex col-12 mb-3 pt-1 border-top-1 border-300 bg-blue-50'>
                  <label
                    className='text-l text-primary uppercase font-bold mr-5'
                    style={{ width: '50%' }}
                  >
                    {t('invoices.total')}:
                  </label>
                  <label
                    className='text-l text-primary font-bold text-right'
                    style={{ width: '50%' }}
                  >
                    {round2Decimals(total as number).toString()}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <Dialog
            visible={deleteInvoiceDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() => deleteInvoiceDialogFooter(hideDeleteInvoiceDialog, deleteInvoice)}
            onHide={hideDeleteInvoiceDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>{t('common.defaultDeleteMessage')}</span>
            </div>
          </Dialog>
        </div>
      </form>
    </div>
  )
}

export default InvoiceItems
