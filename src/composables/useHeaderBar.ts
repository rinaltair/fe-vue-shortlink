/**
 * Header bar feature management composable
 * Provides configuration and state control for top bar features
 */

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { headerBarConfig } from '@/config/headerBar'
import { HeaderBarFeatureConfig } from '@/types'

/**
 * Header bar feature management
 * @returns Related state and methods
 */
export function useHeaderBar() {
  const settingStore = useSettingStore()

  // Get header bar config
  const headerBarConfigRef = computed<HeaderBarFeatureConfig>(() => headerBarConfig)

  // Get related state from store
  const { showMenuButton, showFastEnter, showRefreshButton, showCrumbs, showLanguage } =
    storeToRefs(settingStore)

  /**
   * Check if a feature is enabled
   * @param feature Feature name
   * @returns Whether enabled
   */
  const isFeatureEnabled = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return headerBarConfigRef.value[feature]?.enabled ?? false
  }

  /**
   * Get feature configuration
   * @param feature Feature name
   * @returns Feature config
   */
  const getFeatureConfig = (feature: keyof HeaderBarFeatureConfig) => {
    return headerBarConfigRef.value[feature]
  }

  // Should show menu button
  const shouldShowMenuButton = computed(() => {
    return isFeatureEnabled('menuButton') && showMenuButton.value
  })

  // Should show refresh button
  const shouldShowRefreshButton = computed(() => {
    return isFeatureEnabled('refreshButton') && showRefreshButton.value
  })

  // Should show fast entry
  const shouldShowFastEnter = computed(() => {
    return isFeatureEnabled('fastEnter') && showFastEnter.value
  })

  // Should show breadcrumb
  const shouldShowBreadcrumb = computed(() => {
    return isFeatureEnabled('breadcrumb') && showCrumbs.value
  })

  // Should show global search
  const shouldShowGlobalSearch = computed(() => {
    return isFeatureEnabled('globalSearch')
  })

  // Should show fullscreen button
  const shouldShowFullscreen = computed(() => {
    return isFeatureEnabled('fullscreen')
  })

  // Should show notification center
  const shouldShowNotification = computed(() => {
    return isFeatureEnabled('notification')
  })

  // Should show chat
  const shouldShowChat = computed(() => {
    return isFeatureEnabled('chat')
  })

  // Should show language switch
  const shouldShowLanguage = computed(() => {
    return isFeatureEnabled('language') && showLanguage.value
  })

  // Should show settings panel
  const shouldShowSettings = computed(() => {
    return isFeatureEnabled('settings')
  })

  // Should show theme toggle
  const shouldShowThemeToggle = computed(() => {
    return isFeatureEnabled('themeToggle')
  })

  // Get minimum width for fast entry
  const fastEnterMinWidth = computed(() => {
    const config = getFeatureConfig('fastEnter')
    return (config as any)?.minWidth || 1200
  })

  /**
   * Check if a feature is enabled (alias)
   * @param feature Feature name
   * @returns Whether enabled
   */
  const isFeatureActive = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return isFeatureEnabled(feature)
  }

  /**
   * Get feature config (alias)
   * @param feature Feature name
   * @returns Feature config
   */
  const getFeatureInfo = (feature: keyof HeaderBarFeatureConfig) => {
    return getFeatureConfig(feature)
  }

  /**
   * Get all enabled features
   * @returns Enabled feature names
   */
  const getEnabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * Get all disabled features
   * @returns Disabled feature names
   */
  const getDisabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => !headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * Get all enabled features (alias)
   * @returns Enabled features
   */
  const getActiveFeatures = () => {
    return getEnabledFeatures()
  }

  /**
   * Get all disabled features (alias)
   * @returns Disabled features
   */
  const getInactiveFeatures = () => {
    return getDisabledFeatures()
  }

  return {
    // Config
    headerBarConfig: headerBarConfigRef,

    // Visibility computed flags
    shouldShowMenuButton, // Show menu button
    shouldShowRefreshButton, // Show refresh button
    shouldShowFastEnter, // Show fast entry
    shouldShowBreadcrumb, // Show breadcrumb
    shouldShowGlobalSearch, // Show global search
    shouldShowFullscreen, // Show fullscreen button
    shouldShowNotification, // Show notification center
    shouldShowChat, // Show chat
    shouldShowLanguage, // Show language switch
    shouldShowSettings, // Show settings panel
    shouldShowThemeToggle, // Show theme toggle

    // Config helpers
    fastEnterMinWidth, // Fast entry minimum width

    // Methods
    isFeatureEnabled, // Check if enabled
    isFeatureActive, // Alias of isFeatureEnabled
    getFeatureConfig, // Get feature config
    getFeatureInfo, // Alias of getFeatureConfig
    getEnabledFeatures, // Get enabled features
    getDisabledFeatures, // Get disabled features
    getActiveFeatures, // Alias: get enabled features
    getInactiveFeatures // Alias: get disabled features
  }
}
