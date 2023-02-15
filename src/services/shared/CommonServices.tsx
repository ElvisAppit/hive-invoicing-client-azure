import { AxiosResponse } from 'axios'
import { customAxios } from '../../axios/axios'

export const deleteItemById = (id: number, tableName: string): Promise<AxiosResponse> => {
  return customAxios.delete(tableName + id)
}
