import { useMemo, useState } from 'react'

import type { Person, Village, Ward } from '../types/models'

interface PersonManagementProps {
  wards: Ward[]
  villages: Village[]
  draft: Person
  temporaryPersons: Person[]
  errorMessage: string
  onDraftChange: (next: Partial<Person>) => void
  onSaveTemporary: () => Promise<void> | void
  onResume: (person: Person) => void
  onDelete: (id: string) => Promise<void> | void
  onClearAll: () => Promise<void> | void
}

export function PersonManagement({
  wards,
  villages,
  draft,
  temporaryPersons,
  errorMessage,
  onDraftChange,
  onSaveTemporary,
  onResume,
  onDelete,
  onClearAll,
}: PersonManagementProps) {
  const selectedWard = draft.ward ?? 1
  const [villageSearch, setVillageSearch] = useState('')

  const wardMemberName = useMemo(
    () => wards.find((ward) => ward.wardNumber === selectedWard)?.memberName ?? '',
    [selectedWard, wards],
  )

  const filteredVillages = useMemo(() => {
    const normalizedSearch = villageSearch.trim().toLowerCase()
    return villages
      .filter((village) => village.wardNumber === selectedWard)
      .filter((village) => {
        if (!normalizedSearch) {
          return true
        }

        return village.name.toLowerCase().includes(normalizedSearch)
      })
  }, [selectedWard, villageSearch, villages])

  const optionalEntries = [
    { label: 'মাতার নাম', value: draft.motherName },
    { label: 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর', value: draft.nidOrBirthRegistration },
  ].filter((entry) => entry.value && entry.value.trim().length > 0)

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(new Error('Photo read failed'))
      reader.readAsDataURL(file)
    })

    onDraftChange({ photo: dataUrl })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">ব্যক্তি তথ্য</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">ব্যক্তি নিবন্ধন</h3>
          </div>
          <button
            type="button"
            onClick={() => void onSaveTemporary()}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            প্রাথমিক সেভ
          </button>
        </div>

        {errorMessage ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">নাম</span>
            <input
              type="text"
              value={draft.name}
              onChange={(event) => onDraftChange({ name: event.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="ব্যক্তির নাম লিখুন"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">পিতা/স্বামীর নাম</span>
            <input
              type="text"
              value={draft.fatherOrHusbandName}
              onChange={(event) => onDraftChange({ fatherOrHusbandName: event.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="পিতা/স্বামীর নাম লিখুন"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">মাতার নাম</span>
            <input
              type="text"
              value={draft.motherName ?? ''}
              onChange={(event) => onDraftChange({ motherName: event.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="ঐচ্ছিক"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর</span>
            <input
              type="text"
              value={draft.nidOrBirthRegistration ?? ''}
              onChange={(event) => onDraftChange({ nidOrBirthRegistration: event.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="ঐচ্ছিক"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">ওয়ার্ড</span>
            <select
              value={selectedWard}
              onChange={(event) =>
                onDraftChange({
                  ward: Number(event.target.value),
                  village: '',
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              {Array.from({ length: 9 }, (_, index) => index + 1).map((wardNumber) => (
                <option key={wardNumber} value={wardNumber}>
                  ওয়ার্ড {wardNumber}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">সদস্য</span>
            <input
              type="text"
              value={wardMemberName}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-base text-slate-700"
            />
          </label>

          <div className="block md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">গ্রাম</span>
              <input
                type="search"
                value={villageSearch}
                onChange={(event) => setVillageSearch(event.target.value)}
                placeholder="গ্রামের নাম খুঁজুন"
                className="mb-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <select
              value={draft.village ?? ''}
              onChange={(event) => onDraftChange({ village: event.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">গ্রাম নির্বাচন করুন</option>
              {filteredVillages.map((village) => (
                <option key={village.id} value={village.name}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">ছবি (ঐচ্ছিক)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        {draft.photo ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-medium text-slate-700">ছবি প্রিভিউ</p>
            <img src={draft.photo} alt="Person preview" className="h-32 w-32 rounded-xl object-cover shadow-sm" />
          </div>
        ) : null}

        {optionalEntries.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-700">ঐচ্ছিক তথ্য</p>
            <ul className="space-y-2 text-slate-700">
              {optionalEntries.map((entry) => (
                <li key={entry.label}>
                  <span className="font-medium">{entry.label}:</span> {entry.value}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">অস্থায়ী রেকর্ড</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">প্রাথমিক সেভ তালিকা</h3>
          </div>
          <button
            type="button"
            onClick={() => void onClearAll()}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            সব মুছুন
          </button>
        </div>

        {temporaryPersons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            কোন অস্থায়ী রেকর্ড নেই।
          </div>
        ) : (
          <div className="space-y-3">
            {temporaryPersons.map((person) => (
              <div key={person.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{person.name || 'নাম অনুপস্থিত'}</p>
                  <p className="text-sm text-slate-600">
                    {person.ward ? `ওয়ার্ড ${person.ward}` : 'ওয়ার্ড অনুপস্থিত'} •{' '}
                    {person.village || 'গ্রাম অনুপস্থিত'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onResume(person)}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    সম্পাদনা
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(person.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
