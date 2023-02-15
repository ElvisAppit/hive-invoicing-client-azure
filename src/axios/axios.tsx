import axios from 'axios'
import i18next from 'i18next'
import { API_URL, REQUEST_FILTERS, USER_AUTH_LOCAL_STORAGE } from '../utils/constants'

export const customAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    PageSize: REQUEST_FILTERS.DEFAULT_PAGE_SIZE,
  },
})

customAxios.interceptors.request.use(
  (request) => {
    const userAuth = localStorage.getItem(USER_AUTH_LOCAL_STORAGE)
    const user = userAuth == null ? '' : JSON.parse(userAuth)
    request.headers = request.headers ?? {}
    request.headers.Authorization = `Bearer ${user.token}`
    request.headers.LangCode = i18next.language
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

customAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.resolve(error)
  },
)
