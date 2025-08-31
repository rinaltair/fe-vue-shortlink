import { router } from '@/router'
import { App, Directive, DirectiveBinding } from 'vue'

/**
 * Authorization directive (for backend-controlled mode)
 * Usage:
 * <el-button v-auth="'add'">Button</el-button>
 */

interface AuthBinding extends DirectiveBinding {
  value: string
}

function checkAuthPermission(el: HTMLElement, binding: AuthBinding): void {
  // Get current route's auth list
  const authList = (router.currentRoute.value.meta.authList as Array<{ authMark: string }>) || []

  // Check for matching auth mark
  const hasPermission = authList.some((item) => item.authMark === binding.value)

  // Remove element when no permission
  if (!hasPermission) {
    removeElement(el)
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

const authDirective: Directive = {
  mounted: checkAuthPermission,
  updated: checkAuthPermission
}

export function setupAuthDirective(app: App): void {
  app.directive('auth', authDirective)
}
