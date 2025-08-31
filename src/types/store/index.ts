/**
 * Store-related type definitions
 */

import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { LocationQueryRaw } from 'vue-router'

// System theme style (light | dark)
export interface SystemThemeType {
  className: string
}

// Type containing multiple themes
export type SystemThemeTypes = {
  [key in Exclude<SystemThemeEnum, SystemThemeEnum.AUTO>]: SystemThemeType
}

// Menu theme style
export interface MenuThemeType {
  theme: MenuThemeEnum
  background: string
  systemNameColor: string
  textColor: string
  textActiveColor: string
  iconColor: string
  iconActiveColor: string
  tabBarBackground: string
  systemBackground: string
  leftLineColor: string
  rightLineColor: string
  img?: string
}

// Settings center
export interface SettingState {
  theme: string
  uniqueOpened: boolean
  menuButton: boolean
  showRefreshButton: boolean
  showCrumbs: boolean
  autoClose: boolean
  showWorkTab: boolean
  showLanguage: boolean
  showNprogress: boolean
  themeModel: string
}

// Work tabs
export interface WorkTab {
  title: string
  customTitle?: string
  path: string
  name: string
  keepAlive: boolean
  fixedTab?: boolean
  params?: object
  query?: LocationQueryRaw
  icon?: string
  isActive?: boolean
}

// User store state
export interface UserState {
  userInfo: Api.User.UserInfo | null
  token: string | null
  roles: string[]
  permissions: string[]
}

// Settings store state
export interface SettingStoreState extends SettingState {
  // Additional settings state
  collapsed: boolean
  device: 'desktop' | 'mobile'
  language: string
}

// Worktab store state
export interface WorkTabState {
  tabs: WorkTab[]
  activeTab: string
  cachedTabs: string[]
}

// Menu store state
export interface MenuState {
  menuList: any[]
  isLoaded: boolean
  collapsed: boolean
}

// Root store state type
export interface RootState {
  user: UserState
  setting: SettingStoreState
  workTab: WorkTabState
  menu: MenuState
}
