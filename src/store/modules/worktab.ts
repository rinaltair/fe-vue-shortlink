import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { router } from '@/router'
import { LocationQueryRaw, Router } from 'vue-router'
import { WorkTab } from '@/types'
import { useCommon } from '@/composables/useCommon'

interface WorktabState {
  current: Partial<WorkTab>
  opened: WorkTab[]
  keepAliveExclude: string[]
}

/**
 * Worktab tab management store
 */
export const useWorktabStore = defineStore(
  'worktabStore',
  () => {
    // State definitions
    const current = ref<Partial<WorkTab>>({})
    const opened = ref<WorkTab[]>([])
    const keepAliveExclude = ref<string[]>([])

    // Computed properties
    const hasOpenedTabs = computed(() => opened.value.length > 0)
    const hasMultipleTabs = computed(() => opened.value.length > 1)
    const currentTabIndex = computed(() =>
      current.value.path ? opened.value.findIndex((tab) => tab.path === current.value.path) : -1
    )

    /**
     * Compare query objects
     */
    const areQueriesEqual = (
      query1: LocationQueryRaw | undefined,
      query2: LocationQueryRaw | undefined
    ): boolean => {
      if (!query1 && !query2) return true
      if (!query1 || !query2) return false
      return JSON.stringify(query1) === JSON.stringify(query2)
    }

    /**
     * Find tab index
     */
    const findTabIndex = (path: string): number => {
      return opened.value.findIndex((tab) => tab.path === path)
    }

    /**
     * Get tab by path
     */
    const getTab = (path: string): WorkTab | undefined => {
      return opened.value.find((tab) => tab.path === path)
    }

    /**
     * Check whether a tab is closable
     */
    const isTabClosable = (tab: WorkTab): boolean => {
      return !tab.fixedTab
    }

    /**
     * Safe router push
     */
    const safeRouterPush = (tab: Partial<WorkTab>): void => {
      if (!tab.path) {
        console.warn('Attempted to navigate to an invalid tab path')
        return
      }

      try {
        router.push({
          path: tab.path,
          query: tab.query as LocationQueryRaw
        })
      } catch (error) {
        console.error('Router navigation failed:', error)
      }
    }

    /**
     * Open or activate a tab
     */
    const openTab = (tab: WorkTab): void => {
      if (!tab.path) {
        console.warn('Attempted to open an invalid tab')
        return
      }

      // Remove from keepAlive exclude list
      if (tab.name) {
        removeKeepAliveExclude(tab.name)
      }

      const existingIndex = findTabIndex(tab.path)

      if (existingIndex === -1) {
        // Add new tab
        const insertIndex = tab.fixedTab ? findFixedTabInsertIndex() : opened.value.length
        const newTab = { ...tab }

        if (tab.fixedTab) {
          opened.value.splice(insertIndex, 0, newTab)
        } else {
          opened.value.push(newTab)
        }

        current.value = newTab
      } else {
        // Update existing tab
        const existingTab = opened.value[existingIndex]

        if (!areQueriesEqual(existingTab.query, tab.query)) {
          opened.value[existingIndex] = {
            ...existingTab,
            query: tab.query,
            title: tab.title || existingTab.title
          }
        }

        current.value = opened.value[existingIndex]
      }
    }

    /**
     * Find insert position for fixed tabs
     */
    const findFixedTabInsertIndex = (): number => {
      let insertIndex = 0
      for (let i = 0; i < opened.value.length; i++) {
        if (opened.value[i].fixedTab) {
          insertIndex = i + 1
        } else {
          break
        }
      }
      return insertIndex
    }

    /**
     * Close a specific tab
     */
    const removeTab = (path: string): void => {
      const targetTab = getTab(path)
      const targetIndex = findTabIndex(path)

      if (targetIndex === -1) {
        console.warn(`Attempted to close a non-existent tab: ${path}`)
        return
      }

      if (targetTab && !isTabClosable(targetTab)) {
        console.warn(`Attempted to close a fixed tab: ${path}`)
        return
      }

      // Remove from opened list
      opened.value.splice(targetIndex, 1)

      // Handle keepAlive exclude
      if (targetTab?.name) {
        addKeepAliveExclude(targetTab)
      }

      const { homePath } = useCommon()

      // If no tabs remain, navigate to home
      if (!hasOpenedTabs.value) {
        if (path !== homePath.value) {
          current.value = {}
          safeRouterPush({ path: homePath.value })
        }
        return
      }

      // If closing the active tab, activate another
      if (current.value.path === path) {
        const newIndex = targetIndex >= opened.value.length ? opened.value.length - 1 : targetIndex
        current.value = opened.value[newIndex]
        safeRouterPush(current.value)
      }
    }

    /**
     * Close tabs to the left
     */
    const removeLeft = (path: string): void => {
      const targetIndex = findTabIndex(path)

      if (targetIndex === -1) {
        console.warn(`Attempted to close left tabs, but target tab does not exist: ${path}`)
        return
      }

      // Get closable tabs on the left
      const leftTabs = opened.value.slice(0, targetIndex)
      const closableLeftTabs = leftTabs.filter(isTabClosable)

      if (closableLeftTabs.length === 0) {
        console.warn('No closable tabs on the left')
        return
      }

      // Mark as keepAlive exclude
      markTabsToRemove(closableLeftTabs)

      // Remove left closable tabs
      opened.value = opened.value.filter(
        (tab, index) => index >= targetIndex || !isTabClosable(tab)
      )

      // Ensure the target tab remains active
      const targetTab = getTab(path)
      if (targetTab) {
        current.value = targetTab
      }
    }

    /**
     * Close tabs to the right
     */
    const removeRight = (path: string): void => {
      const targetIndex = findTabIndex(path)

      if (targetIndex === -1) {
        console.warn(`Attempted to close right tabs, but target tab does not exist: ${path}`)
        return
      }

      // Get closable tabs on the right
      const rightTabs = opened.value.slice(targetIndex + 1)
      const closableRightTabs = rightTabs.filter(isTabClosable)

      if (closableRightTabs.length === 0) {
        console.warn('No closable tabs on the right')
        return
      }

      // Mark as keepAlive exclude
      markTabsToRemove(closableRightTabs)

      // Remove right closable tabs
      opened.value = opened.value.filter(
        (tab, index) => index <= targetIndex || !isTabClosable(tab)
      )

      // Ensure the target tab remains active
      const targetTab = getTab(path)
      if (targetTab) {
        current.value = targetTab
      }
    }

    /**
     * Close other tabs
     */
    const removeOthers = (path: string): void => {
      const targetTab = getTab(path)

      if (!targetTab) {
        console.warn(`Attempted to close other tabs, but target tab does not exist: ${path}`)
        return
      }

      // Get other closable tabs
      const otherTabs = opened.value.filter((tab) => tab.path !== path)
      const closableTabs = otherTabs.filter(isTabClosable)

      if (closableTabs.length === 0) {
        console.warn('No other closable tabs')
        return
      }

      // Mark as keepAlive exclude
      markTabsToRemove(closableTabs)

      // Keep only the current tab and fixed tabs
      opened.value = opened.value.filter((tab) => tab.path === path || !isTabClosable(tab))

      // Ensure current tab is active
      current.value = targetTab
    }

    /**
     * Close all closable tabs
     */
    const removeAll = (): void => {
      const { homePath } = useCommon()
      const hasFixedTabs = opened.value.some((tab) => tab.fixedTab)

      // Get closable tabs
      const closableTabs = opened.value.filter((tab) => {
        if (!isTabClosable(tab)) return false
        // If there are fixed tabs, close all closable; otherwise keep home page
        return hasFixedTabs || tab.path !== homePath.value
      })

      if (closableTabs.length === 0) {
        console.warn('No closable tabs')
        return
      }

      // Mark as keepAlive exclude
      markTabsToRemove(closableTabs)

      // Keep non-closable tabs and the home page (when no fixed tabs)
      opened.value = opened.value.filter((tab) => {
        return !isTabClosable(tab) || (!hasFixedTabs && tab.path === homePath.value)
      })

      // Handle active state
      if (!hasOpenedTabs.value) {
        current.value = {}
        safeRouterPush({ path: homePath.value })
        return
      }

      // Choose active tab: prefer home page, else first available
      const homeTab = opened.value.find((tab) => tab.path === homePath.value)
      const targetTab = homeTab || opened.value[0]

      current.value = targetTab
      safeRouterPush(targetTab)
    }

    /**
     * Add the specified tab to keepAlive exclude list
     */
    const addKeepAliveExclude = (tab: WorkTab): void => {
      if (!tab.keepAlive || !tab.name) return

      if (!keepAliveExclude.value.includes(tab.name)) {
        keepAliveExclude.value.push(tab.name)
      }
    }

    /**
     * Remove a component name from keepAlive exclude list
     */
    const removeKeepAliveExclude = (name: string): void => {
      if (!name) return

      keepAliveExclude.value = keepAliveExclude.value.filter((item) => item !== name)
    }

    /**
     * Mark the passed tabs' component names as excluded from cache
     */
    const markTabsToRemove = (tabs: WorkTab[]): void => {
      tabs.forEach((tab) => {
        if (tab.name) {
          addKeepAliveExclude(tab)
        }
      })
    }

    /**
     * Toggle fixed state for a specific tab
     */
    const toggleFixedTab = (path: string): void => {
      const targetIndex = findTabIndex(path)

      if (targetIndex === -1) {
        console.warn(`Attempted to toggle fixed state of a non-existent tab: ${path}`)
        return
      }

      const tab = { ...opened.value[targetIndex] }
      tab.fixedTab = !tab.fixedTab

      // Remove from original position
      opened.value.splice(targetIndex, 1)

      if (tab.fixedTab) {
        // Insert fixed tab after existing fixed tabs
        const firstNonFixedIndex = opened.value.findIndex((t) => !t.fixedTab)
        const insertIndex = firstNonFixedIndex === -1 ? opened.value.length : firstNonFixedIndex
        opened.value.splice(insertIndex, 0, tab)
      } else {
        // Insert non-fixed tab after all fixed tabs
        const fixedCount = opened.value.filter((t) => t.fixedTab).length
        opened.value.splice(fixedCount, 0, tab)
      }

      // Update current tab reference
      if (current.value.path === path) {
        current.value = tab
      }
    }

    /**
     * Validate route validity of worktab tabs
     */
    const validateWorktabs = (routerInstance: Router): void => {
      try {
        const validPaths = new Set(routerInstance.getRoutes().map((route) => route.path))

        // Filter valid tabs
        const validTabs = opened.value.filter((tab) => validPaths.has(tab.path))

        if (validTabs.length !== opened.value.length) {
          console.warn('Found invalid tab routes; cleaned automatically')
          opened.value = validTabs
        }

        // Check current active tab validity
        const isCurrentValid =
          current.value.path && validTabs.some((tab) => tab.path === current.value.path)

        if (!isCurrentValid && validTabs.length > 0) {
          console.warn('Active tab invalid; switched automatically')
          current.value = validTabs[0]
        } else if (!isCurrentValid) {
          current.value = {}
        }
      } catch (error) {
        console.error('Failed to validate worktab tabs:', error)
      }
    }

    /**
     * Clear all state (e.g., on logout)
     */
    const clearAll = (): void => {
      current.value = {}
      opened.value = []
      keepAliveExclude.value = []
    }

    /**
     * Get state snapshot (for persistence)
     */
    const getStateSnapshot = (): WorktabState => {
      return {
        current: { ...current.value },
        opened: [...opened.value],
        keepAliveExclude: [...keepAliveExclude.value]
      }
    }

    /**
     * Get tab title
     */
    const getTabTitle = (path: string): WorkTab | undefined => {
      const tab = getTab(path)
      return tab
    }

    /**
     * Update tab title
     */
    const updateTabTitle = (path: string, title: string): void => {
      const tab = getTab(path)
      if (tab) {
        tab.customTitle = title
      }
    }

    /**
     * Reset tab title
     */
    const resetTabTitle = (path: string): void => {
      const tab = getTab(path)
      if (tab) {
        tab.customTitle = ''
      }
    }

    return {
      // State
      current,
      opened,
      keepAliveExclude,

      // Computed
      hasOpenedTabs,
      hasMultipleTabs,
      currentTabIndex,

      // Methods
      openTab,
      removeTab,
      removeLeft,
      removeRight,
      removeOthers,
      removeAll,
      toggleFixedTab,
      validateWorktabs,
      clearAll,
      getStateSnapshot,

      // Utility methods
      findTabIndex,
      getTab,
      isTabClosable,
      addKeepAliveExclude,
      removeKeepAliveExclude,
      markTabsToRemove,
      getTabTitle,
      updateTabTitle,
      resetTabTitle
    }
  },
  {
    persist: {
      key: 'worktab',
      storage: localStorage
    }
  }
)
