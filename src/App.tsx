import { useEffect, useState } from 'react'

import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PersonManagement } from './components/PersonManagement'
import {
  DEFAULT_WARDS,
  clearTemporaryPersons,
  db,
  deletePerson,
  initializeDatabase,
  listTemporaryPersons,
  savePerson,
} from './db'
import type { Person, Village, Ward } from './types/models'

const createEmptyPerson = (): Person => ({
  id: crypto.randomUUID(),
  name: '',
  fatherOrHusbandName: '',
  motherName: '',
  nidOrBirthRegistration: '',
  photo: null,
  ward: 1,
  village: '',
  mobile: '',
  relation: 'own',
  status: 'temporary',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

function App() {
  const [isDbReady, setIsDbReady] = useState(false)
  const [dbStatus, setDbStatus] = useState('ডাটাবেস শুরু হচ্ছে...')
  const [wards, setWards] = useState<Ward[]>(DEFAULT_WARDS)
  const [villages, setVillages] = useState<Village[]>([])
  const [draft, setDraft] = useState<Person>(createEmptyPerson())
  const [temporaryPersons, setTemporaryPersons] = useState<Person[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function setupDatabase() {
      try {
        await initializeDatabase()

        if (!isMounted) {
          return
        }

        const [wardRecord, villageRecord, temporaryRecord] = await Promise.all([
          db.wards.orderBy('wardNumber').toArray(),
          db.villages.orderBy('wardNumber').toArray(),
          listTemporaryPersons(),
        ])

        setWards(wardRecord.length ? wardRecord : DEFAULT_WARDS)
        setVillages(villageRecord)
        setTemporaryPersons(temporaryRecord)
        setIsDbReady(true)
        setDbStatus('IndexedDB প্রস্তুত')
      } catch (error) {
        console.error('Database initialization failed:', error)

        if (!isMounted) {
          return
        }

        setIsDbReady(false)
        setDbStatus('ডাটাবেসে সমস্যা')
      }
    }

    void setupDatabase()

    return () => {
      isMounted = false
    }
  }, [])

  const handleDraftChange = (updates: Partial<Person>) => {
    setDraft((current) => ({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
    setErrorMessage('')
  }

  const handleSaveTemporary = async () => {
    const trimmedName = draft.name.trim()
    const trimmedFather = draft.fatherOrHusbandName.trim()

    if (!trimmedName || !trimmedFather) {
      setErrorMessage('নাম এবং পিতা/স্বামীর নাম অবশ্যই দিতে হবে।')
      return
    }

    const nextPerson: Person = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      name: trimmedName,
      fatherOrHusbandName: trimmedFather,
      motherName: draft.motherName?.trim() ?? '',
      nidOrBirthRegistration: draft.nidOrBirthRegistration?.trim() ?? '',
      village: draft.village?.trim() ?? '',
      status: 'temporary',
      updatedAt: new Date().toISOString(),
    }

    await savePerson(nextPerson)
    const refreshed = await listTemporaryPersons()
    setTemporaryPersons(refreshed)
    setDraft(createEmptyPerson())
    setErrorMessage('')
  }

  const handleResume = (person: Person) => {
    setDraft({
      ...person,
      motherName: person.motherName ?? '',
      nidOrBirthRegistration: person.nidOrBirthRegistration ?? '',
      village: person.village ?? '',
      photo: person.photo ?? null,
    })
    setErrorMessage('')
  }

  const handleDelete = async (id: string) => {
    await deletePerson(id)
    setTemporaryPersons((current) => current.filter((person) => person.id !== id))
    if (draft.id === id) {
      setDraft(createEmptyPerson())
    }
  }

  const handleClearAll = async () => {
    await clearTemporaryPersons()
    setTemporaryPersons([])
    setDraft(createEmptyPerson())
  }

  return (
    <ErrorBoundary>
      <AppShell isDbReady={isDbReady} dbStatus={dbStatus} activeItem="ব্যক্তি তথ্য">
        <PersonManagement
          wards={wards}
          villages={villages}
          draft={draft}
          temporaryPersons={temporaryPersons}
          errorMessage={errorMessage}
          onDraftChange={handleDraftChange}
          onSaveTemporary={handleSaveTemporary}
          onResume={handleResume}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
