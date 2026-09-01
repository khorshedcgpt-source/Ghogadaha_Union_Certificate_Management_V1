type NavItem = {
  label: string
  active?: boolean
}

interface AppShellProps {
  isDbReady: boolean
  dbStatus: string
}

const navItems: NavItem[] = [
  { label: 'ড্যাশবোর্ড', active: true },
  { label: 'নতুন সনদ' },
  { label: 'প্রাথমিক সেভ' },
  { label: 'চূড়ান্ত সেভ' },
  { label: 'অনুসন্ধান' },
  { label: 'সনদ ইতিহাস' },
  { label: 'ব্যাকআপ' },
  { label: 'সেটিংস' },
]

const dashboardCards = [
  { title: 'সনদ', value: '০', note: 'সক্রিয় ফর্ম' },
  { title: 'প্রাথমিক সেভ', value: '০', note: 'খসড়া রেকর্ড' },
  { title: 'চূড়ান্ত সেভ', value: '০', note: 'স্থায়ী রেকর্ড' },
  { title: 'সারাংশ', value: '৯+', note: 'ওয়ার্ড কনফিগারেশন' },
]

export function AppShell({ isDbReady, dbStatus }: AppShellProps) {
  return (
    <div className="app-shell min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Offline-first
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">ঘোগাদহ ইউনিয়ন সনদ ব্যবস্থাপনা</h1>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span
              className={`inline-flex h-3 w-3 rounded-full ${
                isDbReady ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              aria-label="Database status"
            />
            <span className="text-sm font-medium text-slate-700">{dbStatus}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:max-w-xs">
          <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-emerald-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">ইউনিয়ন অফিস</p>
            <h2 className="mt-2 text-xl font-bold">কর্মকর্তা প্যানেল</h2>
          </div>

          <nav aria-label="Main navigation" className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={[
                  'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right text-base font-medium transition',
                  item.active
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100',
                ].join(' ')}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">নির্বাচিত ফাংশন</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">ড্যাশবোর্ড</h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              অনলাইন নেই • অফলাইন মোড
            </span>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {card.note}
                  </span>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-900">ফাউন্ডেশন স্ট্যাটাস</h3>
            <ul className="mt-4 space-y-3 text-base text-slate-700">
              <li>• React + TypeScript + Vite ভিত্তিক সিস্টেম প্রস্তুত</li>
              <li>• IndexedDB + Dexie ডাটাবেস লেয়ারের基础</li>
              <li>• Bangla UI shell, নেভিগেশন, এবং রেসপন্সিভ লেআউট</li>
              <li>• সমগ্র অ্যাপ্লিকেশন অফলাইন-ফার্স্টভাবে চলবে</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}
