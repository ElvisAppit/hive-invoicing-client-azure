import { AxiosResponse } from 'axios'
import { customAxios } from '../axios/axios'
import {
  CodeBook,
  CodeBookFilters,
  CodeBookRequset,
  SeqNumberRequset,
  SequenceNumber,
} from '../interfaces/CodeBookInterfaces'
import { API_PATHS } from '../utils/constants'

export const getCodeBookEntities = (params?: CodeBookRequset): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CODEBOOK_ENTITIES, {
    params: params,
  })
}

export const getCodeBookValues = (params: CodeBookRequset): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CODEBOOK, {
    params: params,
  })
}

export const createCodeBook = (codeBook: CodeBook): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.CODEBOOK, codeBook)
}

export const getCodeBooks = (params?: CodeBookFilters): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CODEBOOK, {
    params: params,
  })
}

export const getCodeBook = (codeBookId: number): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.CODEBOOK + codeBookId)
}

export const updateCodeBook = (codeBookId: number, codeBook: CodeBook): Promise<AxiosResponse> => {
  return customAxios.put(API_PATHS.CODEBOOK + codeBookId, codeBook)
}

export const getSeqType = (params: SeqNumberRequset): Promise<AxiosResponse> => {
  return customAxios.get(API_PATHS.SEQNUMBERTYPE, {
    params: params,
  })
}

export const postSeqType = (seqNumType: SequenceNumber): Promise<AxiosResponse> => {
  return customAxios.post(API_PATHS.SEQNUMBERTYPE, seqNumType)
}
