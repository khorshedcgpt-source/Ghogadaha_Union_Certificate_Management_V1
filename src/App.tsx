import { useEffect, useState } from 'react'

import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PersonManagement } from './components/PersonManagement'
import { SettingsPage } from './components/SettingsPage'
import {
  DEFAULT_UNION_SETTINGS,
  DEFAULT_WARDS,
  clearTemporaryPersons,
  db,
  deletePerson,
  deleteVillage,
  initializeDatabase,
  listTemporaryPersons,
  listVillages,
  savePerson,
  saveVillage,
  saveWards,
  setSettings,
} from './db'
import type { Person, UnionSettings, Village, Ward } from './types/models'

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
  const [activeView, setActiveView] = useState<'person' | 'settings'>('person')
  const [settings, setSettingsState] = useState<UnionSettings>(DEFAULT_UNION_SETTINGS)
  const [wards, setWards] = useState<Ward[]>(DEFAULT_WARDS)
  const [villages, setVillages] = useState<Village[]>([])
  const [draft, setDraft] = useState<Person>(createEmptyPerson())
  const [temporaryPersons, setTemporaryPersons] = useState<Person[]>([])
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingWards, setSavingWards] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function setupDatabase() {
      try {
        await initializeDatabase()

        if (!isMounted) {
          return
        }

        const [settingsRecord, wardRecord, villageRecord, temporaryRecord] = await Promise.all([
          db.settings.get('primary') as Promise<UnionSettings | undefined>,
          db.wards.orderBy('wardNumber').toArray(),
          db.villages.orderBy('wardNumber').toArray(),
          listTemporaryPersons(),
        ])

        setSettingsState(settingsRecord ?? DEFAULT_UNION_SETTINGS)
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

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await setSettings(settings)
      setDbStatus('সেটিংস সংরক্ষিত')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSaveWards = async () => {
    setSavingWards(true)
    try {
      await saveWards(wards)
      setDbStatus('ওয়ার্ড তালিকা সংরক্ষিত')
    } finally {
      setSavingWards(false)
    }
  }

  const handleSaveVillage = async (village: Village) => {
    await saveVillage(village)
    const refreshed = await listVillages()
    setVillages(refreshed)
  }

  const handleDeleteVillage = async (id: string) => {
    await deleteVillage(id)
    const refreshed = await listVillages()
    setVillages(refreshed)
  }

  const handleWardChange = (next: Ward[]) => {
    setWards(next)
  }

  const content = activeView === 'settings'
    ? (
        <SettingsPage
          settings={settings}
          wards={wards}
          villages={villages}
          onSettingsChange={setSettingsState}
          onSaveSettings={handleSaveSettings}
          onSaveWards={handleSaveWards}
          onSaveVillage={handleSaveVillage}
          onDeleteVillage={handleDeleteVillage}
          onWardChange={handleWardChange}
          savingSettings={savingSettings}
          savingWards={savingWards}
        />
      )
    : (
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
      )

  return (
    <ErrorBoundary>
      <AppShell isDbReady={isDbReady} dbStatus={dbStatus} activeItem={activeView === 'settings' ? 'সেটিংস' : 'নতুন সনদ'}>
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveView('person')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold',
              activeView === 'person'
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700',
            ].join(' ')}
          >
            নতুন সনদ
          </button>
          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold',
              activeView === 'settings'
                ? 'bg-sky-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700',
            ].join(' ')}
          >
            সেটিংস ও ব্যাকআপ
          </button>
        </div>
        {content}
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
