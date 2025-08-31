/**
 * Dynamic route processing
 * Register dynamic routes based on the menu list returned by the API
 */
import type { Router, RouteRecordRaw } from 'vue-router'
import type { AppRouteRecord } from '@/types/router'
import { saveIframeRoutes } from './menuToRouter'
import { RoutesAlias } from '../routesAlias'
import { h } from 'vue'
import { useMenuStore } from '@/store/modules/menu'

/**
 * Dynamically import all .vue components under the views directory
 */
const modules: Record<string, () => Promise<any>> = import.meta.glob('../../views/**/*.vue')

/**
 * Register async routes
 * Convert the API menu list to Vue Router route configs and add them to the given router instance
 * @param router Vue Router instance
 * @param menuList Menu list returned by API
 */
export function registerDynamicRoutes(router: Router, menuList: AppRouteRecord[]): void {
  // Collect iframe type routes locally
  const iframeRoutes: AppRouteRecord[] = []
  // Collect route remove functions
  const removeRouteFns: (() => void)[] = []

  // Check for duplicate routes in the menu list
  checkDuplicateRoutes(menuList)

  // Iterate the menu list and register routes
  menuList.forEach((route) => {
    // Only register routes that are not yet registered
    if (route.name && !router.hasRoute(route.name)) {
      const routeConfig = convertRouteComponent(route, iframeRoutes)
      // addRoute returns a remove function; collect it
      const removeRouteFn = router.addRoute(routeConfig as RouteRecordRaw)
      removeRouteFns.push(removeRouteFn)
    }
  })

  // Store remove functions in the store
  const menuStore = useMenuStore()
  menuStore.addRemoveRouteFns(removeRouteFns)

  // Save iframe routes
  saveIframeRoutes(iframeRoutes)
}

/**
 * Resolve path by joining parent and child
 */
function resolvePath(parent: string, child: string): string {
  return [parent.replace(/\/$/, ''), child.replace(/^\//, '')].filter(Boolean).join('/')
}

/**
 * Detect duplicate routes in the menu (including children)
 */
function checkDuplicateRoutes(routes: AppRouteRecord[], parentPath = ''): void {
  // Used to detect duplicates in dynamic routes
  const routeNameMap = new Map<string, string>() // route name -> path
  const componentPathMap = new Map<string, string>() // component path -> route info

  const checkRoutes = (routes: AppRouteRecord[], parentPath = '') => {
    routes.forEach((route) => {
      // Build full path
      const currentPath = route.path || ''
      const fullPath = resolvePath(parentPath, currentPath)

      // Check duplicate names
      if (route.name) {
        if (routeNameMap.has(String(route.name))) {
          console.warn(`[Route Warning] Duplicate name: "${String(route.name)}"`)
        } else {
          routeNameMap.set(String(route.name), fullPath)
        }
      }

      // Check duplicate component paths
      if (route.component) {
        const componentPath = getComponentPathString(route.component)

        if (componentPath && componentPath !== RoutesAlias.Layout) {
          const componentKey = `${parentPath}:${componentPath}`

          if (componentPathMap.has(componentKey)) {
            console.warn(`[Route Warning] Duplicate path: "${componentPath}"`)
          } else {
            componentPathMap.set(componentKey, fullPath)
          }
        }
      }

      // Recursively process child routes
      if (route.children?.length) {
        checkRoutes(route.children, fullPath)
      }
    })
  }

  checkRoutes(routes, parentPath)
}

/**
 * Get a string representation of the component path
 */
function getComponentPathString(component: any): string {
  if (typeof component === 'string') {
    return component
  }

  // For alias routes, get the component name
  for (const key in RoutesAlias) {
    if (RoutesAlias[key as keyof typeof RoutesAlias] === component) {
      return `RoutesAlias.${key}`
    }
  }

  return ''
}

/**
 * Dynamically load a component based on its path
 * @param componentPath Component path (without ../../views prefix and .vue suffix)
 * @param routeName Current route name (for error message)
 * @returns Component loader function
 */
function loadComponent(componentPath: string, routeName: string): () => Promise<any> {
  // If the path is empty, return a blank component
  if (componentPath === '') {
    return () =>
      Promise.resolve({
        render() {
          return h('div', {})
        }
      })
  }

  // Construct possible paths
  const fullPath = `../../views${componentPath}.vue`
  const fullPathWithIndex = `../../views${componentPath}/index.vue`

  // Try the direct path first, then try path with /index
  const module = modules[fullPath] || modules[fullPathWithIndex]

  if (!module) {
    console.error(
      `[Route Error] Component not found: ${routeName}, tried: ${fullPath} and ${fullPathWithIndex}`
    )
    return () =>
      Promise.resolve({
        render() {
          return h('div', `Component not found: ${routeName}`)
        }
      })
  }

  return module
}

/**
 * Converted route config type
 */
interface ConvertedRoute extends Omit<RouteRecordRaw, 'children'> {
  id?: number
  children?: ConvertedRoute[]
  component?: RouteRecordRaw['component'] | (() => Promise<any>)
}

/**
 * Convert route component config
 */
function convertRouteComponent(
  route: AppRouteRecord,
  iframeRoutes: AppRouteRecord[],
  depth = 0
): ConvertedRoute {
  const { component, children, ...routeConfig } = route

  // Base route config
  const converted: ConvertedRoute = {
    ...routeConfig,
    component: undefined
  }

  // Is first level menu
  const isFirstLevel =
    depth === 0 && route.children?.length === 0 && component !== RoutesAlias.Layout

  if (route.meta.isIframe) {
    handleIframeRoute(converted, route, iframeRoutes)
  } else if (isFirstLevel) {
    handleLayoutRoute(converted, route, component as string)
  } else {
    handleNormalRoute(converted, component as string, String(route.name))
  }

  // Recursively increase depth
  if (children?.length) {
    converted.children = children.map((child) =>
      convertRouteComponent(child, iframeRoutes, depth + 1)
    )
  }

  return converted
}

/**
 * Handle iframe routes
 */
function handleIframeRoute(
  converted: ConvertedRoute,
  route: AppRouteRecord,
  iframeRoutes: AppRouteRecord[]
): void {
  converted.path = `/outside/iframe/${String(route.name)}`
  converted.component = () => import('@/views/outside/Iframe.vue')
  iframeRoutes.push(route)
}

/**
 * Handle first-level menu routes
 */
function handleLayoutRoute(
  converted: ConvertedRoute,
  route: AppRouteRecord,
  component: string | undefined
): void {
  converted.component = () => import('@/views/index/index.vue')
  converted.path = `/${(route.path?.split('/')[1] || '').trim()}`
  converted.name = ''
  route.meta.isFirstLevel = true

  converted.children = [
    {
      ...route,
      component: loadComponent(component as string, String(route.name))
    } as ConvertedRoute
  ]
}

/**
 * Handle normal routes
 */
function handleNormalRoute(
  converted: ConvertedRoute,
  component: string | undefined,
  routeName: string
): void {
  if (component) {
    const aliasComponent = RoutesAlias[
      component as keyof typeof RoutesAlias
    ] as unknown as RouteRecordRaw['component']
    converted.component = aliasComponent || loadComponent(component as string, routeName)
  }
}
