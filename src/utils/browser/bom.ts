/**
 * Browser Object Model (BOM) utilities
 */

// Current page URL
export function currentURL(): string {
  return window.location.href
}

// Get scroll position
export function getScrollPosition(el: HTMLElement | Window = window): { x: number; y: number } {
  return el === window
    ? {
        x: window.scrollX || document.documentElement.scrollLeft,
        y: window.scrollY || document.documentElement.scrollTop
      }
    : {
        x: (el as HTMLElement).scrollLeft,
        y: (el as HTMLElement).scrollTop
      }
}

// Get URL parameters
export function getURLParameters(url: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(url.split('?')[1]).entries())
}

// Copy text to clipboard
export function copy(str: string): boolean {
  try {
    navigator.clipboard.writeText(str)
    return true
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}

// Detect device type
export function detectDeviceType(): 'Mobile' | 'Desktop' {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop'
}
