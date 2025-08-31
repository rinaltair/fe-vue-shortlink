import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useCommon } from '@/composables/useCommon'
import type { AppRouteRecord } from '@/types/router'

type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number]

const userStore = useUserStore()

/**
 * Button permission helper (frontend/backend modes)
 * Usage:
 * const { hasAuth } = useAuth()
 * hasAuth('add') // check if user has 'add' permission
 */
export const useAuth = () => {
  const route = useRoute()
  const { isFrontendMode } = useCommon()
  const { info } = storeToRefs(userStore)

  // Frontend-defined button permissions (e.g., ['add', 'edit'])
  const frontendAuthList = info.value?.buttons ?? []

  // Backend route meta permission list (e.g., [{ authMark: 'add' }])
  const backendAuthList: AuthItem[] = Array.isArray(route.meta.authList)
    ? (route.meta.authList as AuthItem[])
    : []

  /**
   * Check whether a permission mark is granted (frontend/backend)
   * @param auth Permission mark
   * @returns Whether permitted
   */
  const hasAuth = (auth: string): boolean => {
    // Frontend mode
    if (isFrontendMode.value) {
      return frontendAuthList.includes(auth)
    }

    // Backend mode
    return backendAuthList.some((item) => item?.authMark === auth)
  }

  return {
    hasAuth
  }
}
