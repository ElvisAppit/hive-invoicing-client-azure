import React, { useState, useRef, useEffect, ChangeEvent, MouseEventHandler } from 'react'
import { t } from 'i18next'
import { Dropdown } from 'primereact/dropdown'
import { Paginator, PaginatorPageState } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import { DataTable, DataTablePFSEvent } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { RadioButton, RadioButtonChangeParams } from 'primereact/radiobutton'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { classNames } from 'primereact/utils'
import { Contact, ContactsFilters } from '../../interfaces/ContactInterfaces'
import { TableInfo } from '../../interfaces/shared/types'
import { getContacts, createContact, updateContact } from '../../services/ContactsService'
import { deleteItemById } from '../../services/shared/CommonServices'
import { EMPTY_CONTACT, CONTACT_TYPES } from './constants'
import {
  API_PATHS,
  FILTER_DELAY,
  REQUEST_FILTERS,
  ROWS_PER_PAGE,
  STATUS_CODES,
} from '../../utils/constants'
import { errorToast, successToast } from '../../utils/ToastCommon'
import { emptyStringsToNull } from '../../utils/helpers'

function Contacts() {
  const toast = useRef<Toast>({} as Toast)
  const dt = useRef<DataTable>({} as DataTable)
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [contactDialog, setContactDialog] = useState<boolean>(false)
  const [deleteContactsDialog, setDeleteContactsDialog] = useState<boolean>(false)
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [filterDisplay, setfilterDisplay] = useState<boolean>(false)
  const [filters, setFilters] = useState<ContactsFilters>({
    SortBy: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME,
  })
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    paginatorInfo: { rows: REQUEST_FILTERS.DEFAULT_PAGE_SIZE, first: 0 },
    sortInfo: { order: 1, field: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME },
  })
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    getContactsData(filters)
  }, [filters, editSwitcher])

  const getContactsData = (filters: ContactsFilters) => {
    setLoading(true)
    getContacts(filters).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setContacts(response.data.data)
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

  const toggleDisplayTableFilterRow = () => {
    setfilterDisplay(!filterDisplay)
  }

  const openNew = () => {
    setContact(EMPTY_CONTACT)
    setSubmitted(false)
    setContactDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setContactDialog(false)
  }

  const validateContact = () => {
    if (!contact.name) {
      return false
    }

    return true
  }

  const saveContact = async () => {
    setSubmitted(true)

    if (!validateContact()) return

    emptyStringsToNull(contact)

    if (contact.contactId) {
      await updateContact(contact, contact.contactId).then((response) => {
        setLoading(true)
        if (response.status == STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('contacts.contactUpdated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    } else {
      await createContact(contact).then((response) => {
        setLoading(true)
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('contacts.contactCreated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    }
    setSelectedContacts([])
    setEditSwitcher(!editSwitcher)
    setContactDialog(false)
    setLoading(false)
  }

  const editContact = (contact: Contact) => {
    setContact(contact)
    setContactDialog(true)
  }

  const confirmDeleteSelected = () => {
    setDeleteContactsDialog(true)
  }

  const hideDeleteContactsDialog = () => {
    setContact(contact)
    setSelectedContacts([])
    setDeleteContactsDialog(false)
  }

  const confirmDeleteContacts = (contact: Contact) => {
    setContact(contact)
    setSelectedContacts([contact])
    setDeleteContactsDialog(true)
  }

  const deleteContacts = () => {
    if (selectedContacts) {
      selectedContacts.map(async (_contact) => {
        await deleteItemById(_contact.contactId, API_PATHS.CONTACTS).then((response) => {
          if (response.status === STATUS_CODES.SUCCESS) {
            setEditSwitcher(!editSwitcher)
          }
        })
      })
      toast.current.show(
        successToast(
          selectedContacts.length === 1
            ? t('contacts.contactDeleted').toString()
            : t('contacts.contactsDeleted').toString(),
        ),
      )
    } else {
      toast.current.show(errorToast())
    }
    setSelectedContacts([])
    setDeleteContactsDialog(false)
  }

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | RadioButtonChangeParams) => {
    setContact((prev: Contact) => {
      return {
        ...prev,
        [e.target.name]: e.target.type === 'radio' ? e.target.value === 'true' : e.target.value,
      }
    })
  }

  const filterChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        [name]: e.target.value,
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
            disabled={!selectedContacts.length}
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

  const nameBodyTemplate = (contact: Contact) => {
    return (
      <>
        <span className='p-column-title'>{t('contacts.contactName')}</span>
        {contact.name}
      </>
    )
  }

  const emailBodyTemplate = (contact: Contact) => {
    return (
      <>
        <span className='p-column-title'>{t('contacts.email')}</span>
        {contact.email}
      </>
    )
  }

  const addressBodyTemplate = (contact: Contact) => {
    return (
      <>
        <span className='p-column-title'>{t('contacts.address')}</span>
        {contact.address}
      </>
    )
  }

  const cityBodyTemplate = (contact: Contact) => {
    return (
      <>
        <span className='p-column-title'>{t('contacts.city')}</span>
        {contact.city}
      </>
    )
  }

  const typeBodyTemplate = (contact: Contact) => {
    const typeName = contact.isCompany ? t('contacts.company') : t('contacts.individual')
    return (
      <>
        <span className='p-column-title'>{t('contacts.type')}</span>
        {typeName}
      </>
    )
  }

  const actionBodyTemplate = (contact: Contact) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-text mt-2'
          onClick={() => confirmDeleteContacts(contact)}
        />
      </div>
    )
  }

  const inputFilterTemplate = (name: string, placeholder: string) => {
    return (
      <InputText
        style={{ width: '100%' }}
        className='ui-column-filter'
        onChange={(e) => filterChange(e, name)}
        placeholder={placeholder}
      />
    )
  }

  const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={CONTACT_TYPES}
        placeholder={t('common.selectType') as string}
        className='p-column-filter'
        onChange={(e) => {
          options.filterCallback(e.value)
          setFilters((prev) => ({
            ...prev,
            IsCompany: e.value,
          }))
        }}
      />
    )
  }

  const deleteContactDialogFooter = (
    hideDialog: MouseEventHandler<HTMLButtonElement>,
    deleteFunction: MouseEventHandler<HTMLButtonElement>,
  ) => (
    <>
      <Button
        label={t('common.no') as string}
        icon='pi pi-times'
        className='p-button-primary'
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

  const contactDialogFooter = (
    <>
      <Button
        label={t('common.cancel') as string}
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label={t('common.save') as string}
        icon='pi pi-check'
        className='p-button-primary'
        onClick={saveContact}
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
            value={contacts}
            selection={selectedContacts}
            onSelectionChange={(e) => {
              e.originalEvent.stopPropagation()
              setSelectedContacts(e.value)
            }}
            selectionMode='checkbox'
            rowHover={true}
            style={{ cursor: 'pointer' }}
            onRowClick={(e) => editContact(e.data as Contact)}
            dataKey='contactId'
            className='datatable-responsive'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} contacts'
            emptyMessage={t('contacts.noContactsFound')}
            filterDisplay={filterDisplay ? 'row' : undefined}
            loading={loading}
            responsiveLayout='scroll'
            sortOrder={tableInfo.sortInfo.order}
            sortField={tableInfo.sortInfo.field}
            onSort={(e) => sortFilter(e)}
          >
            <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
            <Column
              field='Name'
              header={t('contacts.contactName')}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Name', t('search.byName').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byName').toString()}
              body={nameBodyTemplate}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Email'
              header={t('contacts.email')}
              body={emailBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Email', t('search.byEmail').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byEmail').toString()}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Address'
              header={t('contacts.address')}
              body={addressBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Address', t('search.byAddress').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byAddress').toString()}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='City'
              header={t('contacts.city')}
              body={cityBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('City', t('search.byCity').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byCity').toString()}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='IsCompany'
              header={t('contacts.type')}
              sortable
              filterMenuStyle={{ width: '14rem' }}
              style={{ minWidth: '12rem' }}
              filter={filterDisplay}
              filterElement={typeFilterTemplate}
              body={typeBodyTemplate}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
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
            visible={contactDialog}
            style={{ width: '768px' }}
            header={t('contacts.contactList')}
            modal
            className='p-fluid'
            footer={contactDialogFooter}
            onHide={hideDialog}
          >
            {/* type */}
            <div className='field'>
              <label className='mb-3'>{t('contacts.type')}</label>
              <div className='formgrid grid'>
                <div className='field-radiobutton col'>
                  <RadioButton
                    inputId='isCompany'
                    name='isCompany'
                    value='true'
                    autoFocus
                    required
                    onChange={handleInput}
                    checked={contact.isCompany === true}
                  />
                  <label htmlFor='isCompany'>{t('contacts.company')}</label>
                </div>
                <div className='field-radiobutton col'>
                  <RadioButton
                    inputId='isCompany'
                    name='isCompany'
                    value='false'
                    autoFocus
                    required
                    onChange={handleInput}
                    checked={contact.isCompany === false}
                  />
                  <label htmlFor='isCompany'>{t('contacts.individual')}</label>
                </div>
              </div>
            </div>

            {/* name */}
            <div className='field'>
              <label htmlFor='name'>{t('common.name')}</label>
              <InputText
                name='name'
                value={(contact.name as string) || ''}
                onChange={handleInput}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !contact.name })}
              />
              {submitted && !contact.name && (
                <small className='p-invalid'>
                  {t('contacts.contact') + ' ' + t('common.name') + ' ' + t('common.required')}
                </small>
              )}
            </div>

            {/* address & city */}
            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='address'>{t('contacts.address')}</label>
                <InputText
                  name='address'
                  value={(contact.address as string) || ''}
                  onChange={handleInput}
                />
              </div>

              <div className='field col'>
                <label htmlFor='city'>{t('contacts.city')}</label>
                <InputText
                  name='city'
                  value={(contact.city as string) || ''}
                  onChange={handleInput}
                />
              </div>
            </div>

            {/* zip & country */}
            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='zip'>{t('contacts.zipCode')}</label>
                <InputText
                  name='zip'
                  value={(contact.zip as string) || ''}
                  onChange={handleInput}
                />
              </div>

              <div className='field col'>
                <label htmlFor='country'>{t('contacts.country')}</label>
                <InputText
                  name='country'
                  value={(contact.country as string) || ''}
                  onChange={handleInput}
                />
              </div>
            </div>

            {/* phone & mobile */}
            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='phone'>{t('contacts.phone')}:</label>
                <InputText
                  name='phone'
                  value={(contact.phone as string) || ''}
                  onChange={handleInput}
                />
              </div>

              <div className='field col'>
                <label htmlFor='mobile'>{t('contacts.mobile')}:</label>
                <InputText
                  name='mobile'
                  value={(contact.mobile as string) || ''}
                  onChange={handleInput}
                />
              </div>
            </div>

            {/* email & website */}
            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='email'>{t('contacts.email')}:</label>
                <InputText
                  name='email'
                  value={(contact.email as string) || ''}
                  onChange={handleInput}
                />
              </div>

              <div className='field col'>
                <label htmlFor='email'>{t('contacts.webSite')}:</label>
                <InputText
                  name='website'
                  value={(contact.website as string) || ''}
                  onChange={handleInput}
                />
              </div>
            </div>

            {/* idNumber & taxNumber */}
            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='idNumber'>{t('contacts.idNumber')}</label>
                <InputText
                  name='idNumber'
                  value={(contact.idNumber as string) || ''}
                  onChange={handleInput}
                  min={0}
                  step={1}
                />
              </div>

              <div className='field col'>
                <label htmlFor='taxNumber'>{t('contacts.taxNumber')}</label>
                <InputText
                  name='taxNumber'
                  value={(contact.taxNumber as string) || ''}
                  onChange={handleInput}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteContactsDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() => deleteContactDialogFooter(hideDeleteContactsDialog, deleteContacts)}
            onHide={hideDeleteContactsDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                {selectedContacts.length === 1
                  ? t('common.defaultDeleteMessage') + ' ' + selectedContacts[0].name + '?'
                  : t('common.defaultDeleteSelectedMessage')}
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Contacts
