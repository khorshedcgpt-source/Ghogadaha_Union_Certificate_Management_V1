import {
  db,
  listFamilyIdentityMappings,
  listPermanentPersons,
  listQrPayloads,
  listSnapshots,
  listTemplateVersions,
  listVillages,
  listWards,
} from '../db'
import type {
  CertificateSnapshot,
  FamilyIdentityMapping,
  Person,
  QrPayloadRecord,
  TemplateVersion,
  UnionSettings,
  Village,
  Ward,
} from '../types/models'

export const BACKUP_FORMAT_VERSION = 1
export const BACKUP_APP_SCHEMA_VERSION = 2

export interface AppBackupEnvelope {
  formatVersion: number
  appSchemaVersion: number
  exportedAt: string
  data: {
    settings: UnionSettings[]
    wards: Ward[]
    villages: Village[]
    persons: Person[]
    familyIdentityMappings: FamilyIdentityMapping[]
    certificateHistory: CertificateSnapshot[]
    templateVersions: TemplateVersion[]
    qrPayloads: QrPayloadRecord[]
  }
  checksum: string
}

export function computeChecksum(payload: string): string {
  let hash = 2166136261
  for (let index = 0; index < payload.length; index += 1) {
    const code = payload.charCodeAt(index)
    hash ^= code
    hash = Math.imul(hash, 16777619)
  }

  return `sha256-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export async function buildBackupEnvelope(): Promise<AppBackupEnvelope> {
  const [settingsResult, wards, villages, persons, familyMappings, snapshots, templateVersions, qrPayloads] = await Promise.all([
    db.settings.toArray(),
    listWards(),
    listVillages(),
    listPermanentPersons(),
    listFamilyIdentityMappings(),
    listSnapshots(),
    listTemplateVersions(),
    listQrPayloads(),
  ])

  const data = {
    settings: settingsResult,
    wards,
    villages,
    persons,
    familyIdentityMappings: familyMappings,
    certificateHistory: snapshots,
    templateVersions,
    qrPayloads,
  }

  const payload = JSON.stringify(data)
  const checksum = computeChecksum(payload)

  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    appSchemaVersion: BACKUP_APP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
    checksum,
  }
}

export function downloadBackupFile(backup: AppBackupEnvelope, fileNamePrefix = 'ghogadaha-backup'): void {
  const payload = JSON.stringify(backup, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

  link.href = url
  link.download = `${fileNamePrefix}-${timestamp}.json`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportJsonBackup(): Promise<AppBackupEnvelope> {
  const backup = await buildBackupEnvelope()
  downloadBackupFile(backup)
  return backup
}

export function validateBackupEnvelope(value: unknown): { valid: boolean; errors: string[]; backup?: AppBackupEnvelope } {
  if (!value || typeof value !== 'object') {
    return { valid: false, errors: ['ব্যাকআপ ফাইলটি ভ্যালিড JSON নয়।'] }
  }

  const backup = value as Record<string, unknown>
  const errors: string[] = []

  if (backup.formatVersion !== BACKUP_FORMAT_VERSION) {
    errors.push(`ব্যাকআপ ফরম্যাট ভার্সন সমর্থিত নয়: ${String(backup.formatVersion ?? 'অজানা')}`)
  }

  if (backup.appSchemaVersion !== BACKUP_APP_SCHEMA_VERSION) {
    errors.push(`অ্যাপ স্কিমা ভার্সন সমর্থিত নয়: ${String(backup.appSchemaVersion ?? 'অজানা')}`)
  }

  if (typeof backup.exportedAt !== 'string' || !backup.exportedAt) {
    errors.push('ব্যাকআপের সময় স্ট্যাম্প অনুপস্থিত।')
  }

  if (!backup.data || typeof backup.data !== 'object') {
    errors.push('ব্যাকআপের data সেকশন অনুপস্থিত।')
    return { valid: false, errors }
  }

  const data = backup.data as Record<string, unknown>
  const expectedSections = [
    'settings',
    'wards',
    'villages',
    'persons',
    'familyIdentityMappings',
    'certificateHistory',
    'templateVersions',
    'qrPayloads',
  ] as const

  for (const section of expectedSections) {
    const sectionValue = data[section]
    if (sectionValue === undefined || sectionValue === null) {
      errors.push(`ব্যাকআপের ${section} সেকশন অনুপস্থিত।`)
      continue
    }

    if (!Array.isArray(sectionValue)) {
      errors.push(`ব্যাকআপের ${section} সেকশনটি অ্যারে নয়।`)
    }
  }

  if (typeof backup.checksum !== 'string' || backup.checksum.length === 0) {
    errors.push('ব্যাকআপ checksum অনুপস্থিত।')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    backup: backup as unknown as AppBackupEnvelope,
  }
}

export async function parseBackupFile(file: File): Promise<AppBackupEnvelope> {
  const text = await file.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new Error(`ব্যাকআপ JSON পড়তে সমস্যা হয়েছে: ${error instanceof Error ? error.message : 'অজানা সমস্যা'}`)
  }

  const validation = validateBackupEnvelope(parsed)
  if (!validation.valid || !validation.backup) {
    throw new Error(validation.errors.join(' '))
  }

  const expectedChecksum = computeChecksum(JSON.stringify(validation.backup.data))
  if (validation.backup.checksum && validation.backup.checksum !== expectedChecksum) {
    throw new Error('ব্যাকআপ checksum মিলছে না। ফাইলটি বিকৃত বা অসম্পূর্ণ হতে পারে।')
  }

  return validation.backup
}

export async function restoreBackupEnvelope(backup: AppBackupEnvelope): Promise<{ restoredCount: number; warnings: string[] }> {
  const validation = validateBackupEnvelope(backup)
  if (!validation.valid || !validation.backup) {
    throw new Error(validation.errors.join(' '))
  }

  const normalizedBackup = validation.backup
  const warnings: string[] = []

  const settings = Array.isArray(normalizedBackup.data.settings) ? normalizedBackup.data.settings : []
  const wards = Array.isArray(normalizedBackup.data.wards) ? normalizedBackup.data.wards : []
  const villages = Array.isArray(normalizedBackup.data.villages) ? normalizedBackup.data.villages : []
  const persons = Array.isArray(normalizedBackup.data.persons) ? normalizedBackup.data.persons : []
  const familyMappings = Array.isArray(normalizedBackup.data.familyIdentityMappings) ? normalizedBackup.data.familyIdentityMappings : []
  const snapshots = Array.isArray(normalizedBackup.data.certificateHistory) ? normalizedBackup.data.certificateHistory : []
  const templateVersions = Array.isArray(normalizedBackup.data.templateVersions) ? normalizedBackup.data.templateVersions : []
  const qrPayloads = Array.isArray(normalizedBackup.data.qrPayloads) ? normalizedBackup.data.qrPayloads : []

  if (settings.length === 0) {
    warnings.push('ব্যাকআপে সেটিংস খালি ছিল।')
  }

  if (wards.length === 0) {
    warnings.push('ব্যাকআপে ওয়ার্ড ডাটা পাওয়া যায়নি।')
  }

  await db.transaction(
    'rw',
    db.settings,
    db.wards,
    db.villages,
    db.persons,
    db.familyIdentityMappings,
    async () => {
      await db.settings.clear()
      await db.wards.clear()
      await db.villages.clear()
      await db.persons.clear()
      await db.familyIdentityMappings.clear()

      if (settings.length > 0) {
        await db.settings.bulkPut(settings)
      }

      if (wards.length > 0) {
        await db.wards.bulkPut(wards)
      }

      if (villages.length > 0) {
        await db.villages.bulkPut(villages)
      }

      if (persons.length > 0) {
        await db.persons.bulkPut(persons)
      }

      if (familyMappings.length > 0) {
        await db.familyIdentityMappings.bulkPut(familyMappings)
      }
    },
  )

  await db.transaction(
    'rw',
    db.certificateSnapshots,
    db.templateVersions,
    db.qrPayloads,
    async () => {
      await db.certificateSnapshots.clear()
      await db.templateVersions.clear()
      await db.qrPayloads.clear()

      if (snapshots.length > 0) {
        await db.certificateSnapshots.bulkPut(snapshots)
      }

      if (templateVersions.length > 0) {
        await db.templateVersions.bulkPut(templateVersions)
      }

      if (qrPayloads.length > 0) {
        await db.qrPayloads.bulkPut(qrPayloads)
      }
    },
  )

  return {
    restoredCount: settings.length + wards.length + villages.length + persons.length + familyMappings.length + snapshots.length + templateVersions.length + qrPayloads.length,
    warnings,
  }
}

export function formatBackupWarningMessage(message: string): string {
  return message.trim() || 'ব্যাকআপে সমস্যা দেখা দিয়েছে।'
}

export function hasValidRestorePayload(value: unknown): boolean {
  const result = validateBackupEnvelope(value)
  return result.valid
}

export function exportSafetyBackupBeforeRestore(): AppBackupEnvelope {
  const backup = {
    formatVersion: BACKUP_FORMAT_VERSION,
    appSchemaVersion: BACKUP_APP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      settings: [],
      wards: [],
      villages: [],
      persons: [],
      familyIdentityMappings: [],
      certificateHistory: [],
      templateVersions: [],
      qrPayloads: [],
    },
    checksum: '',
  }

  backup.checksum = computeChecksum(JSON.stringify(backup.data))
  return backup
}
