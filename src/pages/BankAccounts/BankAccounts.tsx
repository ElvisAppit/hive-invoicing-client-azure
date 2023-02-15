import React, { useState, useRef, useEffect, MouseEventHandler, ChangeEvent } from 'react'
import { t } from 'i18next'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Paginator, PaginatorPageState } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTablePFSEvent, DataTableSelectionChangeParams } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { classNames } from 'primereact/utils'
import { BankAccount, BankAccountFilter } from '../../interfaces/BankAccountInterfaces'
import { CodeBook } from '../../interfaces/CodeBookInterfaces'
import { DropdownItem, FieldsToUpdate, TableInfo } from '../../interfaces/shared/types'
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
} from '../../services/BankAccountsService'
import { deleteItemById } from '../../services/shared/CommonServices'
import { getCodeBookValues } from '../../services/CodeBookService'
import { EMPTY_BANK_ACCOUNT, EMPTY_BANK } from './constants'
import {
  API_PATHS,
  CODEBOOK_ENTITIES,
  FILTER_DELAY,
  REQUEST_FILTERS,
  ROWS_PER_PAGE,
  SEARCH_DELAY,
  STATUS_CODES,
} from '../../utils/constants'
import { emptyStringsToNull } from '../../utils/helpers'
import { successToast, errorToast } from '../../utils/ToastCommon'

function BankAccounts() {
  const toast = useRef<Toast>({} as Toast)
  const dt = useRef<DataTable>({} as DataTable) //
  const [bankAccount, setBankAccount] = useState<BankAccount>(EMPTY_BANK_ACCOUNT)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedBankAccounts, setSelectedBankAccounts] = useState<BankAccount[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [bankAccountDialog, setBankAccountDialog] = useState<boolean>(false)
  const [deleteBankAccountsDialog, setDeleteBankAccountsDialog] = useState<boolean>(false)
  const [filterDisplay, setfilterDisplay] = useState<boolean>(false)
  const [banks, setBanks] = useState<DropdownItem[]>()
  const [bankFilter, setBankFilter] = useState<DropdownItem>(EMPTY_BANK)
  const [searchValue, setSearchValue] = useState<string>()
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [filters, setFilters] = useState<BankAccountFilter>({
    SortBy: REQUEST_FILTERS.DEFAULT_SORT_BY_DATE,
    SortOrder: REQUEST_FILTERS.SORT_DESC,
  })
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    paginatorInfo: { rows: REQUEST_FILTERS.DEFAULT_PAGE_SIZE, first: 0 },
    sortInfo: { order: 1, field: 'BankId' },
  })
  const bank = EMPTY_BANK
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    getBankAccountsData(filters)
  }, [filters, editSwitcher])

  useEffect(() => {
    getBanks()
  }, [searchValue])

  const getBankAccountsData = (filters: BankAccountFilter) => {
    setLoading(true)
    getBankAccounts(filters).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setBankAccounts(response.data.data)
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

  const getBanks = () => {
    getCodeBookValues({
      EntityCodeName: CODEBOOK_ENTITIES.BANK,
      CodeBookValue: searchValue,
    }).then((res) =>
      setBanks(
        res.data.data.map((codeBook: CodeBook) => {
          return {
            id: codeBook.codeBookId,
            name: codeBook.name,
          }
        }),
      ),
    )
  }

  const toggleDisplayTableFilterRow = () => {
    setfilterDisplay(!filterDisplay)
  }

  const openNew = () => {
    setSearchValue('')
    setBankAccount(EMPTY_BANK_ACCOUNT)
    setSubmitted(false)
    setBankAccountDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setBankAccountDialog(false)
  }

  const hideDeleteBankAccountsDialog = () => {
    setDeleteBankAccountsDialog(false)
  }

  const validateBankAccount = () => {
    if (!bankAccount.accountNo) {
      return false
    }
    return true
  }

  const saveBankAccount = async () => {
    setSubmitted(true)

    if (!validateBankAccount()) return

    setLoading(true)
    emptyStringsToNull(bankAccount)

    if (bankAccount.bankAccountId) {
      await updateBankAccount(bankAccount, bankAccount.bankAccountId).then((response) => {
        if (response.status == STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('bankAccounts.bankAccountUpdated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    } else {
      await createBankAccount(bankAccount).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('bankAccounts.bankAccountCreated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    }
    setEditSwitcher(!editSwitcher)
    setSelectedBankAccounts([])
    setBankAccountDialog(false)
    setLoading(false)
  }

  const editBankAccount = (bankAccount: BankAccount) => {
    setSearchValue('')
    setBankAccount(bankAccount)
    setBankAccountDialog(true)
  }

  const confirmDeleteBankAccount = (bankAccount: BankAccount) => {
    setBankAccount(bankAccount)
    setSelectedBankAccounts([bankAccount])
    setDeleteBankAccountsDialog(true)
  }

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteBankAccountsDialog(true)
  }

  const deleteBankAccounts = () => {
    if (selectedBankAccounts.length) {
      selectedBankAccounts.forEach(async (bankAccount) => {
        await deleteItemById(bankAccount.bankAccountId, API_PATHS.BANKACCOUNTS).then((response) => {
          if (response.status === STATUS_CODES.SUCCESS) {
            setEditSwitcher(!editSwitcher)
          }
        })
      })
      toast.current.show(
        successToast(
          selectedBankAccounts.length === 1
            ? t('bankAccounts.bankAccountDeleted').toString()
            : t('bankAccounts.bankAccountsDeleted').toString(),
        ),
      )
    } else {
      toast.current.show(errorToast())
    }
    setSelectedBankAccounts([])
    setDeleteBankAccountsDialog(false)
  }

  const handleInput = (field: FieldsToUpdate) => {
    setBankAccount((prev: BankAccount) => {
      return {
        ...prev,
        ...field,
      }
    })
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
    e.originalEvent.stopPropagation()
    setSelectedBankAccounts(e.value)
    if (e.value.length === 1) {
      setBankAccount(e.value[0])
    }
  }

  const setTimeoutAndSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      setSearchValue(e.target.value.toLowerCase())
    }, SEARCH_DELAY)
  }

  const filterByBank = (e: DropdownChangeParams) => {
    if (!e.value) {
      setBankFilter(EMPTY_BANK)
    } else {
      setBankFilter({ id: e.value.id, name: e.value.name })
    }
    filterChange({ [e.target.name]: e.value ? e.value.id : null })
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
            disabled={!selectedBankAccounts.length}
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

  const bankBodyTemplate = (bankAccount: BankAccount) => {
    return (
      <>
        <span className='p-column-title'>{t('bankAccounts.bankName')}</span>
        {bankAccount.bankName}
      </>
    )
  }

  const bankOptionTemplate = (bank: DropdownItem) => {
    return <div>{bank.name}</div>
  }

  const selectedBankTemplate = (placeholder: string, name: string) => {
    if (name) {
      return <div>{name}</div>
    }
    return <span>{placeholder}</span>
  }

  const accountNoBodyTemplate = (bankAccount: BankAccount) => {
    return (
      <>
        <span className='p-column-title'>{t('bankAccounts.accountNo')}</span>
        {bankAccount.accountNo}
      </>
    )
  }

  const swiftBodyTemplate = (bankAccount: BankAccount) => {
    return (
      <>
        <span className='p-column-title'>{t('bankAccounts.swift')}</span>
        {bankAccount.swift}
      </>
    )
  }

  const ibanBodyTemplate = (bankAccount: BankAccount) => {
    return (
      <>
        <span className='p-column-title'>{t('bankAccounts.iban')}</span>
        {bankAccount.iban}
      </>
    )
  }

  const actionBodyTemplate = (bankAccount: BankAccount) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-text mt-2'
          onClick={() => confirmDeleteBankAccount(bankAccount)}
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

  const bankFilterTemplate = () => {
    return (
      <Dropdown
        value={bankFilter}
        name='bankId'
        options={banks}
        onChange={filterByBank}
        optionLabel='name'
        filter
        filterTemplate={inputDropdownFilterTemplate}
        emptyMessage={t('common.resultsNotFound')}
        resetFilterOnHide={true}
        onHide={() => setSearchValue('')}
        showClear={(bankFilter?.id as number) > 0 ? true : false}
        placeholder={t('bankAccounts.selectBank') as string}
      />
    )
  }

  const deleteBankAccountDialogFooter = (
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

  const bankAccountDialogFooter = (
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
        onClick={saveBankAccount}
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
            value={bankAccounts}
            selection={selectedBankAccounts}
            onSelectionChange={selectionChange}
            selectionMode='checkbox'
            rowHover={true}
            style={{ cursor: 'pointer' }}
            onRowClick={(e) => editBankAccount(e.data)}
            dataKey='bankAccountId'
            className='datatable-responsive'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} bankAccounts'
            emptyMessage={t('bankAccounts.noBankAccountsFound')}
            filterDisplay={filterDisplay ? 'row' : undefined}
            loading={loading}
            responsiveLayout='scroll'
            sortOrder={tableInfo.sortInfo.order}
            sortField={tableInfo.sortInfo.field}
            onSort={(e) => sortFilter(e)}
          >
            <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
            <Column
              field='BankId'
              header={t('bankAccounts.bankName')}
              body={bankBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={bankFilterTemplate}
              showFilterMenu={false}
              filterPlaceholder={t('search.byBank').toString()}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='AccountNo'
              header={t('bankAccounts.accountNo')}
              sortable
              filter={filterDisplay}
              filterElement={() =>
                inputFilterTemplate('AccountNo', t('search.byAccountNo').toString())
              }
              showFilterMenu={false}
              filterPlaceholder={t('search.byAccountNo').toString()}
              body={accountNoBodyTemplate}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Swift'
              header={t('bankAccounts.swift')}
              body={swiftBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Swift', t('search.bySwift').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.bySwift').toString()}
              headerStyle={{ width: '25%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Iban'
              header={t('bankAccounts.iban')}
              body={ibanBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Iban', t('search.byIban').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byIban').toString()}
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
            visible={bankAccountDialog}
            style={{ width: '768px' }}
            header={t('bankAccounts.viewBankAccount')}
            modal
            className='p-fluid'
            footer={bankAccountDialogFooter}
            onHide={hideDialog}
          >
            {/* banks */}
            <div className='dropdown-demo'>
              <label htmlFor='bankId'>{t('bankAccounts.bankName')}</label>
              <Dropdown
                value={bank}
                name='bankId'
                options={banks}
                onChange={(e) =>
                  handleInput({
                    [e.target.name]: e.value ? e.value.id : null,
                    bankName: e.value ? e.value.name : null,
                  })
                }
                optionLabel='name'
                filter
                filterTemplate={inputDropdownFilterTemplate}
                resetFilterOnHide={true}
                onHide={() => setSearchValue('')}
                emptyMessage={t('common.resultsNotFound')}
                showClear={bankAccount.bankId ? true : false}
                placeholder={t('bankAccounts.selectBank') as string}
                itemTemplate={bankOptionTemplate}
                valueTemplate={selectedBankTemplate(
                  t('bankAccounts.selectBank'),
                  bankAccount.bankName as string,
                )}
              />
            </div>
            {/* accountNo */}
            <div className='field'>
              <label htmlFor='accountNo'>{t('bankAccounts.accountNo')}</label>
              <InputText
                name='accountNo'
                value={(bankAccount.accountNo as string) || ''}
                onChange={(e) => handleInput({ [e.target.name]: e.target.value })}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !bankAccount.accountNo })}
              />
              {submitted && !bankAccount.accountNo && (
                <small className='p-invalid'>{t('bankAccounts.accountNoRequired')}</small>
              )}
            </div>

            {/* swift */}
            <div className='field'>
              <label htmlFor='swift'>{t('bankAccounts.swift')}</label>
              <InputText
                name='swift'
                value={(bankAccount.swift as string) || ''}
                onChange={(e) => handleInput({ [e.target.name]: e.target.value })}
                required
                autoFocus
              />
            </div>
            {/* iban */}
            <div className='field'>
              <label htmlFor='iban'>{t('bankAccounts.iban')}</label>
              <InputText
                name='iban'
                value={(bankAccount.iban as string) || ''}
                onChange={(e) => handleInput({ [e.target.name]: e.target.value })}
                required
                autoFocus
              />
            </div>
          </Dialog>
          <Dialog
            visible={deleteBankAccountsDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() =>
              deleteBankAccountDialogFooter(hideDeleteBankAccountsDialog, deleteBankAccounts)
            }
            onHide={hideDeleteBankAccountsDialog}
          >
            <div className='flex align-bankAccounts-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                {selectedBankAccounts.length === 1
                  ? t('common.defaultDeleteMessage') + ' ' + bankAccount.bankName
                  : t('common.defaultDeleteSelectedMessage')}
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default BankAccounts
