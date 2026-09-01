import { useRef, useState } from 'react'

import { buildBackupEnvelope, downloadBackupFile, parseBackupFile, restoreBackupEnvelope } from '../lib/backup'

export function BackupRestorePanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [status, setStatus] = useState('ব্যাকআপ প্রস্তুত')
  const [statusTone, setStatusTone] = useState<'info' | 'success' | 'error' | 'warning'>('info')
  const [backupMeta, setBackupMeta] = useState<string>('')
  const [isBusy, setIsBusy] = useState(false)

  const handleExport = async () => {
    setIsBusy(true)
    setStatusTone('info')
    setStatus('ব্যাকআপ তৈরি হচ্ছে...')

    try {
      const backup = await buildBackupEnvelope()
      downloadBackupFile(backup, 'ghogadaha-backup')
      setBackupMeta(`সর্বশেষ এক্সপোর্ট: ${new Date(backup.exportedAt).toLocaleString('bn-BD')}`)
      setStatus('ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে।')
      setStatusTone('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ব্যাকআপ তৈরি হয়নি।'
      setStatus(message)
      setStatusTone('error')
    } finally {
      setIsBusy(false)
    }
  }

  const handleRestore = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setStatus('রিস্টোর করার জন্য একটি JSON ফাইল নির্বাচন করুন।')
      setStatusTone('warning')
      return
    }

    const shouldProceed = window.confirm(
      'রিস্টোরের আগে বর্তমান ডাটার নিরাপদ কপি স্বয়ংক্রিয়ভাবে তৈরি হবে। এই প্রক্রিয়া বর্তমান ডাটা প্রতিস্থাপন করবে। আপনি কি এগিয়ে যেতে চান?',
    )

    if (!shouldProceed) {
      setStatus('রিস্টোর বাতিল করা হয়েছে।')
      setStatusTone('info')
      return
    }

    setIsBusy(true)
    setStatusTone('info')
    setStatus('সুরক্ষা ব্যাকআপ তৈরি হচ্ছে...')

    try {
      const safetyBackup = await buildBackupEnvelope()
      downloadBackupFile(safetyBackup, 'ghogadaha-safety-before-restore')

      const backup = await parseBackupFile(file)
      const result = await restoreBackupEnvelope(backup)
      setStatus(
        result.warnings.length > 0
          ? `রিস্টোর সম্পন্ন হয়েছে। ${result.restoredCount}টি এন্ট্রি পুনরুদ্ধার করা হয়েছে। সতর্কতা: ${result.warnings.join(' ')}`
          : `রিস্টোর সম্পন্ন হয়েছে। ${result.restoredCount}টি এন্ট্রি পুনরুদ্ধার করা হয়েছে।`,
      )
      setStatusTone('success')
      setBackupMeta(`সর্বশেষ রিস্টোর: ${new Date().toLocaleString('bn-BD')}`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'রিস্টোর করতে সমস্যা হয়েছে।'
      setStatus(message)
      setStatusTone('error')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">ব্যাকআপ ও রিস্টোর</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">অফলাইন ডাটা সুরক্ষা</h3>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          অফলাইন মোড
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 text-sm font-medium text-slate-700">ব্যাকআপ এক্সপোর্ট</p>
          <p className="text-sm text-slate-600">
            সেটিংস, ওয়ার্ড, গ্রাম, স্থায়ী ব্যক্তির তথ্য, ফ্যামিলি আইডেন্টিটি ম্যাপিং, সনদ ইতিহাস, টেমপ্লেট ভার্সন, আর QR ডাটা সহ সব স্থানীয় ডাটা JSON ফাইলে রপ্তানি করুন।
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={isBusy}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isBusy ? 'প্রক্রিয়াধীন...' : 'ব্যাকআপ ডাউনলোড'}
            </button>
          </div>

          {backupMeta ? (
            <p className="mt-4 text-sm font-medium text-slate-600">{backupMeta}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 text-sm font-medium text-slate-700">রিস্টোর ফাইল</p>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">JSON Backup File</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="block w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-700"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleRestore()}
            disabled={isBusy}
            className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {isBusy ? 'রিস্টোর হচ্ছে...' : 'ডাটা রিস্টোর'}
          </button>
        </div>
      </div>

      <div
        className={[
          'mt-6 rounded-xl border px-4 py-3 text-sm font-medium',
          statusTone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-800',
          statusTone === 'error' && 'border-red-200 bg-red-50 text-red-800',
          statusTone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-800',
          statusTone === 'info' && 'border-sky-200 bg-sky-50 text-sky-800',
        ].join(' ')}
      >
        {status}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">ভ্যালিডেশন ও নিরাপত্তা নিয়ম</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>ফরম্যাট ভার্সন ও app schema version পরীক্ষা করা হয়।</li>
          <li>checksum mismatch হলে ফাইলটি বিকৃত/অসম্পূর্ণ হিসেবে বাতিল করা হয়।</li>
          <li>রিস্টোরের আগে স্বয়ংক্রিয় সুরক্ষা ব্যাকআপ তৈরি করা হয়।</li>
          <li>ডাটা overwrite হলে নিশ্চিতকরণ মেসেজ দেখানো হয়।</li>
        </ul>
      </div>
    </section>
  )
}
