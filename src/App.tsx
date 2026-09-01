import { useEffect, useState } from 'react'

import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SettingsPage } from './components/SettingsPage'
import {
  DEFAULT_UNION_SETTINGS,
  DEFAULT_WARDS,
  db,
  initializeDatabase,
  saveVillage,
  saveWards,
  setSettings,
} from './db'
import type { UnionSettings, Village, Ward } from './types/models'

function App() {
  const [isDbReady, setIsDbReady] = useState(false)
  const [dbStatus, setDbStatus] = useState('ডাটাবেস শুরু হচ্ছে...')
  const [settings, setSettingsState] = useState<UnionSettings>(DEFAULT_UNION_SETTINGS)
  const [wards, setWards] = useState<Ward[]>(DEFAULT_WARDS)
  const [villages, setVillages] = useState<Village[]>([])
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingWards, setSavingWards] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function setupDatabase() {
      try {
        await initializeDatabase()

        if (!isMounted) {
          return
        }

        const [settingsRecord, wardRecord, villageRecord] = await Promise.all([
          db.settings.get('primary'),
          db.wards.orderBy('wardNumber').toArray(),
          db.villages.orderBy('wardNumber').toArray(),
        ])

        setSettingsState(settingsRecord ?? DEFAULT_UNION_SETTINGS)
        setWards(wardRecord.length ? wardRecord : DEFAULT_WARDS)
        setVillages(villageRecord)
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

  const handleSaveSettings = async () => {
    const nextValue = {
      ...settings,
      updatedAt: new Date().toISOString(),
    }

    setSavingSettings(true)

    try {
      await setSettings(nextValue)
      setSettingsState(nextValue)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSaveWards = async () => {
    const normalized = wards.map((ward) => ({
      ...ward,
      wardNumber: ward.wardNumber,
      memberName: ward.memberName.trim(),
      updatedAt: new Date().toISOString(),
    }))

    setSavingWards(true)

    try {
      await saveWards(normalized)
      setWards(normalized)
    } finally {
      setSavingWards(false)
    }
  }

  const handleSaveVillage = async (village: Village) => {
    const payload = {
      ...village,
      name: village.name.trim(),
      updatedAt: new Date().toISOString(),
    }

    await saveVillage(payload)
    setVillages((current) => {
      const next = current.filter((item) => item.id !== payload.id)
      return [...next, payload].sort((a, b) => a.wardNumber - b.wardNumber)
    })
  }

  const handleDeleteVillage = async (id: string) => {
    await db.villages.delete(id)
    setVillages((current) => current.filter((item) => item.id !== id))
  }

  return (
    <ErrorBoundary>
      <AppShell isDbReady={isDbReady} dbStatus={dbStatus} activeItem="সেটিংস">
        <SettingsPage
          settings={settings}
          wards={wards}
          villages={villages}
          onSettingsChange={setSettingsState}
          onSaveSettings={handleSaveSettings}
          onSaveWards={handleSaveWards}
          onSaveVillage={handleSaveVillage}
          onDeleteVillage={handleDeleteVillage}
          onWardChange={setWards}
          savingSettings={savingSettings}
          savingWards={savingWards}
        />
      </AppShell>
    </ErrorBoundary>
  )
}

export default App
