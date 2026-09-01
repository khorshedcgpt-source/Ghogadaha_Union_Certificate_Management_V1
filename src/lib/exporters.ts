import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import {
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx'

import type { CertificateTemplateContext } from '../types/certificate'

export async function generateQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      margin: 1,
      width: 200,
      errorCorrectionLevel: 'M',
    })
  } catch (error) {
    console.error('QR generation failed:', error)
    return ''
  }
}

export function printCertificate(node: HTMLElement | null): void {
  if (!node) {
    return
  }

  window.print()
}

export async function exportCertificatePdf(node: HTMLElement | null, fileName = 'certificate-export'): Promise<void> {
  if (!node) {
    return
  }

  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
  })

  const imageData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 12
  const scaledWidth = pageWidth - margin * 2
  const scaledHeight = (canvas.height * scaledWidth) / canvas.width

  let positionY = margin
  let remainingHeight = scaledHeight

  pdf.addImage(imageData, 'PNG', margin, positionY, scaledWidth, scaledHeight)
  remainingHeight -= pageHeight - margin * 2

  while (remainingHeight > 0) {
    pdf.addPage()
    positionY = margin
    pdf.addImage(imageData, 'PNG', margin, positionY - (scaledHeight - remainingHeight), scaledWidth, scaledHeight)
    remainingHeight -= pageHeight - margin * 2
  }

  pdf.save(`${fileName}.pdf`)
}

function makeDocxTableRows(heirs: CertificateTemplateContext['heirs']) {
  const headerRow = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ text: 'ক্র. নং' })] }),
      new TableCell({ children: [new Paragraph({ text: 'নাম' })] }),
      new TableCell({ children: [new Paragraph({ text: 'মৃতের সাথে সম্পর্ক' })] }),
      new TableCell({ children: [new Paragraph({ text: 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর' })] }),
      new TableCell({ children: [new Paragraph({ text: 'মন্তব্য' })] }),
    ],
  })

  const bodyRows = heirs.length
    ? heirs.map((heir, index) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: String(index + 1) })] }),
            new TableCell({ children: [new Paragraph({ text: heir.name || '—' })] }),
            new TableCell({ children: [new Paragraph({ text: heir.relationshipCustom || heir.relationship || '—' })] }),
            new TableCell({ children: [new Paragraph({ text: heir.nidOrBirthRegistration || '' })] }),
            new TableCell({ children: [new Paragraph({ text: heir.commentCustom || heir.comment || '' })] }),
          ],
        }),
      )
    : [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'কোন উত্তরাধিকারী তথ্য নেই' })], columnSpan: 5 }),
          ],
        }),
      ]

  return [headerRow, ...bodyRows]
}

function extractBase64DataUri(dataUri: string): Uint8Array {
  if (!dataUri.startsWith('data:')) {
    return new Uint8Array()
  }

  const base64 = dataUri.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))
}

export async function exportCertificateDocx(
  context: CertificateTemplateContext,
  fileName = 'heir-certificate',
): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: 'center',
            children: [
              new TextRun({
                text: context.settings.unionName,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: 'center',
            children: [new TextRun({ text: context.settings.postOffice, bold: true, size: 24 })],
          }),
          new Paragraph({
            alignment: 'center',
            children: [
              new TextRun({
                text: `${context.settings.upazila}, ${context.settings.district}-${context.settings.postalCode}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ alignment: 'center', children: [new TextRun({ text: `স্মারক: ${context.smarakPrefix}${context.smarakSerial}`, bold: true, size: 20 })] }),
          new Paragraph({ alignment: 'center', children: [new TextRun({ text: 'উত্তরাধিকার/ওয়ারিশ সনদ', bold: true, size: 28 })] }),
          new Paragraph({ alignment: 'center', children: [new TextRun({ text: `তারিখ: ${context.certificateDate}`, size: 18 })] }),
          new Paragraph({
            children: [
              new TextRun({
                text: `এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${context.person.name}, পিতা: ${context.person.fatherOrHusbandName}${context.person.motherName ? `, মাতা: ${context.person.motherName}` : ''}। তিনি অত্র ইউনিয়নের ${context.person.ward ?? 0} নং ওয়ার্ড-এর অন্তর্গত ${context.person.village || 'গ্রামের নাম'} গ্রামের বাসিন্দা ছিলেন।`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'তিনি মৃত্যুকালে নিম্নে উল্লেখিত উত্তরাধিকারী/ওয়ারিশগণকে রেখে গেছেন।',
                size: 22,
              }),
            ],
          }),
          new Table({
            rows: makeDocxTableRows(context.heirs),
            width: {
              size: 100,
              type: 'pct',
            },
          }),
          new Paragraph({ spacing: { before: 220, after: 220 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'ইউপি সদস্যের স্বাক্ষর', bold: true, size: 18 }),
              new TextRun({ text: '           ' }),
              new TextRun({ text: 'চেয়ারম্যানের স্বাক্ষর', bold: true, size: 18 }),
            ],
          }),
          ...(context.qrDataUrl
            ? [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: extractBase64DataUri(context.qrDataUrl),
                      transformation: { width: 80, height: 80 },
                      type: 'png',
                    }),
                  ],
                }),
              ]
            : []),
          new Paragraph({
            children: [new TextRun({ text: `চেয়ারম্যান: ${context.settings.chairmanName}`, size: 18 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `মোবাইল: ${context.settings.chairmanMobile || '—'}`, size: 18 })],
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.docx`
  link.click()
  URL.revokeObjectURL(url)
}
