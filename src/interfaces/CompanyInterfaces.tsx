import { Dispatch, MutableRefObject, SetStateAction } from 'react'

export type CompanyInfo = {
  companyName: string | null
  address: string | null
  city: string | null
  zip: string | null
  country: string | null
  idNumber: string | null
  taxNumber: string | null
  logoUrl?: string | null
}

export type InitialCompanyInfo = {
  initialCompanyInfo: MutableRefObject<CompanyInfo>
}

export type CompanyProps = {
  companyInfo: CompanyInfo
  setCompanyInfo: Dispatch<SetStateAction<CompanyInfo>>
  initalCompanyInfo: MutableRefObject<CompanyInfo>
}
