import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { ref, nextTick } from 'vue'
import NProgress from 'nprogress'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore } from '@/store/modules/user'
import { useMenuStore } from '@/store/modules/menu'
import { setWorktab } from '@/utils/navigation'
import { setPageTitle, setSystemTheme } from '../utils/utils'
import { menuService } from '@/api/menuApi'
import { registerDynamicRoutes } from '../utils/registerRoutes'
import { AppRouteRecord } from '@/types/router'
import { RoutesAlias } from '../routesAlias'
import { menuDataToRouter } from '../utils/menuToRouter'
import { asyncRoutes } from '../routes/asyncRoutes'
import { loadingService } from '@/utils/ui'
import { useCommon } from '@/composables/useCommon'
import { useWorktabStore } from '@/store/modules/worktab'
import { UserService } from '@/api/usersApi'

// Delay when closing loading in frontend-permission mode to improve UX
const LOADING_DELAY = 100

// Whether dynamic routes have been registered
const isRouteRegistered = ref(false)

// Track whether loading needs to be closed
const pendingLoading = ref(false)

/**
 * Setup global beforeEach route guard
 */
export function setupBeforeEachGuard(router: Router): void {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      try {
        await handleRouteGuard(to, from, next, router)
      } catch (error) {
        console.error('Route guard handling failed:', error)
        next('/exception/500')
      }
    }
  )

  // Setup afterEach guard to close loading and progress bar
  setupAfterEachGuard(router)
}

/**
 * Setup global afterEach route guard
 */
function setupAfterEachGuard(router: Router): void {
  router.afterEach(() => {
    // Close progress bar
    const settingStore = useSettingStore()
    if (settingStore.showNprogress) {
      NProgress.done()
    }

    // Close loading effect
    if (pendingLoading.value) {
      nextTick(() => {
        loadingService.hideLoading()
        pendingLoading.value = false
      })
    }
  })
}

/**
 * Handle route guard logic
 */
async function handleRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
): Promise<void> {
  const settingStore = useSettingStore()
  const userStore = useUserStore()

  // Start progress bar if enabled
  if (settingStore.showNprogress) {
    NProgress.start()
  }

  // Apply system theme
  setSystemTheme(to)

  // Handle login status
  if (!(await handleLoginStatus(to, userStore, next))) {
    return
  }

  // Handle dynamic route registration
  if (!isRouteRegistered.value && userStore.isLogin) {
    await handleDynamicRoutes(to, from, next, router)
    return
  }

  // Handle root path redirect to home
  if (userStore.isLogin && isRouteRegistered.value && handleRootPathRedirect(to, next)) {
    return
  }

  // Handle known matched routes
  if (to.matched.length > 0) {
    setWorktab(to)
    setPageTitle(to)
    next()
    return
  }

  // Try re-registering routes on refresh
  if (userStore.isLogin && !isRouteRegistered.value) {
    await handleDynamicRoutes(to, from, next, router)
    return
  }

  // No matched route; go to 404
  next(RoutesAlias.Exception404)
}

/**
 * Handle login status
 */
async function handleLoginStatus(
  to: RouteLocationNormalized,
  userStore: ReturnType<typeof useUserStore>,
  next: NavigationGuardNext
): Promise<boolean> {
  if (!userStore.isLogin && to.path !== RoutesAlias.Login && !to.meta.noLogin) {
    userStore.logOut()
    next(RoutesAlias.Login)
    return false
  }
  return true
}

/**
 * Handle dynamic route registration
 */
async function handleDynamicRoutes(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
): Promise<void> {
  try {
    // Show loading and mark as pending
    pendingLoading.value = true
    loadingService.showLoading()

    // Ensure user info is loaded
    const userStore = useUserStore()
    const isRefresh = from.path === '/'
    if (isRefresh || !userStore.info || Object.keys(userStore.info).length === 0) {
      try {
        const data = await UserService.getUserInfo()
        userStore.setUserInfo(data)
      } catch (error) {
        console.error('Failed to fetch user info', error)
      }
    }

    await getMenuData(router)

    // Handle root redirect
    if (handleRootPathRedirect(to, next)) {
      return
    }

    next({
      path: to.path,
      query: to.query,
      hash: to.hash,
      replace: true
    })
  } catch (error) {
    console.error('Dynamic route registration failed:', error)
    next('/exception/500')
  }
}

/**
 * Fetch and process menu data
 */
async function getMenuData(router: Router): Promise<void> {
  try {
    if (useCommon().isFrontendMode.value) {
      await processFrontendMenu(router)
    } else {
      await processBackendMenu(router)
    }
  } catch (error) {
    handleMenuError(error)
    throw error
  }
}

/**
 * Frontend-control mode menu handling
 */
async function processFrontendMenu(router: Router): Promise<void> {
  const menuList = asyncRoutes.map((route) => menuDataToRouter(route))
  const userStore = useUserStore()
  const roles = userStore.info.roles

  if (!roles) {
    throw new Error('Failed to get user roles')
  }

  const filteredMenuList = filterMenuByRoles(menuList, roles)

  // Small delay for better perceived performance
  await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY))

  await registerAndStoreMenu(router, filteredMenuList)
}

/**
 * Backend-control mode menu handling
 */
async function processBackendMenu(router: Router): Promise<void> {
  const { menuList } = await menuService.getMenuList()
  await registerAndStoreMenu(router, menuList)
}

/**
 * Recursively filter out empty menu items
 */
function filterEmptyMenus(menuList: AppRouteRecord[]): AppRouteRecord[] {
  return menuList
    .map((item) => {
      // If it has children, filter them first
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterEmptyMenus(item.children)
        return {
          ...item,
          children: filteredChildren
        }
      }
      return item
    })
    .filter((item) => {
      // Remove items that are layout components without children
      const isEmptyLayoutMenu =
        item.component === RoutesAlias.Layout && (!item.children || item.children.length === 0)

      // Remove items whose component is an empty string and have no children
      const isEmptyComponentMenu =
        item.component === '' &&
        (!item.children || item.children.length === 0) &&
        item.meta.isIframe !== true

      return !(isEmptyLayoutMenu || isEmptyComponentMenu)
    })
}

/**
 * Register routes and store menu data
 */
async function registerAndStoreMenu(router: Router, menuList: AppRouteRecord[]): Promise<void> {
  if (!isValidMenuList(menuList)) {
    throw new Error('Failed to get the menu list. Please log in again')
  }
  const menuStore = useMenuStore()
  // Recursively remove empty menu items
  const list = filterEmptyMenus(menuList)
  menuStore.setMenuList(list)
  registerDynamicRoutes(router, list)
  isRouteRegistered.value = true
  useWorktabStore().validateWorktabs(router)
}

/**
 * Handle menu-related errors
 */
function handleMenuError(error: unknown): void {
  console.error('Menu processing failed:', error)
  useUserStore().logOut()
  throw error instanceof Error
    ? error
    : new Error('Failed to get the menu list. Please log in again')
}

/**
 * Filter menu by roles
 */
const filterMenuByRoles = (menu: AppRouteRecord[], roles: string[]): AppRouteRecord[] => {
  return menu.reduce((acc: AppRouteRecord[], item) => {
    const itemRoles = item.meta?.roles
    const hasPermission = !itemRoles || itemRoles.some((role) => roles?.includes(role))

    if (hasPermission) {
      const filteredItem = { ...item }
      if (filteredItem.children?.length) {
        filteredItem.children = filterMenuByRoles(filteredItem.children, roles)
      }
      acc.push(filteredItem)
    }

    return acc
  }, [])
}

/**
 * Validate the menu list
 */
function isValidMenuList(menuList: AppRouteRecord[]): boolean {
  return Array.isArray(menuList) && menuList.length > 0
}

/**
 * Reset route-related state
 */
export function resetRouterState(): void {
  isRouteRegistered.value = false
  const menuStore = useMenuStore()
  menuStore.removeAllDynamicRoutes()
  menuStore.setMenuList([])
}

/**
 * Handle redirect from root path to home
 */
function handleRootPathRedirect(to: RouteLocationNormalized, next: NavigationGuardNext): boolean {
  if (to.path === '/') {
    const { homePath } = useCommon()
    if (homePath.value) {
      next({ path: homePath.value, replace: true })
      return true
    }
  }
  return false
}
