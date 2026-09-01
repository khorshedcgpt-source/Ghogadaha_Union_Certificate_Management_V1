import { type ChangeEvent } from 'react'

import type { UnionSettings } from '../types/models'

interface UnionSettingsFormProps {
  value: UnionSettings
  onChange: (value: UnionSettings) => void
  onSave: () => Promise<void> | void
  saving: boolean
}

const fieldGroups = [
  [
    { key: 'unionName', label: 'ইউনিয়নের নাম' },
    { key: 'postOffice', label: 'ডাকঘর' },
  ],
  [
    { key: 'upazila', label: 'উপজেলা' },
    { key: 'district', label: 'জেলা' },
  ],
  [
    { key: 'postalCode', label: 'পোস্ট কোড' },
    { key: 'website', label: 'ওয়েবসাইট' },
  ],
  [
    { key: 'email', label: 'ইমেইল' },
    { key: 'chairmanName', label: 'চেয়ারম্যানের নাম' },
  ],
  [{ key: 'chairmanMobile', label: 'চেয়ারম্যানের মোবাইল নম্বর' }],
] as const

export function UnionSettingsForm({ value, onChange, onSave, saving }: UnionSettingsFormProps) {
  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = event.target
    onChange({
      ...value,
      [name]: inputValue,
    })
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">ইউনিয়ন সেটিংস</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">ইউনিয়নের তথ্য</h3>
        </div>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ'}
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {fieldGroups.flat().map((field) => (
          <label key={field.key} className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
            <input
              type={field.key === 'email' ? 'email' : field.key === 'chairmanMobile' ? 'tel' : 'text'}
              name={field.key}
              value={String(value[field.key as keyof UnionSettings] ?? '')}
              onChange={handleFieldChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        ))}
      </div>
    </section>
  )
}
