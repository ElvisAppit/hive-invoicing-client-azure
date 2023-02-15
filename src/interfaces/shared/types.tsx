import { ReactNode, Dispatch, SetStateAction } from 'react'
import { DataTableSortMeta } from 'primereact/datatable'
import { PaginatorProps } from 'primereact/paginator'

// TODO: implement BaseRequest in api request where it is needed
export type BaseRequest = {
  PageNumber?: number
  PageSize?: number
  Search?: string
  SortBy?: string
  SortOrder?: string
  TakeAll?: boolean
}

export type ResponseInfo = {
  status: string
  message: string
}

export type ContextProps = {
  children: ReactNode
}

export type ItemToDelete = {
  id: number
  item: any
  tableName: string
}

export type FieldsToUpdate = {
  [key: string]: number | string | boolean
}

export type DropdownProps = {
  dropdownValues: DropdownItem[]
  setSearchValue(searchValue: string): void
  currentDropdownValue: string
  setDropdownValue(dropdownItem: DropdownItem): void
  enableClick: boolean
}

export type DropdownItem = {
  id: number | null
  name: string | null
  amount?: number
}

export type ManagePageButtonsProps = {
  isView: boolean
  setIsView: (value: SetStateAction<boolean>) => void
  tableId: number
  cancelEdit: () => void
  setDeleteDialogOpen?: Dispatch<SetStateAction<boolean>>
  hookForm?: boolean
  navigateTo?: string
  navigateState?: any
}

export type TableInfo = {
  paginatorInfo: PaginatorProps
  sortInfo: DataTableSortMeta
}
