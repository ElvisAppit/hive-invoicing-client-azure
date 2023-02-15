import { MutableRefObject, SetStateAction } from 'react'
import { BaseRequest } from './shared/types'

export type CodeBook = {
  [x: string]: any
  codeBookId: number
  name: string
  stringValue?: string
  dateTimeValue?: string
  decimalValue?: number
  boolValue?: boolean
  intValue?: number
  codeBookEntityId?: number
  codeBookEntityName?: string
  isEditable?: boolean
}

export type CodeBookEntity = {
  codeBookEntityId: number
  entityName: string
  code: string
  dataType: number
  isEditable: boolean
}

export type CodeBookInfo = {
  codeBookEntityId: number
  dataType: number
  codeBookId: number
  codeBookEntityName: string
  entityCodeName: string
  isEditable: boolean
}

export type CodeBookManageProps = {
  codeBook: CodeBook
  codeBookInfo: CodeBookInfo
  setCodeBook: (value: SetStateAction<CodeBook>) => void
  initialCodeBookValue: MutableRefObject<CodeBook>
}

export type CodeBookEntityProps = {
  codeBookEntities: CodeBookEntity[]
}

export type CodeBookValuesProps = {
  codeBookInfo: CodeBookInfo
  codeBookValues: CodeBook[]
}

export type SeqNumberRequset = BaseRequest & {
  SequenceNumberTypeId: number
}

export type CodeBookRequset = BaseRequest & {
  CodeBookEntityId?: number
  CodeBookValue?: string
  EntityCodeName?: string
  EntityName?: string
}

export type CodeBookFilters = BaseRequest & {
  CodeBookValue?: string
  CodeBookEntityId?: number
  EntityCodeName?: string
}

export type CodeBookBreadCrumbProps = {
  setBreadCrumbName(codeBookEntityName: string): void
}

export type SequenceNumber = {
  sequenceNumberId: number
  startNumber: number
  endNumber: number
  lastNumber: number
  validYear: number
  format: string | null
  sequenceNumberTypeId: number
  sequenceNumberTypeName: string | null
}
