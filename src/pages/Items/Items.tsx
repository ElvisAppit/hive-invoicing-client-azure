import React, { useState, useRef, useEffect, MouseEventHandler, ChangeEvent } from 'react'
import { t } from 'i18next'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Paginator, PaginatorPageState } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTablePFSEvent, DataTableSelectionChangeParams } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { classNames } from 'primereact/utils'
import { Item, ItemFilters } from '../../interfaces/ItemInterfaces'
import { CodeBook } from '../../interfaces/CodeBookInterfaces'
import { DropdownItem, FieldsToUpdate, TableInfo } from '../../interfaces/shared/types'
import { getItems, createItem, updateItem } from '../../services/ItemsService'
import { getCodeBookValues } from '../../services/CodeBookService'
import { deleteItemById } from '../../services/shared/CommonServices'
import { EMPTY_ITEM, EMPTY_PRODUCT_TYPE } from './constants'
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
import { errorToast, successToast } from '../../utils/ToastCommon'

function Items() {
  const toast = useRef<Toast>({} as Toast)
  const dt = useRef<DataTable>({} as DataTable) //
  const [item, setItem] = useState<Item>(EMPTY_ITEM)
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [itemDialog, setItemDialog] = useState<boolean>(false)
  const [deleteItemsDialog, setDeleteItemsDialog] = useState<boolean>(false)
  const [filterDisplay, setfilterDisplay] = useState<boolean>(false)
  const [productTypes, setProductTypes] = useState<DropdownItem[]>()
  const [productTypeFilter, setProductTypeFilter] = useState<DropdownItem>(EMPTY_PRODUCT_TYPE)
  const [searchValue, setSearchValue] = useState<string>()
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [filters, setFilters] = useState<ItemFilters>({
    SortBy: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME,
  })
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    paginatorInfo: { rows: REQUEST_FILTERS.DEFAULT_PAGE_SIZE, first: 0 },
    sortInfo: { order: 1, field: REQUEST_FILTERS.DEFAULT_SORT_BY_NAME },
  })
  const productType = EMPTY_PRODUCT_TYPE

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  useEffect(() => {
    getItemsData(filters)
    getProductTypes()
  }, [filters, editSwitcher])

  useEffect(() => {
    getProductTypes()
  }, [searchValue])

  const getItemsData = (filters: ItemFilters) => {
    setLoading(true)
    getItems(filters).then((response) => {
      if (response.status === STATUS_CODES.SUCCESS) {
        setItems(response.data.data)
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

  const getProductTypes = () => {
    getCodeBookValues({
      EntityCodeName: CODEBOOK_ENTITIES.PROD_TYPE,
      CodeBookValue: searchValue,
    }).then((res) =>
      setProductTypes(
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
    setItem(EMPTY_ITEM)
    setSubmitted(false)
    setItemDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setItemDialog(false)
  }

  const hideDeleteItemsDialog = () => {
    setDeleteItemsDialog(false)
  }

  const validateItem = () => {
    if (!item.name || item.price < 0) {
      return false
    }
    return true
  }

  const saveItem = async () => {
    setSubmitted(true)

    if (!validateItem()) return

    setLoading(true)
    emptyStringsToNull(item)

    if (item.itemId) {
      await updateItem(item, item.itemId).then((response) => {
        if (response.status == STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('items.itemUpdated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    } else {
      await createItem(item).then((response) => {
        if (response.status === STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('items.itemCreated').toString()))
        } else {
          toast.current.show(errorToast())
        }
      })
    }
    setEditSwitcher(!editSwitcher)
    setSelectedItems([])
    setItemDialog(false)
    setLoading(false)
  }

  const editItem = (item: Item) => {
    setSearchValue('')
    setItem(item)
    setItemDialog(true)
  }

  const confirmDeleteItem = (item: Item) => {
    setItem(item)
    setSelectedItems([item])
    setDeleteItemsDialog(true)
  }

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true)
  }

  const deleteItems = () => {
    if (selectedItems) {
      selectedItems.forEach(async (item) => {
        await deleteItemById(item.itemId, API_PATHS.ITEMS).then((response) => {
          if (response.status === STATUS_CODES.SUCCESS) {
            setEditSwitcher(!editSwitcher)
          }
        })
      })
      toast.current.show(
        successToast(
          selectedItems.length === 1
            ? t('items.itemDeleted').toString()
            : t('items.itemsDeleted').toString(),
        ),
      )
    } else {
      toast.current.show(errorToast())
    }
    setSelectedItems([])
    setDeleteItemsDialog(false)
  }

  const handleInput = (field: FieldsToUpdate) => {
    setItem((prev: Item) => {
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
    setSelectedItems(e.value)
    if (e.value.length === 1) {
      setItem(e.value[0])
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

  const filterByProductType = (e: DropdownChangeParams) => {
    if (!e.value) {
      setProductTypeFilter(EMPTY_PRODUCT_TYPE)
    } else {
      setProductTypeFilter({ id: e.value.id, name: e.value.name })
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
            disabled={!selectedItems.length}
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

  const productTypeOptionTemplate = (productType: DropdownItem) => {
    return <div>{productType.name}</div>
  }

  const selectedProductTypeTemplate = (placeholder: string, name: string) => {
    if (name) {
      return <div>{name}</div>
    }
    return <span>{placeholder}</span>
  }

  const nameBodyTemplate = (item: Item) => {
    return (
      <>
        <span className='p-column-title'>{t('items.item')}</span>
        {item.name}
      </>
    )
  }

  const productTypeBodyTemplate = (item: Item) => {
    return (
      <>
        <span className='p-column-title'>{t('items.productType')}</span>
        {item.productTypeName}
      </>
    )
  }

  const priceBodyTemplate = (item: Item) => {
    return (
      <>
        <span className='p-column-title'>{t('contacts.address')}</span>
        {item.price}
      </>
    )
  }

  const actionBodyTemplate = (item: Item) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-text mt-2'
          onClick={() => confirmDeleteItem(item)}
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

  const productTypeFilterTemplate = () => {
    return (
      <Dropdown
        value={productTypeFilter}
        name='productTypeId'
        options={productTypes}
        onChange={filterByProductType}
        optionLabel='name'
        filter
        resetFilterOnHide={true}
        onHide={() => setSearchValue('')}
        filterTemplate={inputDropdownFilterTemplate}
        emptyMessage={t('common.resultsNotFound')}
        showClear={(productTypeFilter.id as number) > 0 ? true : false}
        placeholder={t('items.selectProductType') as string}
      />
    )
  }

  const deleteItemDialogFooter = (
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

  const itemDialogFooter = (
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
        onClick={saveItem}
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
            value={items}
            selection={selectedItems}
            onSelectionChange={selectionChange}
            selectionMode='checkbox'
            rowHover={true}
            style={{ cursor: 'pointer' }}
            onRowClick={(e) => editItem(e.data)}
            dataKey='itemId'
            className='datatable-responsive'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} items'
            emptyMessage={t('items.noItemsFound')}
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
              header={t('items.item')}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Name', t('search.byName').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byName').toString()}
              body={nameBodyTemplate}
              headerStyle={{ width: '33%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='ProductTypeId'
              header={t('items.productType')}
              body={productTypeBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={productTypeFilterTemplate}
              showFilterMenu={false}
              filterPlaceholder={t('search.byProductType').toString()}
              headerStyle={{ width: '33%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='Price'
              header={t('items.price')}
              body={priceBodyTemplate}
              sortable
              filter={filterDisplay}
              filterElement={() => inputFilterTemplate('Price', t('search.byPrice').toString())}
              showFilterMenu={false}
              filterPlaceholder={t('search.byPrice').toString()}
              headerStyle={{ width: '33%', minWidth: '10rem' }}
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
            visible={itemDialog}
            style={{ width: '768px' }}
            header={t('items.item')}
            modal
            className='p-fluid'
            footer={itemDialogFooter}
            onHide={hideDialog}
          >
            {/* name */}
            <div className='field'>
              <label htmlFor='name'>{t('common.name')}</label>
              <InputText
                name='name'
                value={(item.name as string) || ''}
                onChange={(e) => handleInput({ [e.target.name]: e.target.value })}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !item.name })}
              />
              {submitted && !item.name && (
                <small className='p-invalid'>{t('items.itemRequired')}</small>
              )}
            </div>

            {/* price */}
            <div className='field'>
              <label htmlFor='price'>{t('items.price')}</label>
              <InputNumber
                name='price'
                value={item.price}
                onChange={(e) => handleInput({ price: e.value as number })}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && item.price < 0 })}
              />
              {submitted && item.price < 0 && (
                <small className='p-invalid'>{t('items.priceRequired')}</small>
              )}
            </div>
            {/* product type */}
            <div className='dropdown-demo'>
              <label htmlFor='productTypeId'>{t('items.productType')}</label>
              <Dropdown
                value={productType}
                name='productTypeId'
                options={productTypes}
                onChange={(e) =>
                  handleInput({
                    [e.target.name]: e.value ? e.value.id : null,
                    productTypeName: e.value ? e.value.name : null,
                  })
                }
                optionLabel='name'
                filter
                resetFilterOnHide={true}
                onHide={() => setSearchValue('')}
                filterTemplate={inputDropdownFilterTemplate}
                showClear={item.productTypeId ? true : false}
                emptyMessage={t('common.resultsNotFound')}
                placeholder={t('items.selectProductType') as string}
                itemTemplate={productTypeOptionTemplate}
                valueTemplate={selectedProductTypeTemplate(
                  t('items.selectProductType'),
                  item.productTypeName as string,
                )}
              />
            </div>
          </Dialog>
          <Dialog
            visible={deleteItemsDialog}
            style={{ width: '450px' }}
            header={t('common.confirm') as string}
            modal
            footer={() => deleteItemDialogFooter(hideDeleteItemsDialog, deleteItems)}
            onHide={hideDeleteItemsDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                {selectedItems.length === 1
                  ? t('common.defaultDeleteMessage') + ' ' + item.name
                  : t('common.defaultDeleteSelectedMessage')}
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Items
