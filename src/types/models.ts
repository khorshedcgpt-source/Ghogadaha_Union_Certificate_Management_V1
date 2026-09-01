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
  familyIdentity?: string
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

export interface Village {
  id: string
  wardNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  name: string
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
  smarakSerial: string
  templateVersion: string
  qrPayload: string
  configuration: Record<string, string | number | boolean | null>
  createdAt: string
  updatedAt: string
}

export interface FamilyIdentityMapping {
  id: string
  personId: string
  mobile: string
  familyIdentity: string
  relation: RelationType
  createdAt: string
  updatedAt: string
}

export interface TemplateVersion {
  id: string
  code: string
  version: string
  name: string
  content: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface QrPayloadRecord {
  id: string
  certificateType: string
  payload: string
  data: string
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
