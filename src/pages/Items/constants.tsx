import { t } from 'i18next'

export const EMPTY_ITEM = {
  itemId: 0,
  name: null,
  productTypeId: 0,
  productTypeName: null,
  price: 0,
}

export const EMPTY_PRODUCT_TYPE = {
  id: null,
  name: t('items.selectProductType') as string,
}
