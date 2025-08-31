/**
 * Router-related type definitions
 */

import { RouteRecordRaw } from 'vue-router'

// Route meta
export interface RouteMeta extends Record<string | number | symbol, unknown> {
  /** title */
  title: string
  /** icon */
  icon?: string
  /** show badge */
  showBadge?: boolean
  /** text badge */
  showTextBadge?: string
  /** hide in menu */
  isHide?: boolean
  /** hide in worktab */
  isHideTab?: boolean
  /** external link */
  link?: string
  /** is iframe */
  isIframe?: boolean
  /** keep alive */
  keepAlive?: boolean
  /** operation permissions */
  authList?: Array<{
    title: string
    authMark: string
  }>
  /** is first-level menu */
  isFirstLevel?: boolean
  /** role permissions */
  roles?: string[]
  /** fixed worktab */
  fixedTab?: boolean
  /** active menu path */
  activePath?: string
  /** fullscreen page */
  isFullPage?: boolean
}

// Extended route record
export interface AppRouteRecord extends Omit<RouteRecordRaw, 'meta' | 'children' | 'component'> {
  id?: number
  meta: RouteMeta
  children?: AppRouteRecord[]
  component?: string | (() => Promise<any>)
}
