import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import { Item, ItemFilters } from '../interfaces/ItemInterfaces'
import { API_PATHS } from '../utils/constants'

export const createItem = (item: Item): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.ITEMS, item)
}

export const getItems = (params?: ItemFilters): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.ITEMS, {
    params: params,
  })
}

export const getItem = (id: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.ITEMS + id)
}

export const updateItem = (item: Item, id: number): Promise<AxiosResponse> => {
  return customAxios.put(API_PATHS.ITEMS + id, item)
}
