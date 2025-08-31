<!-- Left sidebar menu or dual-column menu -->
<template>
  <div
    class="layout-sidebar"
    v-if="showLeftMenu || isDualMenu"
    :class="{ 'no-border': menuList.length === 0 }"
  >
    <!-- Dual-column menu (left side) -->
    <div v-if="isDualMenu" class="dual-menu-left" :style="{ background: getMenuTheme.background }">
      <ArtLogo class="logo" @click="navigateToHome" />

      <ElScrollbar style="height: calc(100% - 135px)">
        <ul>
          <li v-for="menu in firstLevelMenus" :key="menu.path" @click="handleMenuJump(menu, true)">
            <ElTooltip
              class="box-item"
              effect="dark"
              :content="$t(menu.meta.title)"
              placement="right"
              :offset="25"
              :hide-after="0"
              :disabled="dualMenuShowText"
            >
              <div
                :class="{
                  'is-active': menu.meta.isFirstLevel
                    ? menu.path === route.path
                    : menu.path === firstLevelMenuPath
                }"
                :style="{
                  margin: dualMenuShowText ? '5px' : '15px',
                  height: dualMenuShowText ? '60px' : '46px'
                }"
              >
                <i
                  class="iconfont-sys"
                  v-html="menu.meta.icon"
                  :style="{
                    fontSize: dualMenuShowText ? '18px' : '22px',
                    marginBottom: dualMenuShowText ? '5px' : '0'
                  }"
                />
                <span v-if="dualMenuShowText">
                  {{ $t(menu.meta.title) }}
                </span>
                <div v-if="menu.meta.showBadge" class="art-badge art-badge-dual" />
              </div>
            </ElTooltip>
          </li>
        </ul>
      </ElScrollbar>

      <div class="switch-btn" @click="toggleDualMenuMode">
        <i class="iconfont-sys">&#xe798;</i>
      </div>
    </div>

    <!-- Left menu || Dual-column menu (right side) -->
    <div
      v-show="menuList.length > 0"
      class="menu-left"
      :class="`menu-left-${getMenuTheme.theme} menu-left-${!menuOpen ? 'close' : 'open'}`"
      :style="{ background: getMenuTheme.background }"
    >
      <ElScrollbar style="height: calc(100% - 10px)">
        <div
          class="header"
          @click="navigateToHome"
          :style="{ background: getMenuTheme.background }"
        >
          <ArtLogo v-if="!isDualMenu" class="logo" />

          <p
            :class="{ 'is-dual-menu-name': isDualMenu }"
            :style="{
              color: getMenuTheme.systemNameColor,
              opacity: !menuOpen ? 0 : 1
            }"
          >
            {{ AppConfig.systemInfo.name }}
          </p>
        </div>

        <ElMenu
          :class="'el-menu-' + getMenuTheme.theme"
          :collapse="!menuOpen"
          :default-active="routerPath"
          :text-color="getMenuTheme.textColor"
          :unique-opened="uniqueOpened"
          :background-color="getMenuTheme.background"
          :active-text-color="getMenuTheme.textActiveColor"
          :default-openeds="defaultOpenedMenus"
          :popper-class="`menu-left-${getMenuTheme.theme}-popper`"
          :show-timeout="50"
          :hide-timeout="50"
        >
          <SidebarSubmenu
            :list="menuList"
            :isMobile="isMobileMode"
            :theme="getMenuTheme"
            @close="handleMenuClose"
          />
        </ElMenu>
      </ElScrollbar>

      <div
        class="menu-model"
        @click="toggleMenuVisibility"
        :style="{
          opacity: !menuOpen ? 0 : 1,
          transform: showMobileModal ? 'scale(1)' : 'scale(0)'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { isIframe } from '@/utils/navigation'
  import { handleMenuJump } from '@/utils/navigation'
  import SidebarSubmenu from './widget/SidebarSubmenu.vue'
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'ArtSidebarMenu' })

  const MOBILE_BREAKPOINT = 800
  const ANIMATION_DELAY = 350
  const MENU_CLOSE_WIDTH = MenuWidth.CLOSE

  const route = useRoute()
  const router = useRouter()
  const settingStore = useSettingStore()

  const { getMenuOpenWidth, menuType, uniqueOpened, dualMenuShowText, menuOpen, getMenuTheme } =
    storeToRefs(settingStore)

  // Internal component state
  const defaultOpenedMenus = ref<string[]>([])
  const isMobileMode = ref(false)
  const showMobileModal = ref(false)
  const currentScreenWidth = ref(0)

  // Menu width
  const menuopenwidth = computed(() => getMenuOpenWidth.value)
  const menuclosewidth = computed(() => MENU_CLOSE_WIDTH)

  // Menu type checks
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)
  const showLeftMenu = computed(
    () => menuType.value === MenuTypeEnum.LEFT || menuType.value === MenuTypeEnum.TOP_LEFT
  )
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)

  // Route related
  const firstLevelMenuPath = computed(() => route.matched[0]?.path)
  const routerPath = computed(() => String(route.meta.activePath || route.path))

  // Menu data
  const firstLevelMenus = computed(() => {
    return useMenuStore().menuList.filter((menu) => !menu.meta.isHide)
  })

  const menuList = computed(() => {
    const menuStore = useMenuStore()
    const allMenus = menuStore.menuList

    // If not top-left or dual-column menu, return full menu list
    if (!isTopLeftMenu.value && !isDualMenu.value) {
      return allMenus
    }

    // Handle iframe paths
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, allMenus)
    }

    // Handle first-level menu
    if (route.meta.isFirstLevel) {
      return []
    }

    // Return children under current top-level path
    const currentTopPath = `/${route.path.split('/')[1]}`
    const currentMenu = allMenus.find((menu) => menu.path === currentTopPath)
    return currentMenu?.children ?? []
  })

  /**
   * Check if screen is mobile
   */
  const isMobileScreen = (): boolean => {
    return document.body.clientWidth < MOBILE_BREAKPOINT
  }

  /**
   * Delay hiding the mobile modal
   */
  const delayHideMobileModal = (): void => {
    setTimeout(() => {
      showMobileModal.value = false
    }, ANIMATION_DELAY)
  }

  /**
   * Find second-level menu list corresponding to an iframe
   */
  const findIframeMenuList = (currentPath: string, menuList: any[]) => {
    // Recursively check if items contain the current path
    const hasPath = (items: any[]): boolean => {
      for (const item of items) {
        if (item.path === currentPath) {
          return true
        }
        if (item.children && hasPath(item.children)) {
          return true
        }
      }
      return false
    }

    // Traverse first-level menus to find matching children
    for (const menu of menuList) {
      if (menu.children && hasPath(menu.children)) {
        return menu.children
      }
    }
    return []
  }

  /**
   * Navigate to home page
   */
  const navigateToHome = (): void => {
    router.push(useCommon().homePath.value)
  }

  /**
   * Toggle menu visibility
   */
  const toggleMenuVisibility = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)

    // Mobile modal control logic
    if (isMobileScreen()) {
      if (!menuOpen.value) {
        // Menu will open: show modal immediately
        showMobileModal.value = true
      } else {
        // Menu will close: delay hiding modal to allow animation
        delayHideMobileModal()
      }
    }
  }

  /**
   * Handle menu close (from child component)
   */
  const handleMenuClose = (): void => {
    if (isMobileScreen()) {
      settingStore.setMenuOpen(false)
      delayHideMobileModal()
    }
  }

  /**
   * Toggle dual-column menu mode
   */
  const toggleDualMenuMode = (): void => {
    settingStore.setDualMenuShowText(!dualMenuShowText.value)
  }

  /**
   * Handle screen size changes
   */
  const handleScreenResize = (): void => {
    // Auto-collapse menu on small screens
    if (currentScreenWidth.value < MOBILE_BREAKPOINT) {
      settingStore.setMenuOpen(false)
      // On small screens, hide modal if menu is closed
      if (!menuOpen.value) {
        showMobileModal.value = false
      }
    } else {
      // Always hide modal on large screens
      showMobileModal.value = false
    }
  }

  /**
   * Set up window resize listener
   */
  const setupWindowResizeListener = (): void => {
    currentScreenWidth.value = document.body.clientWidth
    handleScreenResize()

    window.onresize = () => {
      currentScreenWidth.value = document.body.clientWidth
      handleScreenResize()
    }
  }

  /**
   * Watch menu open/close state changes
   */
  watch(
    () => menuOpen.value,
    (isMenuOpen: boolean) => {
      if (!isMobileScreen()) {
        // On large screens, always hide modal
        showMobileModal.value = false
      } else {
        // On small screens, control modal based on menu state
        if (isMenuOpen) {
          // Show modal immediately when menu opens
          showMobileModal.value = true
        } else {
          // Delay hiding modal when menu closes to ensure animation completes
          delayHideMobileModal()
        }
      }
    }
  )

  onMounted(() => {
    setupWindowResizeListener()
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss">
  @use './theme';

  .layout-sidebar {
    // Expanded width
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(menuopenwidth);
    }

    // Collapsed width
    .el-menu--collapse {
      width: v-bind(menuclosewidth);
    }
  }
</style>
