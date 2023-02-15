import { MutableRefObject, SetStateAction } from 'react'
import { BaseRequest } from './shared/types'

export type Item = {
  itemId: number
  name: string | null
  productTypeId: number | null
  productTypeName: string | null
  price: number
}

export type ItemFilters = BaseRequest & {
  Name?: string
  Price?: number
  ProductTypeId?: string
}

export type ItemProps = {
  items: Item[]
}

export type ItemManageProps = {
  item: Item
  setItem: (value: SetStateAction<Item>) => void
  initialItemValue: MutableRefObject<Item>
}
