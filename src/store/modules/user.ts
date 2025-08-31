import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LanguageEnum } from '@/enums/appEnum'
import { router } from '@/router'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { AppRouteRecord } from '@/types/router'
import { setPageTitle } from '@/router/utils/utils'
import { resetRouterState } from '@/router/guards/beforeEach'
import { RoutesAlias } from '@/router/routesAlias'
import { useMenuStore } from './menu'

/**
 * User state management
 * Manages login status, profile info, language, search history, lock state, etc.
 */
export const useUserStore = defineStore(
  'userStore',
  () => {
    // Language setting
    const language = ref(LanguageEnum.ZH)
    // Login status
    const isLogin = ref(false)
    // Lock screen status
    const isLock = ref(false)
    // Lock screen password
    const lockPassword = ref('')
    // User info
    const info = ref<Partial<Api.User.UserInfo>>({})
    // Search history
    const searchHistory = ref<AppRouteRecord[]>([])
    // Access token
    const accessToken = ref('')
    // Refresh token
    const refreshToken = ref('')

    // Computed: get user info
    const getUserInfo = computed(() => info.value)
    // Computed: get setting store state
    const getSettingState = computed(() => useSettingStore().$state)
    // Computed: get worktab store state
    const getWorktabState = computed(() => useWorktabStore().$state)

    /**
     * Set user info
     * @param newInfo New user info
     */
    const setUserInfo = (newInfo: Api.User.UserInfo) => {
      info.value = newInfo
    }

    /**
     * Set login status
     * @param status Login status
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status
    }

    /**
     * Set language
     * @param lang Language enum
     */
    const setLanguage = (lang: LanguageEnum) => {
      setPageTitle(router.currentRoute.value)
      language.value = lang
    }

    /**
     * Set search history
     * @param list Search history list
     */
    const setSearchHistory = (list: AppRouteRecord[]) => {
      searchHistory.value = list
    }

    /**
     * Set lock screen status
     * @param status Lock state
     */
    const setLockStatus = (status: boolean) => {
      isLock.value = status
    }

    /**
     * Set lock screen password
     * @param password Lock password
     */
    const setLockPassword = (password: string) => {
      lockPassword.value = password
    }

    /**
     * Set tokens
     * @param newAccessToken Access token
     * @param newRefreshToken Refresh token (optional)
     */
    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
      }
    }

    /**
     * Log out
     * Clears all user-related state and navigates to login
     */
    const logOut = () => {
      // Clear user info
      info.value = {}
      // Reset login status
      isLogin.value = false
      // Reset lock status
      isLock.value = false
      // Clear lock password
      lockPassword.value = ''
      // Clear access token
      accessToken.value = ''
      // Clear refresh token
      refreshToken.value = ''
      // Clear opened tabs in worktab store
      useWorktabStore().opened = []
      // Remove iframe route cache
      sessionStorage.removeItem('iframeRoutes')
      // Clear home path
      useMenuStore().setHomePath('')
      // Reset router state
      resetRouterState()
      // Navigate to login page
      router.push(RoutesAlias.Login)
    }

    return {
      language,
      isLogin,
      isLock,
      lockPassword,
      info,
      searchHistory,
      accessToken,
      refreshToken,
      getUserInfo,
      getSettingState,
      getWorktabState,
      setUserInfo,
      setLoginStatus,
      setLanguage,
      setSearchHistory,
      setLockStatus,
      setLockPassword,
      setToken,
      logOut
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
)
