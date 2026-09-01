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

const ADMIN_PIN_KEY = 'ghogadaha-admin-pin-hash'
const ADMIN_PIN_SALT = 'ghogadaha-admin-v1'
const DEFAULT_ADMIN_PIN = '1234'

function hashAdminPin(pin: string): string {
  const normalized = `${ADMIN_PIN_SALT}:${pin}`
  let hash = 0

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0
  }

  return hash.toString(16).padStart(8, '0')
}

function initializeAdminPin(): string {
  const stored = window.localStorage.getItem(ADMIN_PIN_KEY)
  if (stored) {
    return stored
  }

  const initialHash = hashAdminPin(DEFAULT_ADMIN_PIN)
  window.localStorage.setItem(ADMIN_PIN_KEY, initialHash)
  return initialHash
}

function unlockAdminIfValid(pin: string): boolean {
  const expectedHash = initializeAdminPin()
  return hashAdminPin(pin) === expectedHash
}

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
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    try {
      return window.localStorage.getItem(ADMIN_PIN_KEY) !== null
    } catch {
      return false
    }
  })
  const [settings, setSettingsState] = useState<UnionSettings>(DEFAULT_UNION_SETTINGS)
  const [wards, setWards] = useState<Ward[]>(DEFAULT_WARDS)
  const [villages, setVillages] = useState<Village[]>([])
  const [draft, setDraft] = useState<Person>(createEmptyPerson())
  const [temporaryPersons, setTemporaryPersons] = useState<Person[]>([])
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingWards, setSavingWards] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [adminMessage, setAdminMessage] = useState('')

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

  const handleOpenSettings = () => {
    if (adminUnlocked) {
      setActiveView('settings')
      setAdminMessage('')
      return
    }

    const pinValue = window.prompt('অ্যাডমিন PIN লিখুন')
    if (!pinValue) {
      setAdminMessage('PIN প্রদান করা হয়নি।')
      return
    }

    if (unlockAdminIfValid(pinValue.trim())) {
      setAdminUnlocked(true)
      setActiveView('settings')
      setAdminMessage('')
      return
    }

    setAdminMessage('ভুল PIN। প্রশাসন সুরক্ষিত।')
  }

  const handleLockAdmin = () => {
    setAdminUnlocked(false)
    setActiveView('person')
    setAdminMessage('অ্যাডমিন সেশন বন্ধ হয়েছে।')
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
        <>
          {!adminUnlocked ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              প্রশাসনিক সেটিংস দেখতে PIN লাগবে।
            </div>
          ) : (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={handleLockAdmin}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                অ্যাডমিন লক
              </button>
            </div>
          )}

          {adminMessage ? (
            <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
              {adminMessage}
            </div>
          ) : null}

          {adminUnlocked ? (
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
          ) : null}
        </>
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
            onClick={handleOpenSettings}
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
