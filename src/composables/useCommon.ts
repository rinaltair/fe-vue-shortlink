import { getTabConfig } from '@/utils/ui'
import { useSettingStore } from '@/store/modules/setting'
import { useMenuStore } from '@/store/modules/menu'

// Common utilities
export function useCommon() {
  const settingStore = useSettingStore()
  const { showWorkTab, tabStyle } = storeToRefs(settingStore)

  // Is frontend-control mode
  const isFrontendMode = computed(() => {
    return import.meta.env.VITE_ACCESS_MODE === 'frontend'
  })

  // Home path
  const homePath = computed(() => useMenuStore().getHomePath())

  // Refresh page
  const refresh = () => {
    settingStore.reload()
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0 })
  }

  // Page minimum height
  const containerMinHeight = computed(() => {
    const { openHeight, closeHeight } = getTabConfig(tabStyle.value)
    return `calc(100vh - ${showWorkTab.value ? openHeight : closeHeight}px)`
  })

  // Set CSS var for container height
  const setContainerHeightCssVar = () => {
    const height = containerMinHeight.value
    document.documentElement.style.setProperty('--art-full-height', height)
  }

  // Watch container height and update CSS var
  watchEffect(() => {
    setContainerHeightCssVar()
  })

  return {
    isFrontendMode,
    homePath,
    refresh,
    scrollToTop,
    containerMinHeight,
    setContainerHeightCssVar
  }
}
