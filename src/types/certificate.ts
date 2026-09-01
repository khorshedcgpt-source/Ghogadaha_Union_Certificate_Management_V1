import type { ReactNode } from 'react'

import type { Person, UnionSettings, Ward } from './models'

export type CertificateTypeId =
  | 'heir'
  | 'citizenship'
  | 'testimonial'
  | 'unemployment'
  | 'unmarried'

export interface HeirRow {
  id: string
  name: string
  relationship: string
  nidOrBirthRegistration?: string
  comment?: string
}

export interface CertificateTemplateContext {
  person: Person
  settings: UnionSettings
  selectedWard?: Ward
  wardMemberName?: string
  certificateType: CertificateTypeId
  certificateDate: string
  smarakPrefix: string
  smarakSerial: string
  qrPayload: string
  qrDataUrl?: string
  heirs: HeirRow[]
}

export interface CertificateTemplateDefinition {
  id: CertificateTypeId
  label: string
  description: string
  render: (context: CertificateTemplateContext) => ReactNode
}
