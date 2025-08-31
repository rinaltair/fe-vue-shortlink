import { ref, computed, watch } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuTypeEnum } from '@/enums/appEnum'
import { mittBus } from '@/utils/sys'
import { useTheme } from '@/composables/useTheme'
import { useCeremony } from '@/composables/useCeremony'
import { useSettingsState } from './useSettingsState'
import { useSettingsHandlers } from './useSettingsHandlers'

/**
 * Settings panel core logic
 */
export function useSettingsPanel() {
  const settingStore = useSettingStore()
  const { systemThemeType, systemThemeMode, menuType } = storeToRefs(settingStore)

  // Composables
  const { openFestival, cleanup } = useCeremony()
  const { setSystemTheme, setSystemAutoTheme } = useTheme()
  const { initColorWeak } = useSettingsState()
  const { domOperations } = useSettingsHandlers()

  // Reactive state
  const showDrawer = ref(false)
  const { width } = useWindowSize()

  // Remember menu type before window width change
  const beforeMenuType = ref<MenuTypeEnum>()
  const hasChangedMenu = ref(false)

  // Computed
  const systemThemeColor = computed(() => settingStore.systemThemeColor as string)

  // Theme handling
  const useThemeHandlers = () => {
    // Init system color
    const initSystemColor = () => {
      if (!AppConfig.systemMainColor.includes(systemThemeColor.value)) {
        settingStore.setElementTheme(AppConfig.systemMainColor[0])
        settingStore.reload()
      }
    }

    // Init system theme
    const initSystemTheme = () => {
      if (systemThemeMode.value === SystemThemeEnum.AUTO) {
        setSystemAutoTheme()
      } else {
        setSystemTheme(systemThemeType.value)
      }
    }

    // Watch system theme change
    const listenerSystemTheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', initSystemTheme)
      return () => {
        mediaQuery.removeEventListener('change', initSystemTheme)
      }
    }

    return {
      initSystemColor,
      initSystemTheme,
      listenerSystemTheme
    }
  }

  // Responsive layout handling
  const useResponsiveLayout = () => {
    const handleWindowResize = () => {
      watch(width, (newWidth: number) => {
        if (newWidth < 1000) {
          if (!hasChangedMenu.value) {
            beforeMenuType.value = menuType.value
            useSettingsState().switchMenuLayouts(MenuTypeEnum.LEFT)
            settingStore.setMenuOpen(false)
            hasChangedMenu.value = true
          }
        } else {
          if (hasChangedMenu.value && beforeMenuType.value) {
            useSettingsState().switchMenuLayouts(beforeMenuType.value)
            settingStore.setMenuOpen(true)
            hasChangedMenu.value = false
          }
        }
      })
    }

    return { handleWindowResize }
  }

  // Drawer control
  const useDrawerControl = () => {
    // Open drawer
    const handleOpen = () => {
      setTimeout(() => {
        domOperations.setBodyClass('theme-change', true)
      }, 500)
    }

    // Close drawer
    const handleClose = () => {
      domOperations.setBodyClass('theme-change', false)
    }

    // Open settings
    const openSetting = () => {
      showDrawer.value = true
    }

    // Close settings
    const closeDrawer = () => {
      showDrawer.value = false
    }

    return {
      handleOpen,
      handleClose,
      openSetting,
      closeDrawer
    }
  }

  // Watch props
  const usePropsWatcher = (props: { open?: boolean }) => {
    watch(
      () => props.open,
      (val: boolean | undefined) => {
        if (val !== undefined) {
          showDrawer.value = val
        }
      }
    )
  }

  // Init settings
  const useSettingsInitializer = () => {
    const themeHandlers = useThemeHandlers()
    const { openSetting } = useDrawerControl()
    let themeCleanup: (() => void) | null = null

    const initializeSettings = () => {
      mittBus.on('openSetting', openSetting)
      themeHandlers.initSystemColor()
      themeCleanup = themeHandlers.listenerSystemTheme()
      initColorWeak()

      // Set box mode
      const boxMode = settingStore.boxBorderMode ? 'border-mode' : 'shadow-mode'
      setTimeout(() => {
        domOperations.setRootAttribute('data-box-mode', boxMode)
      }, 50)

      themeHandlers.initSystemTheme()
      openFestival()
    }

    const cleanupSettings = () => {
      themeCleanup?.()
      cleanup()
    }

    return {
      initializeSettings,
      cleanupSettings
    }
  }

  return {
    // State
    showDrawer,

    // Methods
    useThemeHandlers,
    useResponsiveLayout,
    useDrawerControl,
    usePropsWatcher,
    useSettingsInitializer
  }
}
