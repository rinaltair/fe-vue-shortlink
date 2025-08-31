/**
 * Routing-related utility functions
 */

import { AppRouteRecord } from '@/types'

// Check whether this is an iframe route
export function isIframe(url: string): boolean {
  return url.startsWith('/outside/iframe/')
}

/**
 * Validate whether a menu item is valid
 * @param menuItem Menu item
 * @returns Whether it is a valid menu item
 */
const isValidMenuItem = (menuItem: AppRouteRecord): boolean => {
  return !!(menuItem.path && menuItem.path.trim() && !menuItem.meta?.isHide)
}

/**
 * Normalize path format
 * @param path Path
 * @returns Normalized path
 */
const normalizePath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Recursively get the first valid path from menu list
 * @param menuList Menu list
 * @returns The first valid path, or an empty string if none
 */
export const getFirstMenuPath = (menuList: AppRouteRecord[]): string => {
  if (!Array.isArray(menuList) || menuList.length === 0) {
    return ''
  }

  for (const menuItem of menuList) {
    if (!isValidMenuItem(menuItem)) {
      continue
    }

    // If there are children, search children first
    if (menuItem.children?.length) {
      const childPath = getFirstMenuPath(menuItem.children)
      if (childPath) {
        return childPath
      }
    }

    // Return the normalized path of current menu item
    return normalizePath(menuItem.path!)
  }

  return ''
}
