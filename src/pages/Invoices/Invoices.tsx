import React, { useState, useRef, useEffect, MouseEventHandler, ChangeEvent } from 'react'
import { t } from 'i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Paginator, PaginatorPageState } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTablePFSEvent, DataTableSelectionChangeParams } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import {
  InvoiceBreadCrumbProps,
  InvoiceHeader,
  InvoicesFilters,
} from '../../interfaces/InvoiceInterfaces'
import { CodeBook } from '../../interfaces/CodeBookInterfaces'
import { Contact } from '../../interfaces/ContactInterfaces'
import { DropdownItem, FieldsToUpdate, TableInfo } from '../../interfaces/shared/types'
import { getInvoices } from '../../services/InvoicesService'
import { getContacts } from '../../services/ContactsService'
import { deleteItemById } from '../../services/shared/CommonServices'
import { EMPTY_INVOICE_HEADER, EMPTY_CONTACT } from './constants'
import {
  API_PATHS,
  FILTER_DELAY,
  NAVIGATE,
  REQUEST_FILTERS,
  ROWS_PER_PAGE,
  SEARCH_DELAY,
  STATUS_CODES,
} from '../../utils/constants'
import { errorToast, successToast } from '../../utils/ToastCommon'
import { prepareDateFormat } from '../../utils/helpers'

function Invoices({ setBreadCrumbInvoice }: InvoiceBreadCrumbProps) {
  const toast = useRef<Toast>({} as Toast)
  const dt = useRef<DataTable>({} as DataTable)
  const location = useLocation()
  const params = location.state as CodeBook //
  const [invoiceHeader, setInvoiceHeader] = useState<InvoiceHeader>(EMPTY_INVOICE_HEADER)
  const [invoiceHeaders, setInvoiceHeaders] = useState<InvoiceHeader[]>([])
  const [selectedInvoiceHeaders, setSelectedInvoiceHeaders] = useState<InvoiceHeader[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteInvoiceHeadersDialog, setDeleteInvoiceHeadersDialog] = useState<boolean>(false)
  const [filterDisplay, setfilterDisplay] = useState<boolean>(false)
  const [contacts, setContacts] = useState<DropdownItem[]>()
  const [contactFilter, setContactFilter] = useState<DropdownItem>(EMPTY_CONTACT)
  const [searchValue, setSearchValue] = useState<string>()
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [filters, setFilters] = useState<InvoicesFilters>({ InvoiceTypeId: params.codeBookId })
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    paginatorInfo: { rows: REQUEST_FILTERS.DEFAULT_PAGE_SIZE, first: 0 },
    sortInfo: { order: 1, field: 'InvoiceNumber' },
  })
  const navigate = useNavigate()
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    setFilters((prev: InvoicesFilters) => {
      return { ...prev, InvoiceTypeId: params.codeBookId }
    })
    setBreadCrumbInvoice(params.name)
  }, [params.codeBookId])

  useEffect(() => {
    getInovicesData(filters)
  }, [filters, editSwitcher])

  useEffect(() => {
    getContactsData()
  }, [searchValue])

  const getInovicesData = (filters: InvoicesFilters) => {
    setLoading(true)
    getInvoices(filters).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setInvoiceHeaders(response.data.data)
        setTableInfo((prev) => ({
          ...prev,
          paginatorInfo: { ...prev.paginatorInfo, totalRecords: response.data.totalRecords },
        }))
      } else {
        errorToast()
      }

      setLoading(false)
    })
  }

  const getContactsData = () => {
    getContacts({ Name: searchValue }).then((res) =>
      setContacts(
        res.data.data.map((contact: Contact) => {
          return {
            id: contact.contactId,
            name: contact.name,
          }
        }),
      ),
    )
  }

  const toggleDisplayTableFilterRow = () => {
    setfilterDisplay(!filterDisplay)
  }

  const openNew = () => {
    navigate(NAVIGATE.INVOICES_MANAGE, {
      state: { invoiceId: null, invoiceTypeId: params.codeBookId },
    })
  }

  const hideDeleteInvoiceHeaderDialog = () => {
    setDeleteInvoiceHeadersDialog(false)
  }

  const editInvoice = (invoiceHeader: InvoiceHeader) => {
    navigate(NAVIGATE.INVOICES_MANAGE, {
      state: { invoiceId: invoiceHeader.invoiceId, invoiceTypeId: params.codeBookId },
    })
  }

  const confirmDeleteInvoiceHeader = (invoiceHeader: InvoiceHeader) => {
    setInvoiceHeader(invoiceHeader)
    setSelectedInvoiceHeaders([invoiceHeader])
    setDeleteInvoiceHeadersDialog(true)
  }

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteInvoiceHeadersDialog(true)
  }

  const deleteInvoiceHeaders = () => {
    if (selectedInvoiceHeaders) {
      selectedInvoiceHeaders.forEach(async (invoice) => {
        await deleteItemById(invoice.invoiceId, API_PATHS.INVOICES).then((response) => {
          if (response.status === STATUS_CODES.SUCCESS) {
            setEditSwitcher(!editSwitcher)
          }
        })
      })
      toast.current.show(
        successToast(
          selectedInvoiceHeaders.length === 1
            ? t('invoices.invoiceDeleted').toString()
            : t('invoices.invoicesDeleted').toString(),
        ),
      )
    } else {
      toast.current.show(errorToast())
    }
    setSelectedInvoiceHeaders([])
    setDeleteInvoiceHeadersDialog(false)
  }

  const filterByContact = (e: DropdownChangeParams) => {
    if (!e.value) {
      setContactFilter(EMPTY_CONTACT)
    } else {
      setContactFilter({ id: e.value.id, name: e.value.name })
    }
    filterChange({ [e.target.name]: e.value ? e.value.id : null })
  }

  const filterChange = (field: FieldsToUpdate) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ...field,
      }))
    }, FILTER_DELAY)
  }

  const paginatorChange = (event: PaginatorPageState) => {
    setTableInfo((prev) => ({
      ...prev,
      paginatorInfo: { ...prev.paginatorInfo, rows: event.rows, first: event.first },
    }))
    setFilters((prev) => ({
      ...prev,
      PageSize: event.rows,
      PageNumber: event.page + 1,
    }))
  }

  const sortFilter = (e: DataTablePFSEvent) => {
    setTableInfo((prev) => ({
      ...prev,
      sortInfo: { ...prev.sortInfo, field: e.sortField, order: e.sortOrder },
    }))
    setFilters((prev) => ({
      ...prev,
      SortBy: e.sortField,
      SortOrder: e.sortOrder === 1 ? REQUEST_FILTERS.SORT_ACS : REQUEST_FILTERS.SORT_DESC,
    }))
  }

  const selectionChange = (e: DataTableSelectionChangeParams) => {
    setSelectedInvoiceHeaders(e.value)
    e.value.length === 1 ? setInvoiceHeader(e.value[0]) : null
  }

  const setTimeoutAndSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      setSearchValue(e.target.value.toLowerCase())
    }, SEARCH_DELAY)
  }

  const leftToolbarTemplate = () => {
    return (
      <>
        <div className='my-2'>
          <Button
            label={t('common.new').toString()}
            icon='pi pi-plus'
            className='p-button-primary mr-2'
            onClick={openNew}
          />
          <Button
            label={t('common.delete').toString()}
            icon='pi pi-trash'
            className='p-button p-button-outlined mr-2'
            onClick={confirmDeleteSelected}
            disabled={!selectedInvoiceHeaders.length}
          />
          <Button
            label={t('common.export').toString()}
            icon='pi pi-upload'
            className='p-button p-button-outlined'
            onClick={exportCSV}
          />
        </div>
      </>
    )
  }
  const rightToolbarTemplate = () => {
    return (
      <Button
        icon='pi pi-filter'
        className={!filterDisplay ? 'p-button-text p-c' : 'p-button-primary p-c'}
        onClick={toggleDisplayTableFilterRow}
      />
    )
  }

  const invoiceNumberBodyTemplate = (invoiceHeader: InvoiceHeader) => {
    return (
      <>
        <span className='p-column-title'>{t('invoices.invoiceNumber')}</span>
        {invoiceHeader.invoiceNumber}
      </>
    )
  }

  const contactOptionTemplate = (invoiceHeader: InvoiceHeader) => {
    return <div>{invoiceHeader.contactName}</div>
  }

  const salesDateBodyTemplate = (invoiceHeader: InvoiceHeader) => {
    return (
      <>
        <span className='p-column-title'>{t('invoices.saleDate')}</span>
        {prepareDateFormat(invoiceHeader.saleDate ? invoiceHeader.saleDate : '', true)}
      </>
    )
  }

  const validityDateBodyTemplate = (invoiceHeader: InvoiceHeader) => {
    return (
      <>
        <span className='p-column-title'>{t('invoices.validitiyDate')}</span>
        {prepareDateFormat(invoiceHeader.validityDate ? invoiceHeader.validityDate : '', true)}
      </>
    )
  }

  const totalBodyTemplate = (invoiceHeader: InvoiceHeader) => {
    return (
      <>
        <span className='p-column-title'>{t('invoices.total')}</span>
        {invoiceHeader.total}
      </>
    )
  }

  const actionBodyTemplate = (invoiceHeader: InvoiceHeader) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-text mt-2'
          onClick={() => confirmDeleteInvoiceHeader(invoiceHeader)}
        />
      </div>
    )
  }

  const inputFilterTemplate = (name: string, placeholder: string) => {
    return (
      <InputText
        style={{ width: '100%' }}
        className='ui-column-filter'
        onChange={(e) => filterChange({ [name]: e.target.value })}
        placeholder={placeholder}
      />
    )
  }

  const inputDropdownFilterTemplate = () => {
    return (
      <InputText
        type='text'
        onChange={setTimeoutAndSearchValue}
        style={{ width: '100%', height: '2rem' }}
      />
    )
  }

  const contactFilterTemplate = () => {
    return (
      <Dropdown
        value={contactFilter}
        name='contactId'
        options={contacts}
        onChange={filterByContact}
        optionLabel='name'
        filter
        resetFilterOnHide={true}
        onHide={() => setSearchValue('')}
        filterTemplate={inputDropdownFilterTemplate}
        emptyMessage={t('common.resultsNotFound')}
        showClear={(contactFilter.id as number) > 0 ? true : false}
        placeholder={t('invoices.selectContact') as string}
      />
    )
  }

  const deleteInvoiceHeaderDialogFooter = (
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
    <div className='grid crud-demo'>
      <div className='col-12'>
        <div className='card'>
          <Toast ref={toast} />
          <Toolbar
            className='mb-1 p-1'
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={invoiceHeaders}
            selection={selectedInvoiceHeaders}
            onSelectionChange={selectionChange}
            onRowClick={(e) => editInvoice(e.data)}
            dataKey='invoiceId'
            className='datatable-responsive'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} invoices'
            emptyMessage={t('invoices.noInvoicesFound')}
            filterDisplay={filterDisplay ? 'row' : undefined}
            loading={loading}
            responsiveLayout='scroll'
            sortOrder={tableInfo.sortInfo.order}
            sortField={tableInfo.sortInfo.field}
            onSort={(e) => sortFilter(e)}
          >
            <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
            <Column
              field='InvoiceNumber'
              header={t('invoices.invoiceNumber')}
              sortable
              filter={filterDisplay}
              filterElement={() =>
                inputFilterTemplate('InvoiceNumber', t('search.byInvoiceNumber').toString())
              }
              showFilterMenu={false}
              filterPlaceholder={t('search.byInvoiceNumber').toString()}
              body={invoiceNumberBodyTemplate}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='ContactId'
              header={t('invoices.contactName')}
              body={contactOptionTemplate}
              sortable
              filter={filterDisplay}
              filterElement={contactFilterTemplate}
              showFilterMenu={false}
              filterPlaceholder={t('search.byContantName').toString()}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='SaleDate'
              header={t('invoices.saleDate')}
              body={salesDateBodyTemplate}
              sortable
              filterPlaceholder={t('invoices.saleDateFrom').toString()}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='ValidityDate'
              header={t('invoices.validitiyDate')}
              body={validityDateBodyTemplate}
              sortable
              filterPlaceholder={t('invoices.saleDateTo').toString()}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Total'
              header={t('invoices.total')}
              body={totalBodyTemplate}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Paginator
            first={tableInfo.paginatorInfo.first}
            rows={tableInfo.paginatorInfo.rows}
            totalRecords={tableInfo.paginatorInfo.totalRecords}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={paginatorChange}
          ></Paginator>
          <Dialog
            visible={deleteInvoiceHeadersDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() =>
              deleteInvoiceHeaderDialogFooter(hideDeleteInvoiceHeaderDialog, deleteInvoiceHeaders)
            }
            onHide={hideDeleteInvoiceHeaderDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                {selectedInvoiceHeaders.length === 1
                  ? t('common.defaultDeleteMessage') + ' ' + invoiceHeader.invoiceNumber
                  : t('common.defaultDeleteSelectedMessage')}
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Invoices
