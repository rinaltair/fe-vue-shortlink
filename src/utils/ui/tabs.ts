/**
 * Tab container height and top offset configuration
 * @param {Object} tab-default - default tab style config
 * @param {number} openTop - top padding when tabs are open
 * @param {number} closeTop - top padding when tabs are closed
 * @param {number} openHeight - total height when open
 * @param {number} closeHeight - total height when closed
 */
export const TAB_CONFIG = {
  'tab-default': {
    openTop: 106,
    closeTop: 60,
    openHeight: 121,
    closeHeight: 75
  },
  'tab-card': {
    openTop: 122,
    closeTop: 78,
    openHeight: 139,
    closeHeight: 95
  },
  'tab-google': {
    openTop: 122,
    closeTop: 78,
    openHeight: 139,
    closeHeight: 95
  }
}

// Get current tab style config with default
export const getTabConfig = (style: string) => {
  return TAB_CONFIG[style as keyof typeof TAB_CONFIG] || TAB_CONFIG['tab-card'] // default to tab-card
}
