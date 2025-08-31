import { useSettingStore } from '@/store/modules/setting'
import { SystemThemeEnum } from '@/enums/appEnum'
import AppConfig from '@/config'
import { SystemThemeTypes } from '@/types/store'
import { getDarkColor, getLightColor } from '@/utils/ui'

export function useTheme() {
  const settingStore = useSettingStore()

  // Disable transitions
  const disableTransitions = () => {
    const style = document.createElement('style')
    style.setAttribute('id', 'disable-transitions')
    style.textContent = '* { transition: none !important; }'
    document.head.appendChild(style)
  }

  // Enable transitions
  const enableTransitions = () => {
    const style = document.getElementById('disable-transitions')
    if (style) {
      style.remove()
    }
  }

  // Set system theme
  const setSystemTheme = (theme: SystemThemeEnum, themeMode?: SystemThemeEnum) => {
    // Temporarily disable transitions
    disableTransitions()

    const el = document.getElementsByTagName('html')[0]
    const isDark = theme === SystemThemeEnum.DARK

    if (!themeMode) {
      themeMode = theme
    }

    const currentTheme = AppConfig.systemThemeStyles[theme as keyof SystemThemeTypes]

    if (currentTheme) {
      el.setAttribute('class', currentTheme.className)
    }

    // Adjust button colors (lighter/darker)
    const primary = settingStore.systemThemeColor

    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        isDark ? `${getDarkColor(primary, i / 10)}` : `${getLightColor(primary, i / 10)}`
      )
    }

    // Update theme setting in store
    settingStore.setGlopTheme(theme, themeMode)

    // Use requestAnimationFrame to restore transitions next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions()
      })
    })
  }

  // Auto-set system theme
  const setSystemAutoTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setSystemTheme(SystemThemeEnum.DARK, SystemThemeEnum.AUTO)
    } else {
      setSystemTheme(SystemThemeEnum.LIGHT, SystemThemeEnum.AUTO)
    }
  }

  // Toggle theme
  const switchThemeStyles = (theme: SystemThemeEnum) => {
    if (theme === SystemThemeEnum.AUTO) {
      setSystemAutoTheme()
    } else {
      setSystemTheme(theme)
    }
  }

  return {
    setSystemTheme,
    setSystemAutoTheme,
    switchThemeStyles
  }
}
