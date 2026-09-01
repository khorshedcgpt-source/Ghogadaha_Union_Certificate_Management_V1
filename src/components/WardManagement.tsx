import type { Ward } from '../types/models'

interface WardManagementProps {
  wards: Ward[]
  onChange: (next: Ward[]) => void
  onSave: () => Promise<void> | void
  saving: boolean
}

const wardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function WardManagement({ wards, onChange, onSave, saving }: WardManagementProps) {
  const handleChange = (wardNumber: number, memberName: string) => {
    const next = wards.map((ward) =>
      ward.wardNumber === wardNumber
        ? { ...ward, memberName, updatedAt: new Date().toISOString() }
        : ward,
    )

    onChange(next)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">ওয়ার্ড কনফিগারেশন</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">৯টি ওয়ার্ডের সদস্য</h3>
        </div>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving}
          className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          {saving ? 'সংরক্ষণ হচ্ছে...' : 'ওয়ার্ড সংরক্ষণ'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wardNumbers.map((wardNumber) => {
          const ward = wards.find((item) => item.wardNumber === wardNumber) ?? {
            id: `ward-${wardNumber}`,
            wardNumber,
            memberName: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          return (
            <label key={wardNumber} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="mb-2 block text-sm font-semibold text-slate-700">ওয়ার্ড {wardNumber}</span>
              <input
                type="text"
                value={ward.memberName}
                onChange={(event) => handleChange(wardNumber, event.target.value)}
                placeholder="সদস্যের নাম লিখুন"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </label>
          )
        })}
      </div>
    </section>
  )
}
