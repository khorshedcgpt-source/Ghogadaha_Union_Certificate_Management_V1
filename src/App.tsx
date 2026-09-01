import { useEffect, useState } from 'react'

import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initializeDatabase } from './db'

function App() {
  const [isDbReady, setIsDbReady] = useState(false)
  const [dbStatus, setDbStatus] = useState('ডাটাবেস শুরু হচ্ছে...')

  useEffect(() => {
    let isMounted = true

    async function setupDatabase() {
      try {
        await initializeDatabase()

        if (!isMounted) {
          return
        }

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

  return (
    <ErrorBoundary>
      <AppShell isDbReady={isDbReady} dbStatus={dbStatus} />
    </ErrorBoundary>
  )
}

export default App
