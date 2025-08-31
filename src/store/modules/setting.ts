import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { MenuThemeType } from '@/types/store'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import { setElementThemeColor } from '@/utils/ui'
import { useCeremony } from '@/composables/useCeremony'

const { defaultMenuWidth, defaultCustomRadius, defaultTabStyle } = AppConfig.systemSetting

/**
 * System settings state management
 * Manages menu, theme, UI visibility, and other app settings
 */
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    // Menu-related settings
    /** Menu type */
    const menuType = ref(MenuTypeEnum.LEFT)
    /** Menu expanded width */
    const menuOpenWidth = ref(defaultMenuWidth)
    /** Whether menu is expanded */
    const menuOpen = ref(true)
    /** Whether dual-menu shows text */
    const dualMenuShowText = ref(false)

    // Theme-related settings
    /** System theme type */
    const systemThemeType = ref(SystemThemeEnum.AUTO)
    /** System theme mode */
    const systemThemeMode = ref(SystemThemeEnum.AUTO)
    /** Menu theme type */
    const menuThemeType = ref(MenuThemeEnum.DESIGN)
    /** System theme color */
    const systemThemeColor = ref(AppConfig.elementPlusTheme.primary)

    // UI visibility settings
    /** Show menu button */
    const showMenuButton = ref(true)
    /** Show fast enter */
    const showFastEnter = ref(true)
    /** Show refresh button */
    const showRefreshButton = ref(true)
    /** Show breadcrumbs */
    const showCrumbs = ref(true)
    /** Show work tabs */
    const showWorkTab = ref(true)
    /** Show language switch */
    const showLanguage = ref(true)
    /** Show progress bar */
    const showNprogress = ref(true)
    /** Show settings guide */
    const showSettingGuide = ref(true)
    /** Show festival text */
    const showFestivalText = ref(false)
    /** Show watermark */
    const watermarkVisible = ref(false)

    // Functional settings
    /** Auto close */
    const autoClose = ref(false)
    /** Unique opened */
    const uniqueOpened = ref(true)
    /** Color weak mode */
    const colorWeak = ref(false)
    /** Refresh flag */
    const refresh = ref(false)
    /** Whether holiday fireworks loaded */
    const holidayFireworksLoaded = ref(false)

    // Style settings
    /** Border mode */
    const boxBorderMode = ref(true)
    /** Page transition */
    const pageTransition = ref('slide-left')
    /** Tab style */
    const tabStyle = ref(defaultTabStyle)
    /** Custom border radius */
    const customRadius = ref(defaultCustomRadius)
    /** Container width */
    const containerWidth = ref(ContainerWidthEnum.FULL)

    // Festival related
    /** Festival date */
    const festivalDate = ref('')

    /**
     * Get menu theme
     * Returns theme config based on current theme type and dark mode
     */
    const getMenuTheme = computed((): MenuThemeType => {
      const list = AppConfig.themeList.filter((item) => item.theme === menuThemeType.value)
      if (isDark.value) {
        return AppConfig.darkMenuStyles[0]
      } else {
        return list[0]
      }
    })

    /**
     * Whether in dark mode
     */
    const isDark = computed((): boolean => {
      return systemThemeType.value === SystemThemeEnum.DARK
    })

    /**
     * Get menu expanded width
     */
    const getMenuOpenWidth = computed((): string => {
      return menuOpenWidth.value + 'px' || defaultMenuWidth + 'px'
    })

    /**
     * Get custom border radius
     */
    const getCustomRadius = computed((): string => {
      return customRadius.value + 'rem' || defaultCustomRadius + 'rem'
    })

    /**
     * Whether to show fireworks
     * Based on current date and festival date
     */
    const isShowFireworks = computed((): boolean => {
      return festivalDate.value === useCeremony().currentFestivalData.value?.date ? false : true
    })

    /**
     * Switch menu layout
     * @param type Menu type
     */
    const switchMenuLayouts = (type: MenuTypeEnum) => {
      menuType.value = type
    }

    /**
     * Set menu expanded width
     * @param width Width in px
     */
    const setMenuOpenWidth = (width: number) => {
      menuOpenWidth.value = width
    }

    /**
     * Set global theme
     * @param theme Theme type
     * @param themeMode Theme mode
     */
    const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
      systemThemeType.value = theme
      systemThemeMode.value = themeMode
    }

    /**
     * Switch menu styles
     * @param theme Menu theme
     */
    const switchMenuStyles = (theme: MenuThemeEnum) => {
      menuThemeType.value = theme
    }

    /**
     * Set Element Plus theme color
     * @param theme Theme color
     */
    const setElementTheme = (theme: string) => {
      systemThemeColor.value = theme
      setElementThemeColor(theme)
    }

    /**
     * Toggle border mode
     */
    const setBorderMode = () => {
      boxBorderMode.value = !boxBorderMode.value
    }

    /**
     * Set container width
     * @param width Container width enum
     */
    const setContainerWidth = (width: ContainerWidthEnum) => {
      containerWidth.value = width
    }

    /**
     * Toggle unique-opened mode
     */
    const setUniqueOpened = () => {
      uniqueOpened.value = !uniqueOpened.value
    }

    /**
     * Toggle menu button visibility
     */
    const setButton = () => {
      showMenuButton.value = !showMenuButton.value
    }

    /**
     * Toggle fast enter visibility
     */
    const setFastEnter = () => {
      showFastEnter.value = !showFastEnter.value
    }

    /**
     * Toggle auto close
     */
    const setAutoClose = () => {
      autoClose.value = !autoClose.value
    }

    /**
     * Toggle refresh button visibility
     */
    const setShowRefreshButton = () => {
      showRefreshButton.value = !showRefreshButton.value
    }

    /**
     * Toggle breadcrumbs visibility
     */
    const setCrumbs = () => {
      showCrumbs.value = !showCrumbs.value
    }

    /**
     * Set worktab visibility
     * @param show Whether to show
     */
    const setWorkTab = (show: boolean) => {
      showWorkTab.value = show
    }

    /**
     * Toggle language switch visibility
     */
    const setLanguage = () => {
      showLanguage.value = !showLanguage.value
    }

    /**
     * Toggle progress bar visibility
     */
    const setNprogress = () => {
      showNprogress.value = !showNprogress.value
    }

    /**
     * Toggle color-weak mode
     */
    const setColorWeak = () => {
      colorWeak.value = !colorWeak.value
    }

    /**
     * Hide settings guide
     */
    const hideSettingGuide = () => {
      showSettingGuide.value = false
    }

    /**
     * Show settings guide
     */
    const openSettingGuide = () => {
      showSettingGuide.value = true
    }

    /**
     * Set page transition effect
     * @param transition Transition name
     */
    const setPageTransition = (transition: string) => {
      pageTransition.value = transition
    }

    /**
     * Set tab style
     * @param style Style name
     */
    const setTabStyle = (style: string) => {
      tabStyle.value = style
    }

    /**
     * Set menu expanded state
     * @param open Whether expanded
     */
    const setMenuOpen = (open: boolean) => {
      menuOpen.value = open
    }

    /**
     * Refresh page
     */
    const reload = () => {
      refresh.value = !refresh.value
    }

    /**
     * Set watermark visibility
     * @param visible Whether visible
     */
    const setWatermarkVisible = (visible: boolean) => {
      watermarkVisible.value = visible
    }

    /**
     * Set custom border radius
     * @param radius Radius value
     */
    const setCustomRadius = (radius: string) => {
      customRadius.value = radius
      document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
    }

    /**
     * Set festival fireworks load state
     * @param isLoad Whether loaded
     */
    const setholidayFireworksLoaded = (isLoad: boolean) => {
      holidayFireworksLoaded.value = isLoad
    }

    /**
     * Set festival text visibility
     * @param show Whether to show
     */
    const setShowFestivalText = (show: boolean) => {
      showFestivalText.value = show
    }

    const setFestivalDate = (date: string) => {
      festivalDate.value = date
    }

    const setDualMenuShowText = (show: boolean) => {
      dualMenuShowText.value = show
    }

    // Initialize theme styles
    const initThemeStyles = () => {
      setElementThemeColor(systemThemeColor.value)
      document.documentElement.style.setProperty('--custom-radius', `${customRadius.value}rem`)
    }

    nextTick(() => {
      initThemeStyles()
    })

    return {
      menuType,
      menuOpenWidth,
      systemThemeType,
      systemThemeMode,
      menuThemeType,
      systemThemeColor,
      boxBorderMode,
      uniqueOpened,
      showMenuButton,
      showFastEnter,
      showRefreshButton,
      showCrumbs,
      autoClose,
      showWorkTab,
      showLanguage,
      showNprogress,
      colorWeak,
      showSettingGuide,
      pageTransition,
      tabStyle,
      menuOpen,
      refresh,
      watermarkVisible,
      customRadius,
      holidayFireworksLoaded,
      showFestivalText,
      festivalDate,
      dualMenuShowText,
      containerWidth,
      getMenuTheme,
      isDark,
      getMenuOpenWidth,
      getCustomRadius,
      isShowFireworks,
      switchMenuLayouts,
      setMenuOpenWidth,
      setGlopTheme,
      switchMenuStyles,
      setElementTheme,
      setBorderMode,
      setContainerWidth,
      setUniqueOpened,
      setButton,
      setFastEnter,
      setAutoClose,
      setShowRefreshButton,
      setCrumbs,
      setWorkTab,
      setLanguage,
      setNprogress,
      setColorWeak,
      hideSettingGuide,
      openSettingGuide,
      setPageTransition,
      setTabStyle,
      setMenuOpen,
      reload,
      setWatermarkVisible,
      setCustomRadius,
      setholidayFireworksLoaded,
      setShowFestivalText,
      setFestivalDate,
      setDualMenuShowText
    }
  },
  {
    persist: {
      key: 'setting',
      storage: localStorage
    }
  }
)
