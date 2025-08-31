/**
 * Type definitions related to configuration
 */

import { MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// Theme setting
export interface ThemeSetting {
  name: string
  theme: SystemThemeEnum
  color: string[]
  leftLineColor: string
  rightLineColor: string
  img: string
}

// Menu layout
export interface MenuLayout {
  name: string
  value: MenuTypeEnum
  img: string
  description?: string
}

// Festival configuration
export interface FestivalConfig {
  date: string
  name: string
  image: string
  scrollText: string
  isActive?: boolean
}

// System basic configuration
export interface SystemBasicConfig {
  // System name
  name: string
  // System description
  description?: string
  // System logo
  logo?: string
  // System favicon
  favicon?: string
  // Copyright info
  copyright?: string
}

// Fast enter application item
export interface FastEnterApplication {
  /** Application name */
  name: string
  /** Application description */
  description: string
  /** Icon code */
  icon: string
  /** Icon color */
  iconColor: string
  /** Route path */
  path: string
  /** Whether enabled */
  enabled?: boolean
  /** Sort weight */
  order?: number
}

// Fast enter quick link item
export interface FastEnterQuickLink {
  /** Link name */
  name: string
  /** Route path */
  path: string
  /** Whether enabled */
  enabled?: boolean
  /** Sort weight */
  order?: number
}

// Fast enter configuration
export interface FastEnterConfig {
  /** Applications */
  applications: FastEnterApplication[]
  /** Quick links */
  quickLinks: FastEnterQuickLink[]
  /** Display condition (screen width) */
  minWidth?: number
}

// System configuration
export interface SystemConfig {
  // Element Plus theme config
  elementPlusTheme: {
    primary: string
  }
  // System basic info
  systemInfo: SystemBasicConfig
  // System theme styles
  systemThemeStyles: SystemThemeTypes
  // Setting theme list
  settingThemeList: ThemeSetting[]
  // Menu layout list
  menuLayoutList: MenuLayout[]
  // Theme list
  themeList: MenuThemeType[]
  // Dark menu styles
  darkMenuStyles: MenuThemeType[]
  // System main colors
  systemMainColor: readonly string[]
  // System settings
  systemSetting: {
    defaultMenuWidth: number
    defaultCustomRadius: string
    defaultTabStyle: string
  }
  // Fast enter configuration
  fastEnter?: FastEnterConfig
  // Header bar feature configuration
  headerBar?: HeaderBarFeatureConfig
}

// Environment configuration
export interface EnvConfig {
  // Environment name
  NODE_ENV: string
  // App version
  VITE_VERSION: string
  // App port
  VITE_PORT: string
  // App base URL
  VITE_BASE_URL: string
  // API base URL
  VITE_API_URL: string
  // Whether mock is enabled
  VITE_USE_MOCK?: string
  // Whether gzip is enabled
  VITE_USE_GZIP?: string
  // Whether CDN is enabled
  VITE_USE_CDN?: string
}

// Application configuration
export interface AppConfig extends SystemConfig {
  // Environment config
  env: EnvConfig
  // Development mode
  isDev: boolean
  // Production mode
  isProd: boolean
  // Test mode
  isTest: boolean
}

// Feature config base interface
export interface FeatureConfigItem {
  enabled: boolean
  description: string
}

// Header bar feature configuration interface
export interface HeaderBarFeatureConfig {
  /** Menu button */
  menuButton: FeatureConfigItem
  /** Refresh button */
  refreshButton: FeatureConfigItem
  /** Fast enter */
  fastEnter: FeatureConfigItem
  /** Breadcrumb */
  breadcrumb: FeatureConfigItem
  /** Global search */
  globalSearch: FeatureConfigItem
  /** Fullscreen */
  fullscreen: FeatureConfigItem
  /** Notifications */
  notification: FeatureConfigItem
  /** Chat */
  chat: FeatureConfigItem
  /** Language switch */
  language: FeatureConfigItem
  /** Settings panel */
  settings: FeatureConfigItem
  /** Theme toggle */
  themeToggle: FeatureConfigItem
}
