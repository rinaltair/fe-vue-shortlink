import { useSettingStore } from '@/store/modules/setting'
import { MenuThemeEnum, MenuTypeEnum } from '@/enums/appEnum'

/**
 * Settings state management
 */
export function useSettingsState() {
  const settingStore = useSettingStore()

  // Color-weak mode init
  const initColorWeak = () => {
    if (settingStore.colorWeak) {
      const el = document.getElementsByTagName('html')[0]
      setTimeout(() => {
        el.classList.add('color-weak')
      }, 100)
    }
  }

  // Menu layout toggle
  const switchMenuLayouts = (type: MenuTypeEnum) => {
    if (type === MenuTypeEnum.LEFT || type === MenuTypeEnum.TOP_LEFT) {
      settingStore.setMenuOpen(true)
    }
    settingStore.switchMenuLayouts(type)
    if (type === MenuTypeEnum.DUAL_MENU) {
      settingStore.switchMenuStyles(MenuThemeEnum.DESIGN)
      settingStore.setMenuOpen(true)
    }
  }

  return {
    // Methods
    initColorWeak,
    switchMenuLayouts
  }
}
