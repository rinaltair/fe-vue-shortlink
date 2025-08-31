import { useCommon } from '@/composables/useCommon'
import { useTheme } from '@/composables/useTheme'
import { SystemThemeEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'
const { LIGHT, DARK } = SystemThemeEnum

/**
 * Theme switch animation
 * @param e Mouse click event
 */
export const themeAnimation = (e: any) => {
  const x = e.clientX
  const y = e.clientY
  // Compute max circle radius from click to viewport edge
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // Set CSS variables
  document.documentElement.style.setProperty('--x', x + 'px')
  document.documentElement.style.setProperty('--y', y + 'px')
  document.documentElement.style.setProperty('--r', endRadius + 'px')

  if (document.startViewTransition) {
    document.startViewTransition(() => toggleTheme())
  } else {
    toggleTheme()
  }
}

/**
 * Toggle theme
 */
const toggleTheme = () => {
  useTheme().switchThemeStyles(useSettingStore().systemThemeType === LIGHT ? DARK : LIGHT)
  useCommon().refresh()
}

/**
 * Improve refresh visual effect under dark theme
 * @param addClass Whether to add class
 */
export const setThemeTransitionClass = (addClass: boolean) => {
  const el = document.getElementsByTagName('body')[0]

  if (addClass) {
    el.setAttribute('class', 'theme-change')
  } else {
    setTimeout(() => {
      el.removeAttribute('class')
    }, 300)
  }
}
