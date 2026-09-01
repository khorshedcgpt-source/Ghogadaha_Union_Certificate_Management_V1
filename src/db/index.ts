import Dexie, { type Table } from 'dexie'

import type {
  CertificateSnapshot,
  Person,
  UnionSettings,
  Village,
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
  villages!: Table<Village, string>
  certificateSnapshots!: Table<CertificateSnapshot, string>

  constructor() {
    super('ghogadaha-union-certificate-db')

    this.version(1).stores({
      settings: '&id',
      persons: '&id, status, mobile, ward, village, createdAt, updatedAt',
      wards: '&id, wardNumber',
      villages: '&id, wardNumber, name',
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

export async function saveWards(wards: Ward[]): Promise<void> {
  await db.wards.bulkPut(wards)
}

export async function listWards(): Promise<Ward[]> {
  return db.wards.orderBy('wardNumber').toArray()
}

export async function listVillages(): Promise<Village[]> {
  return db.villages.orderBy('wardNumber').toArray()
}

export async function saveVillage(village: Village): Promise<void> {
  await db.villages.put(village)
}

export async function deleteVillage(id: string): Promise<void> {
  await db.villages.delete(id)
}

export async function listPersons(): Promise<Person[]> {
  return db.persons.orderBy('createdAt').reverse().toArray()
}

export async function savePerson(person: Person): Promise<string> {
  await db.persons.put(person)
  return person.id
}

export async function listTemporaryPersons(): Promise<Person[]> {
  return db.persons.where('status').equals('temporary').reverse().sortBy('updatedAt')
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  return db.persons.get(id)
}

export async function deletePerson(id: string): Promise<void> {
  await db.persons.delete(id)
}

export async function clearTemporaryPersons(): Promise<void> {
  const temporaryPersons = await db.persons.where('status').equals('temporary').toArray()
  if (temporaryPersons.length === 0) {
    return
  }

  await db.persons.bulkDelete(temporaryPersons.map((person) => person.id))
}

export async function listPermanentPersons(): Promise<Person[]> {
  return db.persons.where('status').equals('permanent').reverse().sortBy('updatedAt')
}

export async function findPermanentPersonsByMobile(mobile: string): Promise<Person[]> {
  const normalized = mobile.replace(/\D/g, '')
  if (!normalized) {
    return []
  }

  const persons = await db.persons.where('status').equals('permanent').toArray()
  return persons.filter((person) => (person.mobile ?? '').replace(/\D/g, '').includes(normalized))
}

export async function findPermanentPersonsByNid(nid: string): Promise<Person[]> {
  const normalized = nid.trim().toLowerCase()
  if (!normalized) {
    return []
  }

  const persons = await db.persons.where('status').equals('permanent').toArray()
  return persons.filter((person) => (person.nidOrBirthRegistration ?? '').trim().toLowerCase().includes(normalized))
}

export async function savePermanentPerson(person: Person): Promise<{ saved: boolean; reason?: string }> {
  const relation = person.relation ?? 'own'
  const normalizedMobile = (person.mobile ?? '').replace(/\D/g, '')
  if (!normalizedMobile) {
    return { saved: false, reason: 'মোবাইল নম্বর অবশ্যই দিতে হবে।' }
  }

  const existingPersons = await db.persons.where('status').equals('permanent').toArray()
  const duplicate = existingPersons.some((existingPerson) => {
    const sameMobile = (existingPerson.mobile ?? '').replace(/\D/g, '') === normalizedMobile
    const sameRelation = (existingPerson.relation ?? 'own') === relation
    return sameMobile && sameRelation && existingPerson.id !== person.id
  })

  if (duplicate) {
    return {
      saved: false,
      reason: 'এই মোবাইল নম্বর ও সম্পর্কের জন্য একটি স্থায়ী রেকর্ড ইতিমধ্যে আছে।',
    }
  }

  const finalPerson: Person = {
    ...person,
    id: person.id || crypto.randomUUID(),
    mobile: normalizedMobile,
    relation,
    familyIdentity: `${normalizedMobile}-${relation}`,
    status: 'permanent',
    updatedAt: new Date().toISOString(),
  }

  await db.persons.put(finalPerson)
  return { saved: true }
}

export async function listSnapshots(): Promise<CertificateSnapshot[]> {
  return db.certificateSnapshots.orderBy('createdAt').reverse().toArray()
}

export async function createImmutableSnapshot(snapshot: CertificateSnapshot): Promise<string> {
  const immutableSnapshot: CertificateSnapshot = {
    ...snapshot,
    id: snapshot.id || crypto.randomUUID(),
    createdAt: snapshot.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await db.certificateSnapshots.put(immutableSnapshot)
  return immutableSnapshot.id
}

export async function saveSnapshot(snapshot: CertificateSnapshot): Promise<string> {
  const immutableSnapshot: CertificateSnapshot = {
    ...snapshot,
    id: snapshot.id || crypto.randomUUID(),
    createdAt: snapshot.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await db.certificateSnapshots.put(immutableSnapshot)
  return immutableSnapshot.id
}
