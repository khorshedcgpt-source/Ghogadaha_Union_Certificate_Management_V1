import type { UnionSettings, Village, Ward } from '../types/models'
import { UnionSettingsForm } from './UnionSettingsForm'
import { VillageManagement } from './VillageManagement'
import { WardManagement } from './WardManagement'

interface SettingsPageProps {
  settings: UnionSettings
  wards: Ward[]
  villages: Village[]
  onSettingsChange: (value: UnionSettings) => void
  onSaveSettings: () => Promise<void> | void
  onSaveWards: () => Promise<void> | void
  onSaveVillage: (village: Village) => Promise<void> | void
  onDeleteVillage: (id: string) => Promise<void> | void
  onWardChange: (next: Ward[]) => void
  savingSettings: boolean
  savingWards: boolean
}

export function SettingsPage({
  settings,
  wards,
  villages,
  onSettingsChange,
  onSaveSettings,
  onSaveWards,
  onSaveVillage,
  onDeleteVillage,
  onWardChange,
  savingSettings,
  savingWards,
}: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <UnionSettingsForm
        value={settings}
        onChange={onSettingsChange}
        onSave={onSaveSettings}
        saving={savingSettings}
      />

      <WardManagement
        wards={wards}
        onChange={onWardChange}
        onSave={onSaveWards}
        saving={savingWards}
      />

      <VillageManagement
        wards={wards}
        villages={villages}
        onSaveVillage={onSaveVillage}
        onDeleteVillage={onDeleteVillage}
      />
    </div>
  )
}
