import { AppRouteRecord } from '@/types/router'
import { RoutesAlias } from '../routesAlias'

/**
 * Convert menu data to a route config
 * @param route Menu item object
 * @param parentPath Parent path
 * @returns Processed route config
 */
export const menuDataToRouter = (route: AppRouteRecord, parentPath = ''): AppRouteRecord => {
  const fullPath = buildRoutePath(route, parentPath)

  // Validate component config and warn when needed
  validateComponent(route, parentPath)

  return {
    ...route,
    path: fullPath,
    children: processChildren(route.children || [], fullPath)
  }
}

/**
 * Build full route path
 * @param route Menu item object
 * @param parentPath Parent path
 * @returns Built full path
 */
const buildRoutePath = (route: AppRouteRecord, parentPath: string): string => {
  if (!route.path) return ''

  // For iframe-type routes, use the original path
  if (route.meta?.isIframe) return route.path

  // Join and normalize the path
  return parentPath ? `${parentPath}/${route.path}`.replace(/\/+/g, '/') : route.path
}

/**
 * Process child routes
 * @param children Child route array
 * @param parentPath Parent path
 * @returns Processed child routes
 */
const processChildren = (children: AppRouteRecord[], parentPath: string): AppRouteRecord[] => {
  if (!Array.isArray(children) || children.length === 0) return []

  return children.map((child) => menuDataToRouter(child, parentPath))
}

/**
 * Save iframe routes to sessionStorage
 * @param list Iframe route list
 */
export const saveIframeRoutes = (list: AppRouteRecord[]): void => {
  if (list.length > 0) {
    sessionStorage.setItem('iframeRoutes', JSON.stringify(list))
  }
}

/**
 * Get iframe routes
 * @returns Iframe route list
 */
export const getIframeRoutes = (): AppRouteRecord[] => {
  try {
    return JSON.parse(sessionStorage.getItem('iframeRoutes') || '[]')
  } catch (error) {
    console.error('Failed to parse iframe routes:', error)
    return []
  }
}

/**
 * Validate component config
 * @param route Route object
 * @param parentPath Parent path
 */
const validateComponent = (route: AppRouteRecord, parentPath: string): void => {
  const hasExternalLink = !!route.meta?.link?.trim()
  const hasChildren = Array.isArray(route.children) && route.children.length > 0

  // Check if top-level parent menu has an empty component config
  if (parentPath === '' && !route.component) {
    console.error(
      `[Route Error] The top-level parent menu component is missing or empty; it must point to ${RoutesAlias.Layout}`
    )
    console.error(route)
  }

  // Check if component is empty
  if (!route.component) {
    // If not a special case, log an error
    if (!hasExternalLink && !hasChildren) {
      console.error(`[Route Error] component is missing or empty`)
      console.error(route)
    }
  }
}
