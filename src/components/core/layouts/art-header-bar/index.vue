<!-- Top bar -->
<template>
  <div class="layout-top-bar" :class="[tabStyle]" :style="{ width: topBarWidth() }">
    <div class="menu">
      <div class="left" style="display: flex">
        <!-- System info -->
        <div class="top-header" @click="toHome" v-if="isTopMenu">
          <ArtLogo class="logo" />
          <p v-if="width >= 1400">{{ AppConfig.systemInfo.name }}</p>
        </div>

        <ArtLogo class="logo2" @click="toHome" />

        <!-- Menu toggle button -->
        <div class="btn-box" v-if="isLeftMenu && shouldShowMenuButton">
          <div class="btn menu-btn">
            <i class="iconfont-sys" @click="visibleMenu">&#xe6ba;</i>
          </div>
        </div>
        <!-- Refresh button -->
        <div class="btn-box" v-if="shouldShowRefreshButton">
          <div class="btn refresh-btn" :style="{ marginLeft: !isLeftMenu ? '10px' : '0' }">
            <i class="iconfont-sys" @click="reload()"> &#xe6b3; </i>
          </div>
        </div>

        <!-- Fast enter -->
        <ArtFastEnter v-if="shouldShowFastEnter && width >= headerBarFastEnterMinWidth" />

        <!-- Breadcrumb -->
        <ArtBreadcrumb
          v-if="(shouldShowBreadcrumb && isLeftMenu) || (shouldShowBreadcrumb && isDualMenu)"
        />

        <!-- Top menu -->
        <ArtHorizontalMenu v-if="isTopMenu" :list="menuList" />

        <!-- Mixed menu (top) -->
        <ArtMixedMenu v-if="isTopLeftMenu" :list="menuList" />
      </div>

      <div class="right">
        <!-- Search -->
        <div class="search-wrap" v-if="shouldShowGlobalSearch">
          <div class="search-input" @click="openSearchDialog">
            <div class="left">
              <i class="iconfont-sys">&#xe710;</i>
              <span>{{ $t('topBar.search.title') }}</span>
            </div>
            <div class="search-keydown">
              <i class="iconfont-sys" v-if="isWindows">&#xeeac;</i>
              <i class="iconfont-sys" v-else>&#xe9ab;</i>
              <span>k</span>
            </div>
          </div>
        </div>

        <!-- Fullscreen button -->
        <div class="btn-box screen-box" v-if="shouldShowFullscreen" @click="toggleFullScreen">
          <div
            class="btn"
            :class="{ 'full-screen-btn': !isFullscreen, 'exit-full-screen-btn': isFullscreen }"
          >
            <i class="iconfont-sys">{{ isFullscreen ? '&#xe62d;' : '&#xe8ce;' }}</i>
          </div>
        </div>
        <!-- Notifications -->
        <div class="btn-box notice-btn" v-if="shouldShowNotification" @click="visibleNotice">
          <div class="btn notice-button">
            <i class="iconfont-sys notice-btn">&#xe6c2;</i>
            <span class="count notice-btn"></span>
          </div>
        </div>
        <!-- Chat -->
        <div class="btn-box chat-btn" v-if="shouldShowChat" @click="openChat">
          <div class="btn chat-button">
            <i class="iconfont-sys">&#xe89a;</i>
            <span class="dot"></span>
          </div>
        </div>
        <!-- Language -->
        <div class="btn-box" v-if="shouldShowLanguage">
          <ElDropdown @command="changeLanguage" popper-class="langDropDownStyle">
            <div class="btn language-btn">
              <i class="iconfont-sys">&#xe611;</i>
            </div>
            <template #dropdown>
              <ElDropdownMenu>
                <div v-for="item in languageOptions" :key="item.value" class="lang-btn-item">
                  <ElDropdownItem
                    :command="item.value"
                    :class="{ 'is-selected': locale === item.value }"
                  >
                    <span class="menu-txt">{{ item.label }}</span>
                    <i v-if="locale === item.value" class="iconfont-sys">&#xe621;</i>
                  </ElDropdownItem>
                </div>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <!-- Settings -->
        <div class="btn-box" v-if="shouldShowSettings" @click="openSetting">
          <ElPopover :visible="showSettingGuide" placement="bottom-start" :width="190" :offset="0">
            <template #reference>
              <div class="btn setting-btn">
                <i class="iconfont-sys">&#xe6d0;</i>
              </div>
            </template>
            <template #default>
              <p
                >{{ $t('topBar.guide.title')
                }}<span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.theme') }} </span
                >、 <span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.menu') }} </span
                >{{ $t('topBar.guide.description') }}
              </p>
            </template>
          </ElPopover>
        </div>
        <!-- Theme toggle -->
        <div class="btn-box" v-if="shouldShowThemeToggle" @click="themeAnimation">
          <div class="btn theme-btn">
            <i class="iconfont-sys">{{ isDark ? '&#xe6b5;' : '&#xe725;' }}</i>
          </div>
        </div>

        <!-- User avatar and menu -->
        <div class="user">
          <ElPopover
            ref="userMenuPopover"
            placement="bottom-end"
            :width="240"
            :hide-after="0"
            :offset="10"
            trigger="hover"
            :show-arrow="false"
            popper-class="user-menu-popover"
            popper-style="border: 1px solid var(--art-border-dashed-color); border-radius: calc(var(--custom-radius) / 2 + 4px); padding: 5px 16px; 5px 16px;"
          >
            <template #reference>
              <img class="cover" src="@imgs/user/avatar.webp" alt="avatar" />
            </template>
            <template #default>
              <div class="user-menu-box">
                <div class="user-head">
                  <img class="cover" src="@imgs/user/avatar.webp" style="float: left" />
                  <div class="user-wrap">
                    <span class="name">{{ userInfo.username }}</span>
                    <span class="email">art.design@gmail.com</span>
                  </div>
                </div>
                <ul class="user-menu">
                  <li @click="goPage('/system/user-center')">
                    <i class="menu-icon iconfont-sys">&#xe734;</i>
                    <span class="menu-txt">{{ $t('topBar.user.userCenter') }}</span>
                  </li>
                  <li @click="toDocs()">
                    <i class="menu-icon iconfont-sys" style="font-size: 15px">&#xe828;</i>
                    <span class="menu-txt">{{ $t('topBar.user.docs') }}</span>
                  </li>
                  <li @click="toGithub()">
                    <i class="menu-icon iconfont-sys">&#xe8d6;</i>
                    <span class="menu-txt">{{ $t('topBar.user.github') }}</span>
                  </li>
                  <li @click="lockScreen()">
                    <i class="menu-icon iconfont-sys">&#xe817;</i>
                    <span class="menu-txt">{{ $t('topBar.user.lockScreen') }}</span>
                  </li>
                  <div class="line"></div>
                  <div class="logout-btn" @click="loginOut">
                    {{ $t('topBar.user.logout') }}
                  </div>
                </ul>
              </div>
            </template>
          </ElPopover>
        </div>
      </div>
    </div>
    <ArtWorkTab />

    <ArtNotification v-model:value="showNotice" ref="notice" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import { useFullscreen, useWindowSize } from '@vueuse/core'
  import { LanguageEnum, MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useMenuStore } from '@/store/modules/menu'
  import AppConfig from '@/config'
  import { languageOptions } from '@/locales'
  import { WEB_LINKS } from '@/utils/constants'
  import { mittBus } from '@/utils/sys'
  import { themeAnimation } from '@/utils/theme/animation'
  import { useCommon } from '@/composables/useCommon'
  import { useHeaderBar } from '@/composables/useHeaderBar'

  defineOptions({ name: 'ArtHeaderBar' })

  // Detect OS type
  const isWindows = navigator.userAgent.includes('Windows')

  const router = useRouter()
  const { locale, t } = useI18n()
  const { width } = useWindowSize()

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  // Top bar feature config
  const {
    shouldShowMenuButton,
    shouldShowRefreshButton,
    shouldShowFastEnter,
    shouldShowBreadcrumb,
    shouldShowGlobalSearch,
    shouldShowFullscreen,
    shouldShowNotification,
    shouldShowChat,
    shouldShowLanguage,
    shouldShowSettings,
    shouldShowThemeToggle,
    fastEnterMinWidth: headerBarFastEnterMinWidth
  } = useHeaderBar()

  const { menuOpen, systemThemeColor, showSettingGuide, menuType, isDark, tabStyle } =
    storeToRefs(settingStore)

  const { language, getUserInfo: userInfo } = storeToRefs(userStore)
  const { menuList } = storeToRefs(menuStore)

  const showNotice = ref(false)
  const notice = ref(null)
  const userMenuPopover = ref()

  // Menu type checks
  const isLeftMenu = computed(() => menuType.value === MenuTypeEnum.LEFT)
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)
  const isTopMenu = computed(() => menuType.value === MenuTypeEnum.TOP)
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  onMounted(() => {
    initLanguage()
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    document.removeEventListener('click', bodyCloseNotice)
  })

  /** Toggle fullscreen */
  const toggleFullScreen = (): void => {
    toggleFullscreen()
  }

  /**
   * Compute top bar width
   * @returns {string} computed width
   */
  const topBarWidth = (): string => {
    const { TOP, DUAL_MENU, TOP_LEFT } = MenuTypeEnum
    const { getMenuOpenWidth } = settingStore
    const { isFirstLevel } = router.currentRoute.value.meta
    const type = menuType.value
    const isMenuOpen = menuOpen.value

    const isTopLayout = type === TOP || (type === TOP_LEFT && isFirstLevel)

    if (isTopLayout) {
      return '100%'
    }

    if (type === DUAL_MENU) {
      return isFirstLevel ? 'calc(100% - 80px)' : `calc(100% - 80px - ${getMenuOpenWidth})`
    }

    return isMenuOpen ? `calc(100% - ${getMenuOpenWidth})` : `calc(100% - ${MenuWidth.CLOSE})`
  }

  /** Toggle menu open/close */
  const visibleMenu = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  /**
   * Navigate to path
   * @param {string} path - target path
   */
  const goPage = (path: string): void => {
    router.push(path)
  }

  /** Open docs */
  const toDocs = (): void => {
    window.open(WEB_LINKS.DOCS)
  }

  /** Open GitHub */
  const toGithub = (): void => {
    window.open(WEB_LINKS.GITHUB)
  }

  /** Go to home */
  const toHome = (): void => {
    router.push(useCommon().homePath.value)
  }

  /** Logout confirm */
  const loginOut = (): void => {
    closeUserMenu()
    setTimeout(() => {
      ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        customClass: 'login-out-dialog'
      }).then(() => {
        userStore.logOut()
      })
    }, 200)
  }

  /**
   * Reload page
   * @param {number} time - delay in ms (default 0)
   */
  const reload = (time: number = 0): void => {
    setTimeout(() => {
      useCommon().refresh()
    }, time)
  }

  /** Initialize language */
  const initLanguage = (): void => {
    locale.value = language.value
  }

  /**
   * Change language
   * @param {LanguageEnum} lang - target language
   */
  const changeLanguage = (lang: LanguageEnum): void => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
    reload(50)
  }

  /** Open settings panel */
  const openSetting = (): void => {
    mittBus.emit('openSetting')

    // Hide settings guide tip
    if (showSettingGuide.value) {
      settingStore.hideSettingGuide()
    }
  }

  /** Open global search dialog */
  const openSearchDialog = (): void => {
    mittBus.emit('openSearchDialog')
  }

  /**
   * Close notifications when clicking outside
   * @param {Event} e - click event
   */
  const bodyCloseNotice = (e: any): void => {
    let { className } = e.target

    if (showNotice.value) {
      if (typeof className === 'object') {
        showNotice.value = false
        return
      }
      if (className.indexOf('notice-btn') === -1) {
        showNotice.value = false
      }
    }
  }

  /** Toggle notifications panel */
  const visibleNotice = (): void => {
    showNotice.value = !showNotice.value
  }

  /** Open chat window */
  const openChat = (): void => {
    mittBus.emit('openChat')
  }

  /** Open lock screen */
  const lockScreen = (): void => {
    mittBus.emit('openLockScreen')
  }

  /** Close user menu popover */
  const closeUserMenu = (): void => {
    setTimeout(() => {
      userMenuPopover.value.hide()
    }, 100)
  }
</script>

<style lang="scss" scoped>
  @use './style';
  @use './mobile';
</style>
