import { MutableRefObject, SetStateAction } from 'react'
import { BaseRequest } from './shared/types'

export type Contact = {
  [key: string]: string | null | number | boolean
  contactId: number
  name: string
  address: string | null
  city: string | null
  zip: string | null
  country: string | null
  taxNumber: string | null
  idNumber: string | null
  phone: string | null
  mobile: string | null
  email: string | null
  website: string | null
  isCompany: boolean
}

export type ContactsFilters = BaseRequest & {
  ContactId?: number
  Name?: string
  Email?: string
  City?: string
  Address?: string
  IsCompany?: boolean
}

export type ContactsProps = {
  contacts: Contact[]
}

export type ContactManageProps = {
  contact: Contact
  params: Contact
  setContact: (value: SetStateAction<Contact>) => void
  initialContactValue: MutableRefObject<Contact>
}
