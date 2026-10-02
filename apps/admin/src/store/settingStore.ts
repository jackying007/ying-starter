import { create } from 'zustand'

import { storage } from '@ying/shared-web'

import { StorageEnum, ThemeColorPresets, ThemeNavLayout, ThemeMode } from '@/types/enum'
import { colorPresets } from '@/theme/config'

type SettingsType = {
  themeColorPresets: ThemeColorPresets
  themeMode: ThemeMode
  themeLayout: ThemeNavLayout
  themeStretch: boolean
  breadCrumb: boolean
  multiTab: boolean
  navCollapsed: boolean
}
type SettingStore = {
  settings: SettingsType
}

const useSettingStore = create<SettingStore>(() => {
  const settings = storage.getItem<SettingsType>(StorageEnum.Settings) ?? {
    themeColorPresets: ThemeColorPresets.Purple,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeNavLayout.Vertical,
    themeStretch: true,
    breadCrumb: true,
    multiTab: true,
    navCollapsed: false
  }

  document.documentElement.classList.add(settings.themeMode)

  const colorPrimary = colorPresets[settings.themeColorPresets]
  document.documentElement.style.setProperty('--primary', colorPrimary)

  return {
    settings
  }
})

export const useSettings = () => useSettingStore(state => state.settings)

export const setSettings = (settings: SettingsType) => {
  const oldSettings = useSettingStore.getState().settings
  if (oldSettings.themeMode !== settings.themeMode) {
    document.documentElement.classList.remove(ThemeMode.Light, ThemeMode.Dark)
    document.documentElement.classList.add(settings.themeMode)
  }
  if (oldSettings.themeColorPresets !== settings.themeColorPresets) {
    const colorPrimary = colorPresets[settings.themeColorPresets]
    document.documentElement.style.setProperty('--primary', colorPrimary)
  }
  useSettingStore.setState({ settings })
  storage.setItem(StorageEnum.Settings, settings)
}
