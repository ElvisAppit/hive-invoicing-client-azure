import { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import i18next, { t } from 'i18next'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTablePFSEvent, DataTableSelectionChangeParams } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Paginator, PaginatorPageState } from 'primereact/paginator'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { classNames } from 'primereact/utils'
import { TableInfo } from '../../interfaces/shared/types'
import {
  CodeBook,
  CodeBookInfo,
  CodeBookFilters,
  CodeBookEntity,
  CodeBookBreadCrumbProps,
  SequenceNumber,
} from '../../interfaces/CodeBookInterfaces'
import { deleteItemById } from '../../services/shared/CommonServices'
import {
  createCodeBook,
  getCodeBookEntities,
  getCodeBooks,
  getSeqType,
  postSeqType,
  updateCodeBook,
} from '../../services/CodeBookService'
import {
  API_PATHS,
  CODEBOOK_ENTITIES,
  DATA_TYPE_VALUES,
  FILTER_DELAY,
  INPUT_TYPE,
  REQUEST_FILTERS,
  ROWS_PER_PAGE,
  STATUS_CODES,
} from '../../utils/constants'
import { errorToast, successToast } from '../../utils/ToastCommon'
import { EMPTY_SEQ_NUM_TYPE } from './constants'
import { emptyStringsToNull } from '../../utils/helpers'

const CodeBooks = ({ setBreadCrumbName }: CodeBookBreadCrumbProps) => {
  const dtCodeBooks = useRef<DataTable>({} as DataTable)
  const toast = useRef<Toast>({} as Toast)
  const location = useLocation()
  const codeBookInfo = location.state as CodeBookInfo
  const newCodeBook = {
    codeBookId: 0,
    name: '',
    codeBookEntityId: codeBookInfo.codeBookEntityId,
  }
  const [codeBookEntity, setCodeBookEntity] = useState<CodeBookEntity>({} as CodeBookEntity)
  const [codeBook, setCodeBook] = useState<CodeBook>(newCodeBook)
  const [codeBooks, setCodeBooks] = useState<CodeBook[]>([])
  const [selectedCodeBooks, setSelectedCodeBooks] = useState<CodeBook[]>([])
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [codeBookDialog, setCodeBookDialog] = useState<boolean>(false)
  const [seqNumberDialog, setSeqNumberDialog] = useState<boolean>(false)
  const [deleteCodeBooksDialog, setDeleteCodeBooksDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [filterDisplay, setfilterDisplay] = useState<boolean>(false)
  const [filters, setFilters] = useState<CodeBookFilters>({
    SortBy: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME,
    CodeBookEntityId: codeBookInfo.codeBookEntityId,
  })
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    paginatorInfo: { rows: REQUEST_FILTERS.DEFAULT_PAGE_SIZE, first: 0 },
    sortInfo: { order: 1, field: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME },
  })
  const [sequanceNumber, setSequanceNumber] = useState<SequenceNumber>(EMPTY_SEQ_NUM_TYPE)
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  // table types
  let dataType = ''
  let inputType = ''
  let inputStep = ''

  switch (codeBookInfo.dataType) {
    case 0:
      dataType = DATA_TYPE_VALUES.STRING
      inputType = INPUT_TYPE.TEXT
      break
    case 1:
      dataType = DATA_TYPE_VALUES.INT
      inputType = INPUT_TYPE.NUMBER
      break
    case 2:
      dataType = DATA_TYPE_VALUES.DECIMAL
      inputType = INPUT_TYPE.NUMBER
      inputStep = 'any'
      break
    case 3:
      dataType = DATA_TYPE_VALUES.DATETIME
      inputType = INPUT_TYPE.DATETIME
      break
    case 4:
      dataType = DATA_TYPE_VALUES.BOOLEAN
      inputType = INPUT_TYPE.CHECKBOX
  }

  useEffect(() => {
    setFilters((prev: CodeBookFilters) => {
      return { ...prev, CodeBookEntityId: codeBookInfo.codeBookEntityId, CodeBookValue: '' }
    })
    setfilterDisplay(false)

    if (codeBookInfo.codeBookEntityId) {
      getCodeBookEntities({ EntityCodeName: codeBookInfo.entityCodeName }).then((res) => {
        setCodeBookEntity(res.data.data[0])
        setBreadCrumbName(res.data.data[0].entityName)
      })
    }
  }, [i18next.language, codeBookInfo.codeBookEntityId])

  useEffect(() => {
    getCodeBookData(filters)
  }, [filters, editSwitcher])

  const getCodeBookData = (filters: CodeBookFilters) => {
    setLoading(true)
    getCodeBooks(filters).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setCodeBooks(response.data.data)
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

  const openNew = () => {
    setCodeBook(newCodeBook)
    setSubmitted(false)
    setCodeBookDialog(true)
  }

  const toggleDisplayTableFilterRow = () => {
    setfilterDisplay(!filterDisplay)
  }

  const hideDialog = () => {
    if (codeBookEntity.code !== CODEBOOK_ENTITIES.SEQ_TYPE) {
      setCodeBookDialog(false)
      setSubmitted(false)
    } else {
      setSeqNumberDialog(false)
    }
  }

  const hideDeleteCodeBooksDialog = () => {
    setDeleteCodeBooksDialog(false)
  }

  const validateCodeBook = () => {
    if (!codeBook.name || !codeBook[dataType]) {
      return false
    }
    return true
  }

  const saveCodeBook = async () => {
    setSubmitted(true)

    if (!validateCodeBook()) return

    setLoading(true)
    emptyStringsToNull(codeBook)

    if (codeBook.codeBookId) {
      await updateCodeBook(codeBook.codeBookId, codeBook).then((response) => {
        if (response.status == STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('codeBook.codeBook') + ' ' + t('common.updated')))
        } else {
          toast.current.show(errorToast(t('common.defaultErrorMessage').toString()))
        }
      })
    } else {
      await createCodeBook(codeBook).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('codeBook.codeBook') + ' ' + t('common.created')))
        } else {
          toast.current.show(errorToast(t('common.defaultErrorMessage').toString()))
        }
      })
    }
    setEditSwitcher(!editSwitcher)
    setCodeBookDialog(false)
    setLoading(false)
  }

  const getSeqTypeData = async (sequenceNumberTypeId: number) => {
    setLoading(true)

    await getSeqType({ SequenceNumberTypeId: sequenceNumberTypeId }).then((res) => {
      setSequanceNumber(res.data.item)
    })

    setSeqNumberDialog(true)
    setLoading(false)
  }

  const saveSeqNumberType = async () => {
    postSeqType(sequanceNumber).then((response) => {
      if (response.status == STATUS_CODES.SUCCESS) {
        toast.current.show(successToast(t('codeBook.codeBook') + ' ' + t('common.updated')))
      } else {
        toast.current.show(errorToast(t('common.defaultErrorMessage').toString()))
      }
    })
    setSeqNumberDialog(false)
  }

  const editCodeBook = (codeBook: CodeBook) => {
    setCodeBook(codeBook)
    codeBookEntity.code !== CODEBOOK_ENTITIES.SEQ_TYPE
      ? setCodeBookDialog(true)
      : getSeqTypeData(codeBook.codeBookId)
  }

  const confirmDeleteCodeBook = (codeBook: CodeBook) => {
    setCodeBook(codeBook)
    setSelectedCodeBooks([codeBook])
    setDeleteCodeBooksDialog(true)
  }

  const deleteCodeBooks = () => {
    if (selectedCodeBooks) {
      selectedCodeBooks.forEach(async (codeBook: CodeBook) => {
        await deleteItemById(codeBook.codeBookId, API_PATHS.CODEBOOK).then((response) => {
          if (response.status === STATUS_CODES.SUCCESS) {
            setEditSwitcher(!editSwitcher)
          }
        })
      })
      toast.current.show(
        successToast(
          selectedCodeBooks.length === 1
            ? (t('codeBook.codeBook') + ' ' + t('common.deleted')).toString()
            : (t('codeBook.codeBooks') + ' ' + t('common.deletedP')).toString(),
        ),
      )
    } else {
      toast.current.show(errorToast())
    }
    setDeleteCodeBooksDialog(false)
    setSelectedCodeBooks([])
  }

  const exportCSV = () => {
    dtCodeBooks.current.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteCodeBooksDialog(true)
  }

  const handleInputSeqType = (e: ChangeEvent<HTMLInputElement>) => {
    setSequanceNumber((prev: SequenceNumber) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCodeBook((prev: CodeBook) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  const selectionChanged = (e: DataTableSelectionChangeParams) => {
    e.originalEvent.stopPropagation()
    setSelectedCodeBooks(e.value)
    e.value.length == 1 ? setCodeBook(e.value[0]) : null
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
            visible={codeBookEntity.isEditable}
          />
          <Button
            label={t('common.delete').toString()}
            icon='pi pi-trash'
            className='p-button p-button-outlined mr-2'
            onClick={confirmDeleteSelected}
            disabled={!selectedCodeBooks.length}
            visible={codeBookEntity.isEditable}
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
        className='p-button-text p-c'
        onClick={toggleDisplayTableFilterRow}
      />
    )
  }

  const nameBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.entityName')}</span>
        {codeBook.name}
      </>
    )
  }

  const stringValueBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.value')}</span>
        {codeBook.stringValue}
      </>
    )
  }

  const dateTimeValueBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.value')}</span>
        {codeBook.dateTimeValue}
      </>
    )
  }

  const decimalValueBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.value')}</span>
        {codeBook.decimalValue ?? null}
      </>
    )
  }

  const boolValueBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.value')}</span>
        {codeBook.boolValue}
      </>
    )
  }

  const intValueBodyTemplate = (codeBook: CodeBook) => {
    return (
      <>
        <span className='p-column-title'>{t('codeBook.value')}</span>
        {codeBook.intValue}
      </>
    )
  }

  const actionBodyTemplate = (codeBook: CodeBook) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-text mt-2'
          onClick={() => confirmDeleteCodeBook(codeBook)}
          visible={codeBookEntity.isEditable}
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

  const deleteCodeBookDialogFooter = (
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

  const codeBookDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button
        label='Save'
        icon='pi pi-check'
        className='p-button-primary'
        onClick={
          codeBookEntity.code !== CODEBOOK_ENTITIES.SEQ_TYPE ? saveCodeBook : saveSeqNumberType
        }
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
            ref={dtCodeBooks}
            value={codeBooks}
            selection={selectedCodeBooks}
            onSelectionChange={selectionChanged}
            selectionMode='checkbox'
            rowHover={true}
            style={{ cursor: 'pointer' }}
            onRowClick={(e) => editCodeBook(e.data)}
            dataKey='codeBookId'
            className='datatable-responsive'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} code books'
            emptyMessage={t('codeBook.codeBook') + ' ' + t('common.notFound')}
            filterDisplay={filterDisplay ? 'row' : undefined}
            loading={loading}
            responsiveLayout='scroll'
            sortOrder={tableInfo.sortInfo.order}
            sortField={tableInfo.sortInfo.field}
            onSort={(e) => sortFilter(e)}
          >
            <Column
              selectionMode='multiple'
              headerStyle={{ width: '4%', minWidth: '4rem' }}
            ></Column>
            <Column
              field='Name'
              header={t('common.name')}
              sortable
              filter={filterDisplay}
              filterElement={() =>
                inputFilterTemplate('CodeBookValue', t('search.byName').toString())
              }
              showFilterMenu={false}
              filterPlaceholder={t('search.byName').toString()}
              body={nameBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='stringValue'
              hidden={dataType !== DATA_TYPE_VALUES.STRING}
              header={t('codeBook.value')}
              sortable
              showFilterMenu={false}
              filterPlaceholder={t('search.byValue').toString()}
              body={stringValueBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='dateTimeValue'
              hidden={dataType !== DATA_TYPE_VALUES.DATETIME}
              header={t('codeBook.value')}
              sortable
              showFilterMenu={false}
              filterPlaceholder={t('search.byValue').toString()}
              body={dateTimeValueBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='decimalValue'
              hidden={dataType !== DATA_TYPE_VALUES.DECIMAL}
              header={t('codeBook.value')}
              sortable
              showFilterMenu={false}
              filterPlaceholder={t('search.byValue').toString()}
              body={decimalValueBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='boolValue'
              hidden={dataType !== DATA_TYPE_VALUES.BOOLEAN}
              header={t('codeBook.value')}
              sortable
              showFilterMenu={false}
              filterPlaceholder={t('search.byValue').toString()}
              body={boolValueBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='intValue'
              hidden={dataType !== DATA_TYPE_VALUES.INT}
              header={t('codeBook.value')}
              sortable
              showFilterMenu={false}
              filterPlaceholder={t('search.byValue').toString()}
              body={intValueBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ width: '4%', minWidth: '4rem' }}
              style={{ textAlign: 'right' }}
            ></Column>
          </DataTable>

          <Paginator
            first={tableInfo.paginatorInfo.first}
            rows={tableInfo.paginatorInfo.rows}
            totalRecords={tableInfo.paginatorInfo.totalRecords}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={paginatorChange}
          ></Paginator>

          <Dialog
            visible={codeBookDialog}
            style={{ width: '580px' }}
            header={t('codeBook.codeBook')}
            modal
            className='p-fluid '
            footer={codeBookDialogFooter}
            onHide={hideDialog}
          >
            {/* name */}
            <div className='field'>
              <label htmlFor='name'>{t('common.name')}</label>
              <InputText
                name='name'
                value={codeBook.name}
                onChange={handleInput}
                className={classNames({ 'p-invalid': submitted && !codeBook.name })}
                required
                autoFocus
              />
            </div>
            <div className='field'>
              <label htmlFor={dataType}>{t('common.value')}</label>
              <InputText
                step={inputStep}
                type={inputType}
                name={dataType}
                value={codeBook[dataType] || ''}
                checked={codeBook[dataType] || false}
                onChange={handleInput}
                className={classNames({ 'p-invalid': submitted && !codeBook.name })}
                required
                disabled={!codeBookEntity.isEditable}
              />
            </div>
            {submitted && !codeBook.name && (
              <small className='p-invalid'>
                {t('codeBook.codeBook') + ' ' + t('common.name') + ' ' + t('common.required')}
              </small>
            )}
          </Dialog>

          <Dialog
            visible={seqNumberDialog}
            style={{ width: '580px' }}
            header={codeBookEntity.entityName + ' / ' + codeBook.name}
            modal
            className='p-fluid '
            footer={codeBookDialogFooter}
            onHide={hideDialog}
          >
            <div className='field'>
              <label htmlFor='startNumber'>{t('codeBook.startNumber')}</label>
              <InputText
                name='startNumber'
                value={sequanceNumber.startNumber}
                disabled
                required
                autoFocus
              />
            </div>
            <div className='field'>
              <label htmlFor='endNumber'>{t('codeBook.endNumber')}</label>
              <InputText
                name='endNumber'
                value={sequanceNumber.endNumber}
                disabled
                required
                autoFocus
              />
            </div>
            <div className='field'>
              <label htmlFor='lastNumber'>{t('codeBook.lastNumber')}</label>
              <InputText
                type='number'
                name='lastNumber'
                value={sequanceNumber.lastNumber}
                onChange={handleInputSeqType}
                required
                autoFocus
              />
            </div>
            <div className='field'>
              <label htmlFor='validYear'>{t('codeBook.validYear')}</label>
              <InputText
                name='validYear'
                value={sequanceNumber.validYear}
                disabled
                required
                autoFocus
              />
            </div>
            <div className='field'>
              <label htmlFor='format'>{t('codeBook.format')}</label>
              <InputText
                name='format'
                value={(sequanceNumber.format as string) || ''}
                onChange={handleInputSeqType}
                required
                autoFocus
              />
              <small>{t('codeBook.formatMessage')}</small>
              <br />
              <small>{t('codeBook.fomatExamples')}</small>
            </div>
          </Dialog>

          <Dialog
            visible={deleteCodeBooksDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() => deleteCodeBookDialogFooter(hideDeleteCodeBooksDialog, deleteCodeBooks)}
            onHide={hideDeleteCodeBooksDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                {selectedCodeBooks.length === 1
                  ? t('common.defaultDeleteMessage') + ' ' + codeBook.name + '?'
                  : t('common.defaultDeleteSelectedMessage')}
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default CodeBooks
