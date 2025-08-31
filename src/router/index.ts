import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from './routes/staticRoutes'
import { configureNProgress } from './utils/utils'
import { setupBeforeEachGuard } from './guards/beforeEach'
import { setupAfterEachGuard } from './guards/afterEach'

// Create router instance
export const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes, // Static routes
  scrollBehavior: () => ({ left: 0, top: 0 }) // Scroll behavior
})

// Initialize router
export function initRouter(app: App<Element>): void {
  configureNProgress() // Top progress bar
  setupBeforeEachGuard(router) // Global before guard
  setupAfterEachGuard(router) // Global after guard
  app.use(router)
}

// Home page path. If configured, use this path; otherwise use the first valid menu path
export const HOME_PAGE_PATH = ''
