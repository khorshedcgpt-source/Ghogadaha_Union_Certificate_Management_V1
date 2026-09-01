import { useMemo, useState } from 'react'

import type { Village, Ward } from '../types/models'

interface VillageManagementProps {
  wards: Ward[]
  villages: Village[]
  onSaveVillage: (village: Village) => Promise<void> | void
  onDeleteVillage: (id: string) => Promise<void> | void
}

export function VillageManagement({ wards, villages, onSaveVillage, onDeleteVillage }: VillageManagementProps) {
  const [selectedWard, setSelectedWard] = useState<Ward['wardNumber']>(1)
  const [villageName, setVillageName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const wardOptions = useMemo(
    () => wards.filter((ward) => ward.wardNumber >= 1 && ward.wardNumber <= 9).sort((a, b) => a.wardNumber - b.wardNumber),
    [wards],
  )

  const wardVillages = useMemo(
    () =>
      villages.filter((village) => village.wardNumber === selectedWard).filter((village) => {
        const normalizedSearch = searchTerm.trim().toLowerCase()
        if (!normalizedSearch) {
          return true
        }

        return village.name.toLowerCase().includes(normalizedSearch)
      }),
    [selectedWard, searchTerm, villages],
  )

  const handleAddVillage = async () => {
    const trimmedName = villageName.trim()
    if (!trimmedName) {
      return
    }

    const newVillage: Village = {
      id: crypto.randomUUID(),
      wardNumber: selectedWard,
      name: trimmedName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await onSaveVillage(newVillage)
    setVillageName('')
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">গ্রাম ব্যবস্থাপনা</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">ওয়ার্ডভিত্তিক গ্রাম তালিকা</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">ওয়ার্ড নির্বাচন</span>
            <select
              value={selectedWard}
              onChange={(event) => setSelectedWard(Number(event.target.value) as Ward['wardNumber'])}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {wardOptions.map((ward) => (
                <option key={ward.id} value={ward.wardNumber}>
                  ওয়ার্ড {ward.wardNumber}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">নতুন গ্রাম</span>
            <input
              type="text"
              value={villageName}
              onChange={(event) => setVillageName(event.target.value)}
              placeholder="গ্রামের নাম লিখুন"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleAddVillage()}
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            গ্রাম যোগ করুন
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">গ্রাম খুঁজুন</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="গ্রামের নাম লিখে খুঁজুন"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="mt-4 space-y-2">
            {wardVillages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                কোন গ্রাম নেই। নতুন গ্রাম যোগ করুন।
              </div>
            ) : (
              wardVillages.map((village) => (
                <div
                  key={village.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                >
                  <span className="font-medium text-slate-700">{village.name}</span>
                  <button
                    type="button"
                    onClick={() => void onDeleteVillage(village.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    মুছুন
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
