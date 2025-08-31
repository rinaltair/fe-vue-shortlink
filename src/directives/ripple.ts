import type { App, Directive, DirectiveBinding } from 'vue'

/**
 * Ripple directive
 * Usage:
 * <!-- Basic -->
 * <el-button v-ripple>Click to see ripple</el-button>
 *
 * <!-- Custom color -->
 * <el-button v-ripple="{ color: 'rgba(0, 0, 0, 0.2)' }">
 *   Custom ripple color
 * </el-button>
 */
export interface RippleOptions {
  color?: string
}

export const vRipple: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // Get directive options
    const options: RippleOptions = binding.value || {}

    // Use relative positioning and hide overflow
    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    // Click handler
    el.addEventListener('mousedown', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const left = e.clientX - rect.left
      const top = e.clientY - rect.top

      // Create ripple element
      const ripple = document.createElement('div')
      const diameter = Math.max(el.clientWidth, el.clientHeight)
      const radius = diameter / 2

      // Compute animation duration based on diameter (larger = longer)
      const baseTime = 600 // Base duration (ms)
      const scaleFactor = 0.5 // Scale factor
      const animationDuration = baseTime + diameter * scaleFactor

      // Size and position
      ripple.style.width = ripple.style.height = `${diameter}px`
      ripple.style.left = `${left - radius}px`
      ripple.style.top = `${top - radius}px`
      ripple.style.position = 'absolute'
      ripple.style.borderRadius = '50%'
      ripple.style.pointerEvents = 'none'

      // Detect if it's a colored Element Plus button
      const buttonTypes = ['primary', 'info', 'warning', 'danger', 'success'].map(
        (type) => `el-button--${type}`
      )
      const isColoredButton = buttonTypes.some((type) => el.classList.contains(type))
      const defaultColor = isColoredButton
        ? 'rgba(255, 255, 255, 0.35)' // Use white ripple on colored buttons
        : 'var(--el-color-primary-light-7)' // Use theme color ripple by default

      // Apply color, initial state and transition
      ripple.style.backgroundColor = options.color || defaultColor
      ripple.style.transform = 'scale(0)'
      ripple.style.transition = `transform ${animationDuration}ms cubic-bezier(0.3, 0, 0.2, 1), opacity ${animationDuration}ms cubic-bezier(0.3, 0, 0.5, 1)`
      ripple.style.zIndex = '1'

      // Append ripple to DOM
      el.appendChild(ripple)

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2)'
        ripple.style.opacity = '0'
      })

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove()
      }, animationDuration + 500) // Add 500ms buffer
    })
  }
}

export function setupRippleDirective(app: App) {
  app.directive('ripple', vRipple)
}
