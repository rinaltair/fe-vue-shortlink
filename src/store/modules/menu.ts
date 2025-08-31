import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppRouteRecord } from '@/types/router'
import { getFirstMenuPath } from '@/utils'
import { HOME_PAGE_PATH } from '@/router'

/**
 * Menu state management
 * Manages menu list, home path, menu width, and dynamic route removal
 */
export const useMenuStore = defineStore('menuStore', () => {
  /** Home page path */
  const homePath = ref(HOME_PAGE_PATH)
  /** Menu list */
  const menuList = ref<AppRouteRecord[]>([])
  /** Menu width */
  const menuWidth = ref('')
  /** Array of stored route removal functions */
  const removeRouteFns = ref<(() => void)[]>([])

  /**
   * Set menu list
   * @param list Menu route records
   */
  const setMenuList = (list: AppRouteRecord[]) => {
    menuList.value = list
    setHomePath(homePath.value || getFirstMenuPath(list))
  }

  /**
   * Get home path
   * @returns Home path string
   */
  const getHomePath = () => homePath.value

  /**
   * Set home path
   * @param path Home path
   */
  const setHomePath = (path: string) => {
    homePath.value = path
  }

  /**
   * Set menu width
   * @param width Menu width value
   */
  const setMenuWidth = (width: string) => (menuWidth.value = width)

  /**
   * Add route removal functions
   * @param fns Array of removal functions
   */
  const addRemoveRouteFns = (fns: (() => void)[]) => {
    removeRouteFns.value.push(...fns)
  }

  /**
   * Remove all dynamic routes
   * Executes all stored removal functions and clears the array
   */
  const removeAllDynamicRoutes = () => {
    removeRouteFns.value.forEach((fn) => fn())
    removeRouteFns.value = []
  }

  /**
   * Clear removal function array
   */
  const clearRemoveRouteFns = () => {
    removeRouteFns.value = []
  }

  return {
    menuList,
    menuWidth,
    removeRouteFns,
    setMenuList,
    setMenuWidth,
    getHomePath,
    setHomePath,
    addRemoveRouteFns,
    removeAllDynamicRoutes,
    clearRemoveRouteFns
  }
})
