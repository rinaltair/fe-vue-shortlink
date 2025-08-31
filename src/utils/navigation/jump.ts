import { AppRouteRecord } from '@/types/router'
import { router } from '@/router'

// Open an external link
export const openExternalLink = (link: string) => {
  window.open(link, '_blank')
}

/**
 * Menu navigation
 * @param item Menu item
 * @param jumpToFirst Whether to jump to the first child menu
 * @returns
 */
export const handleMenuJump = (item: AppRouteRecord, jumpToFirst: boolean = false) => {
  // Handle external links
  const { link, isIframe } = item.meta
  if (link && !isIframe) {
    return openExternalLink(link)
  }

  // If not jumping to the first child, or no children, go to current path
  if (!jumpToFirst || !item.children?.length) {
    return router.push(item.path)
  }

  // Recursively find the first visible leaf menu
  const findFirstLeafMenu = (items: AppRouteRecord[]): AppRouteRecord => {
    for (const child of items) {
      if (!child.meta.isHide) {
        return child.children?.length ? findFirstLeafMenu(child.children) : child
      }
    }
    return items[0]
  }

  const firstChild = findFirstLeafMenu(item.children)

  // If the first child is an external link, open in a new tab
  if (firstChild.meta?.link) {
    return openExternalLink(firstChild.meta.link)
  }

  // Navigate to the child menu path
  router.push(firstChild.path)
}
