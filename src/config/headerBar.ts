/**
 * Header bar feature configuration
 * Controls enabling/disabling various features in the top bar
 */

import { HeaderBarFeatureConfig } from '@/types'

// Header bar feature configuration
export const headerBarConfig: HeaderBarFeatureConfig = {
  menuButton: {
    enabled: true,
    description: 'Toggle the left sidebar open/close'
  },
  refreshButton: {
    enabled: true,
    description: 'Refresh current page'
  },
  fastEnter: {
    enabled: true,
    description: 'Fast entry: quick access to apps and links'
  },
  breadcrumb: {
    enabled: true,
    description: 'Breadcrumb navigation showing current path'
  },
  globalSearch: {
    enabled: true,
    description: 'Global search (Ctrl+K / Cmd+K)'
  },
  fullscreen: {
    enabled: true,
    description: 'Toggle fullscreen'
  },
  notification: {
    enabled: true,
    description: 'Notification center for system messages'
  },
  chat: {
    enabled: true,
    description: 'Chat for real-time communication'
  },
  language: {
    enabled: true,
    description: 'Language switcher'
  },
  settings: {
    enabled: true,
    description: 'System settings panel'
  },
  themeToggle: {
    enabled: true,
    description: 'Theme toggle (light/dark)'
  }
}

export default headerBarConfig
