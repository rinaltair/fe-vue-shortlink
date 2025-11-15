import { createI18n } from 'vue-i18n'
import type { I18n, I18nOptions } from 'vue-i18n'
import { LanguageEnum } from '@/enums/appEnum'
import { getSystemStorage } from '@/utils/storage'
import { StorageKeyManager } from '@/utils/storage/storage-key-manager'
// Synchronously import language files
import enMessages from './langs/en.json'
// import zhMessages from './langs/zh.json'

// Create storage key manager instance
const storageKeyManager = new StorageKeyManager()

const messages = {
  [LanguageEnum.EN]: enMessages
  // [LanguageEnum.ZH]: zhMessages
}

// Language options
export const languageOptions = [
  // { value: LanguageEnum.ZH, label: 'Simplified Chinese' },
  { value: LanguageEnum.EN, label: 'English' }
]

/**
 * Get language from storage
 * @returns Language setting; returns default on failure
 */
const getDefaultLanguage = (): LanguageEnum => {
  // Try to read from versioned storage
  try {
    const storageKey = storageKeyManager.getStorageKey('user')
    const userStore = localStorage.getItem(storageKey)

    if (userStore) {
      const { language } = JSON.parse(userStore)
      if (language && Object.values(LanguageEnum).includes(language)) {
        return language
      }
    }
  } catch (error) {
    console.warn('[i18n] Failed to get language from versioned storage:', error)
  }

  // Try to read from system storage
  try {
    const sys = getSystemStorage()
    if (sys) {
      const { user } = JSON.parse(sys)
      if (user?.language && Object.values(LanguageEnum).includes(user.language)) {
        return user.language
      }
    }
  } catch (error) {
    console.warn('[i18n] Failed to get language from system storage:', error)
  }

  // Fallback to default language (English)
  console.debug('[i18n] Using default language:', LanguageEnum.EN)
  return LanguageEnum.EN
}

const i18nOptions: I18nOptions = {
  locale: getDefaultLanguage(),
  legacy: false,
  globalInjection: true,
  fallbackLocale: LanguageEnum.EN,
  messages
}

const i18n: I18n = createI18n(i18nOptions)

interface Translation {
  (key: string): string
}

export const $t = i18n.global.t as Translation

export default i18n
