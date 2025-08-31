import type { App } from 'vue'
import { setupAuthDirective } from './auth'
import { setupHighlightDirective } from './highlight'
import { setupRippleDirective } from './ripple'
import { setupRolesDirective } from './roles'

export function setupGlobDirectives(app: App) {
  setupAuthDirective(app) // Authorization directive
  setupRolesDirective(app) // Role-based directive
  setupHighlightDirective(app) // Highlight directive
  setupRippleDirective(app) // Ripple directive
}
