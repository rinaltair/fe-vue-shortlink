import { useTheme } from '@/composables/useTheme'
import { useSettingStore } from '@/store/modules/setting'
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import AppConfig from '@/config'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import i18n, { $t } from '@/locales'

/** Extended route record type */
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean
}

/** Top progress bar configuration */
export const configureNProgress = () => {
  NProgress.configure({
    easing: 'ease',
    speed: 600,
    showSpinner: false,
    trickleSpeed: 200,
    parent: 'body'
  })
}

/**
 * Set the page title by combining route meta title and system info
 * @param to Current route object
 */
export const setPageTitle = (to: RouteLocationNormalized): void => {
  const { title } = to.meta
  if (title) {
    setTimeout(() => {
      document.title = `${formatMenuTitle(String(title))} - ${AppConfig.systemInfo.name}`
    }, 150)
  }
}

/**
 * Set system theme based on route meta
 * @param to Current route object
 */
export const setSystemTheme = (to: RouteLocationNormalized): void => {
  if (to.meta.setTheme) {
    useTheme().switchThemeStyles(useSettingStore().systemThemeType)
  }
}

/**
 * Format menu title
 * @param title Menu title; can be an i18n key or a plain string
 * @returns Formatted title
 */
export const formatMenuTitle = (title: string): string => {
  if (title) {
    if (title.startsWith('menus.')) {
      // Use te() to check if the translation key exists to avoid console warnings
      if (i18n.global.te(title)) {
        return $t(title)
      } else {
        // If translation is missing, return the last part of the key as a fallback
        return title.split('.').pop() || title
      }
    }
    return title
  }
  return ''
}
