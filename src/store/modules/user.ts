import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LanguageEnum } from '@/enums/appEnum'
import { AppRouteRecord } from '@/types'
import { useSettingStore } from '@/store/modules/setting'
import { useWorktabStore } from '@/store/modules/worktab'
import { setPageTitle } from '@/router/utils/utils'
import { router } from '@/router'
import { useMenuStore } from '@/store/modules/menu'
import { resetRouterState } from '@/router/guards/beforeEach'
import { RoutesAlias } from '@/router/routesAlias'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Language setting
    language: ref(LanguageEnum.EN),
    // Login status
    isLogin: ref(false),
    // Lock screen status
    isLock: ref(false),
    // Lock screen password
    lockPassword: ref(''),
    // User info
    info: ref<Partial<Api.User.UserInfo>>({}),
    // Search history
    searchHistory: ref<AppRouteRecord[]>([]),
    // Access token
    accessToken: ref(''),
    // Refresh token
    refreshToken: ref('')
  }),
  getters: {
    // Computed: get user info
    getUserInfo: (state) => state.info,
    // Computed: get setting store state
    getSettingState: () => useSettingStore().$state,
    // Computed: get worktab store state
    getWorktabState: () => useWorktabStore().$state
  },
  actions: {
    /**
     * Set user info
     * @param newInfo New user info
     */
    setUserInfo(newInfo: Api.User.UserInfo) {
      this.info = newInfo
    },

    /**
     * Set login status
     * @param status Login status
     */
    setLoginStatus(status: boolean) {
      this.isLogin = status
    },

    /**
     * Set language
     * @param lang Language enum
     */
    setLanguage(lang: LanguageEnum) {
      this.language = lang
      setPageTitle(router.currentRoute.value)
    },

    /**
     * Set search history
     * @param list Search history list
     */
    setSearchHistory(list: AppRouteRecord[]) {
      this.searchHistory = list
    },

    /**
     * Set lock screen status
     * @param status Lock state
     */
    setLockStatus(status: boolean) {
      this.isLock = status
    },

    /**
     * Set lock screen password
     * @param password Lock password
     */
    setLockPassword(password: string) {
      this.lockPassword = password
    },

    /**
     * Set tokens
     * @param newAccessToken Access token
     * @param newRefreshToken Refresh token (optional)
     */
    setToken(newAccessToken: string, newRefreshToken?: string) {
      this.accessToken = newAccessToken
      if (newRefreshToken) {
        this.refreshToken = newRefreshToken
      }
    },

    /**
     * Log out
     * Clears all user-related state and navigates to login
     */
    logOut() {
      // Clear user info
      this.info = {}
      // Reset login status
      this.isLogin = false
      // Reset lock status
      this.isLock = false
      // Clear lock password
      this.lockPassword = ''
      // Clear access token
      this.accessToken = ''
      // Clear refresh token
      this.refreshToken = ''
      // Clear opened tabs in worktab store
      useWorktabStore().clearAll()
      // Remove iframe route cache
      sessionStorage.removeItem('iframeRoutes')
      // Clear home path
      useMenuStore().setHomePath('')
      // Reset router state
      resetRouterState()
      // Navigate to login page
      router.push(RoutesAlias.Login)
    }
  },
  persist: {
    key: 'user',
    storage: localStorage
  }
})
