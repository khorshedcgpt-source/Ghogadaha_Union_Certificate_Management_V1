import Dexie, { type Table } from 'dexie'

import type {
  CertificateSnapshot,
  Person,
  UnionSettings,
  Ward,
} from '../types/models'

export const DEFAULT_UNION_SETTINGS: UnionSettings = {
  id: 'primary',
  unionName: 'গণপ্রজাতন্ত্রী বাংলাদেশ',
  postOffice: 'ঘোগাদহ ইউনিয়ন পরিষদ কার্যালয়',
  upazila: 'কুড়িগ্রাম সদর',
  district: 'কুড়িগ্রাম',
  postalCode: '৫৬০০',
  website: 'ghogadaha.kurigram.gov.bd',
  email: 'ghogadahaup@gmail.com',
  chairmanName: 'চেয়ারম্যান',
  chairmanMobile: '',
  updatedAt: new Date().toISOString(),
}

export const DEFAULT_WARDS: Ward[] = [
  { id: 'ward-1', wardNumber: 1, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-2', wardNumber: 2, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-3', wardNumber: 3, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-4', wardNumber: 4, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-5', wardNumber: 5, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-6', wardNumber: 6, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-7', wardNumber: 7, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-8', wardNumber: 8, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ward-9', wardNumber: 9, memberName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

class UnionCertificateDatabase extends Dexie {
  settings!: Table<UnionSettings, 'primary'>
  persons!: Table<Person, string>
  wards!: Table<Ward, string>
  certificateSnapshots!: Table<CertificateSnapshot, string>

  constructor() {
    super('ghogadaha-union-certificate-db')

    this.version(1).stores({
      settings: '&id',
      persons: '&id, status, mobile, ward, village, createdAt, updatedAt',
      wards: '&id, wardNumber',
      certificateSnapshots: '&id, certificateType, certificateDate, createdAt, updatedAt',
    })
  }
}

export const db = new UnionCertificateDatabase()

export async function initializeDatabase(): Promise<void> {
  await db.open()

  const settingsExists = await db.settings.get('primary')
  if (!settingsExists) {
    await db.settings.put(DEFAULT_UNION_SETTINGS)
  }

  const wardCount = await db.wards.count()
  if (wardCount === 0) {
    await db.wards.bulkPut(DEFAULT_WARDS)
  }
}

export async function setSettings(settings: UnionSettings): Promise<void> {
  await db.settings.put(settings)
}

export async function listWards(): Promise<Ward[]> {
  return db.wards.orderBy('wardNumber').toArray()
}

export async function listPersons(): Promise<Person[]> {
  return db.persons.orderBy('createdAt').reverse().toArray()
}

export async function savePerson(person: Person): Promise<string> {
  await db.persons.put(person)
  return person.id
}

export async function saveSnapshot(snapshot: CertificateSnapshot): Promise<string> {
  await db.certificateSnapshots.put(snapshot)
  return snapshot.id
}
