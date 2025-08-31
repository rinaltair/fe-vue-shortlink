import { useUserStore } from '@/store/modules/user'
import { App, Directive, DirectiveBinding } from 'vue'

/**
 * Role-based permission directive
 * Show the element if the user has any role specified in the directive value.
 * Usage:
 * <el-button v-roles="['R_SUPER', 'R_ADMIN']">Button</el-button>
 * <el-button v-roles="'R_ADMIN'">Button</el-button>
 */

interface RolesBinding extends DirectiveBinding {
  value: string | string[]
}

function checkRolePermission(el: HTMLElement, binding: RolesBinding): void {
  const userStore = useUserStore()
  const userRoles = userStore.getUserInfo.roles

  // If user roles are empty or undefined, remove the element
  if (!userRoles?.length) {
    removeElement(el)
    return
  }

  // Ensure the directive value is in array form
  const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value]

  // Check if user has any of the required roles
  const hasPermission = requiredRoles.some((role: string) => userRoles.includes(role))

  // Safely remove the element if no permission
  if (!hasPermission) {
    removeElement(el)
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

const rolesDirective: Directive = {
  mounted: checkRolePermission,
  updated: checkRolePermission
}

export function setupRolesDirective(app: App): void {
  app.directive('roles', rolesDirective)
}
