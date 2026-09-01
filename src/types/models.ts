export type RelationType =
  | 'own'
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'brother'
  | 'sister'
  | 'other'

export type PersonStatus = 'temporary' | 'permanent'

export interface Person {
  id: string
  name: string
  fatherOrHusbandName: string
  motherName?: string
  nidOrBirthRegistration?: string
  photo?: string | null
  ward?: number
  village?: string
  mobile?: string
  relation?: RelationType
  status: PersonStatus
  createdAt: string
  updatedAt: string
}

export interface Heir {
  id: string
  name: string
  relationship: string
  relationshipCustom?: string
  nidOrBirthRegistration?: string
  comment?: string
  party?: string
  createdAt: string
  updatedAt: string
}

export interface Ward {
  id: string
  wardNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  memberName: string
  createdAt: string
  updatedAt: string
}

export interface CertificateSnapshot {
  id: string
  certificateType: string
  person: Person
  heirs: Heir[]
  ward: number
  village: string
  memberName: string
  chairmanName: string
  chairmanMobile: string
  certificateDate: string
  smarakPrefix: string
  templateVersion: string
  qrPayload: string
  createdAt: string
  updatedAt: string
}

export interface UnionSettings {
  id: 'primary'
  unionName: string
  postOffice: string
  upazila: string
  district: string
  postalCode: string
  website: string
  email: string
  chairmanName: string
  chairmanMobile: string
  updatedAt: string
}
