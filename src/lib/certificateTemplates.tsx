import type { ReactNode } from 'react'

import type { CertificateTemplateContext, CertificateTemplateDefinition, CertificateTypeId } from '../types/certificate'

const makeBanglaDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const getOptionalText = (value?: string) => (value && value.trim() ? value.trim() : '')

const getHeirRelationshipText = (heir: CertificateTemplateContext['heirs'][number]) => {
  if (heir.relationshipCustom && heir.relationshipCustom.trim()) {
    return heir.relationshipCustom.trim()
  }

  return heir.relationship || '—'
}

const getHeirCommentText = (heir: CertificateTemplateContext['heirs'][number]) => {
  if (heir.commentCustom && heir.commentCustom.trim()) {
    return heir.commentCustom.trim()
  }

  return heir.comment || ''
}

const renderHeaderContent = (settings: CertificateTemplateContext['settings']) => (
  <div className="text-center">
    <div className="text-xl font-bold">{settings.unionName}</div>
    <div className="text-lg font-bold">{settings.postOffice}</div>
    <div className="text-base font-medium">
      {settings.upazila}, {settings.district}-{settings.postalCode}
    </div>
    <div className="mt-1 text-sm text-slate-600">
      Website: {settings.website} | Email: {settings.email}
    </div>
  </div>
)

const renderHeirRows = (heirs: CertificateTemplateContext['heirs']) => {
  if (heirs.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-3 py-5 text-center text-slate-600">
          কোন উত্তরাধিকারী তথ্য নেই
        </td>
      </tr>
    )
  }

  return heirs.map((heir, index) => (
    <tr key={heir.id} className="align-top border-b border-slate-300">
      <td className="border border-slate-300 px-3 py-3 text-center">{index + 1}</td>
      <td className="border border-slate-300 px-3 py-3">{heir.name || '—'}</td>
      <td className="border border-slate-300 px-3 py-3">{getHeirRelationshipText(heir)}</td>
      <td className="border border-slate-300 px-3 py-3">
        {heir.nidOrBirthRegistration ? heir.nidOrBirthRegistration : ''}
      </td>
      <td className="border border-slate-300 px-3 py-3">{getHeirCommentText(heir) || ''}</td>
    </tr>
  ))
}

const splitHeirsIntoPages = (heirs: CertificateTemplateContext['heirs'], pageSize: number) => {
  const rows = heirs.length > 0 ? heirs : [{ id: 'placeholder', name: '', relationship: '', comment: '' }]
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  return Array.from({ length: totalPages }, (_, pageIndex) => ({
    pageIndex,
    pageNumber: pageIndex + 1,
    rows: rows.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
    totalPages,
  }))
}

const renderHeirPage = (
  context: CertificateTemplateContext,
  pageNumber: number,
  totalPages: number,
  pageHeirs: CertificateTemplateContext['heirs'],
) => {
  const motherName = getOptionalText(context.person.motherName)
  const personVillage = getOptionalText(context.person.village)
  const personName = getOptionalText(context.person.name) || 'ব্যক্তির নাম'
  const fatherName = getOptionalText(context.person.fatherOrHusbandName) || 'পিতার নাম'
  const wardNumber = context.person.ward ?? 0

  return (
    <div className="certificate-page" key={`page-${pageNumber}`}>
      <div className="certificate-paper">
        {renderHeaderContent(context.settings)}

        <div className="mt-6 text-center text-xl font-bold">স্মারক: {context.smarakPrefix}{context.smarakSerial}</div>
        <div className="mt-2 text-center text-2xl font-bold underline">উত্তরাধিকার/ওয়ারিশ সনদ</div>
        <div className="mt-5 text-center text-sm text-slate-500">তারিখ: {makeBanglaDate(context.certificateDate)}</div>

        <div className="mt-6 text-justify leading-8 text-[17px] text-slate-800">
          এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{personName}</span>, পিতা:{' '}
          <span className="font-bold">{fatherName}</span>
          {motherName ? <>, মাতা: <span className="font-bold">{motherName}</span></> : null}। তিনি অত্র ইউনিয়নের{' '}
          <span className="font-bold">{wardNumber}</span> নং ওয়ার্ড-এর অন্তর্গত{' '}
          <span className="font-bold">{personVillage || 'গ্রামের নাম'}</span> গ্রামের বাসিন্দা ছিলেন।
        </div>

        <div className="mt-4 text-justify leading-8 text-[17px] text-slate-800">
          তিনি মৃত্যুকালে নিম্নে উল্লেখিত উত্তরাধিকারী/ওয়ারিশগণকে রেখে গেছেন।
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-slate-300">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-3">ক্র. নং</th>
                <th className="border border-slate-300 px-2 py-3">নাম</th>
                <th className="border border-slate-300 px-2 py-3">মৃতের সাথে সম্পর্ক</th>
                <th className="border border-slate-300 px-2 py-3">জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর</th>
                <th className="border border-slate-300 px-2 py-3">মন্তব্য</th>
              </tr>
            </thead>
            <tbody>{renderHeirRows(pageHeirs)}</tbody>
          </table>
        </div>

        {pageNumber === totalPages ? (
          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="w-1/3 text-center text-sm font-medium text-slate-700">
              <div className="border-t border-slate-400 pt-3">ইউপি সদস্যের স্বাক্ষর</div>
            </div>
            <div className="flex w-1/3 flex-col items-center justify-center text-center">
              {context.qrDataUrl ? (
                <img src={context.qrDataUrl} alt="Certificate QR code" className="mb-2 h-20 w-20 rounded-md border border-slate-300 bg-white p-1" />
              ) : (
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-xs font-bold text-slate-600">
                  QR
                </div>
              )}
              <div className="text-xs text-slate-600">কোড</div>
            </div>
            <div className="w-1/3 text-center text-sm font-medium text-slate-700">
              <div className="border-t border-slate-400 pt-3">চেয়ারম্যানের স্বাক্ষর</div>
              <div className="mt-2 text-xs text-slate-600">{context.settings.chairmanName}</div>
              <div className="text-xs text-slate-600">{context.settings.chairmanMobile || 'মোবাইল নম্বর নেই'}</div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 text-right text-sm font-medium text-slate-600">পৃষ্ঠা {pageNumber}/{totalPages}</div>
      </div>
    </div>
  )
}

const defaultTemplateMap: Record<CertificateTypeId, CertificateTemplateDefinition> = {
  heir: {
    id: 'heir',
    label: 'উত্তরাধিকার/ওয়ারিশ সনদ',
    description: 'অনুমোদিত বর্ণনা সহ উত্তরাধিকার/ওয়ারিশ সনদ',
    render: (context) => {
      const pages = splitHeirsIntoPages(context.heirs, 8)
      return pages.map(({ pageNumber, rows, totalPages }) =>
        renderHeirPage(context, pageNumber, totalPages, rows),
      )
    },
  },
  citizenship: {
    id: 'citizenship',
    label: 'নাগরিকত্ব সনদ',
    description: 'অস্থায়ী শহর-ভিত্তিক নাগরিকত্ব সনদ টেমপ্লেট',
    render: (context) => (
      <div className="certificate-sheet">
        <div className="certificate-paper">
          {renderHeaderContent(context.settings)}
          <div className="mt-6 text-center text-xl font-bold">স্মারক: {context.smarakPrefix}{context.smarakSerial}</div>
          <div className="mt-3 text-center text-2xl font-bold underline">নাগরিকত্ব সনদ</div>
          <div className="mt-6 text-justify leading-8 text-[17px] text-slate-800">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{context.person.name}</span>, পিতা: <span className="font-bold">{context.person.fatherOrHusbandName}</span>
            {getOptionalText(context.person.motherName) ? <>, মাতা: <span className="font-bold">{context.person.motherName}</span></> : null}।
            তিনি অত্র ইউনিয়নের <span className="font-bold">{context.person.ward ?? 0}</span> নং ওয়ার্ডের <span className="font-bold">{context.person.village || 'গ্রামের নাম'}</span> গ্রামের স্থায়ী বাসিন্দা।
            <span className="block mt-3">এই শংসাপত্রটি অফিসের প্রয়োজনীয় কাজে ব্যবহারের জন্য প্রদান করা হলো।</span>
          </div>
        </div>
      </div>
    ),
  },
  testimonial: {
    id: 'testimonial',
    label: 'প্রত্যয়ন পত্র',
    description: 'অস্থায়ী প্রত্যয়ন পত্র টেমপ্লেট',
    render: (context) => (
      <div className="certificate-sheet">
        <div className="certificate-paper">
          {renderHeaderContent(context.settings)}
          <div className="mt-6 text-center text-xl font-bold">স্মারক: {context.smarakPrefix}{context.smarakSerial}</div>
          <div className="mt-3 text-center text-2xl font-bold underline">প্রত্যয়ন পত্র</div>
          <div className="mt-6 text-justify leading-8 text-[17px] text-slate-800">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{context.person.name}</span>, পিতা: <span className="font-bold">{context.person.fatherOrHusbandName}</span>,
            অত্র ইউনিয়নের <span className="font-bold">{context.person.ward ?? 0}</span> নং ওয়ার্ডের <span className="font-bold">{context.person.village || 'গ্রামের নাম'}</span> গ্রামের বাসিন্দা।
            তিনি যথাযথভাবে এই প্রত্যয়ন পত্রের প্রয়োজনীয়তা অনুযায়ী অফিসের কাজে ব্যবহার করবেন।
          </div>
        </div>
      </div>
    ),
  },
  unemployment: {
    id: 'unemployment',
    label: 'বেকারত্ব সনদ',
    description: 'অস্থায়ী বেকারত্ব সনদ টেমপ্লেট',
    render: (context) => (
      <div className="certificate-sheet">
        <div className="certificate-paper">
          {renderHeaderContent(context.settings)}
          <div className="mt-6 text-center text-xl font-bold">স্মারক: {context.smarakPrefix}{context.smarakSerial}</div>
          <div className="mt-3 text-center text-2xl font-bold underline">বেকারত্ব সনদ</div>
          <div className="mt-6 text-justify leading-8 text-[17px] text-slate-800">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{context.person.name}</span>, পিতা: <span className="font-bold">{context.person.fatherOrHusbandName}</span>,
            অত্র ইউনিয়নের <span className="font-bold">{context.person.ward ?? 0}</span> নং ওয়ার্ডের <span className="font-bold">{context.person.village || 'গ্রামের নাম'}</span> গ্রামের বাসিন্দা।
            তিনি বর্তমানে বেকার এবং এই শংসাপত্রটি প্রয়োজনীয় কাজে ব্যবহারের জন্য প্রদান করা হলো।
          </div>
        </div>
      </div>
    ),
  },
  unmarried: {
    id: 'unmarried',
    label: 'অবিবাহিত সনদ',
    description: 'অস্থায়ী অবিবাহিত সনদ টেমপ্লেট',
    render: (context) => (
      <div className="certificate-sheet">
        <div className="certificate-paper">
          {renderHeaderContent(context.settings)}
          <div className="mt-6 text-center text-xl font-bold">স্মারক: {context.smarakPrefix}{context.smarakSerial}</div>
          <div className="mt-3 text-center text-2xl font-bold underline">অবিবাহিত সনদ</div>
          <div className="mt-6 text-justify leading-8 text-[17px] text-slate-800">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{context.person.name}</span>, পিতা: <span className="font-bold">{context.person.fatherOrHusbandName}</span>।
            তিনি অত্র ইউনিয়নের <span className="font-bold">{context.person.ward ?? 0}</span> নং ওয়ার্ডের <span className="font-bold">{context.person.village || 'গ্রামের নাম'}</span> গ্রামের বাসিন্দা।
            তিনি বর্তমানে অবিবাহিত এবং এই সনদটি প্রয়োজনীয় কাজে ব্যবহারের জন্য প্রদান করা হলো।
          </div>
        </div>
      </div>
    ),
  },
}

export const certificateTemplates = Object.values(defaultTemplateMap)

export function getCertificateTemplate(type: CertificateTypeId): CertificateTemplateDefinition {
  return defaultTemplateMap[type]
}

export function renderCertificate(type: CertificateTypeId, context: CertificateTemplateContext): ReactNode {
  return defaultTemplateMap[type].render(context)
}
