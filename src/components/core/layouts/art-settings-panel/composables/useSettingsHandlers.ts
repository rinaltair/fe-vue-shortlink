import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import type { ContainerWidthEnum } from '@/enums/appEnum'

/**
 * Common handlers for settings items
 */
export function useSettingsHandlers() {
  const settingStore = useSettingStore()

  // DOM operations
  const domOperations = {
    // Set HTML class name
    setHtmlClass: (className: string, add: boolean) => {
      const el = document.getElementsByTagName('html')[0]
      if (add) {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },

    // Set root element attribute
    setRootAttribute: (attribute: string, value: string) => {
      const el = document.documentElement
      el.setAttribute(attribute, value)
    },

    // Set body class name
    setBodyClass: (className: string, add: boolean) => {
      const el = document.getElementsByTagName('body')[0]
      if (add) {
        el.setAttribute('class', className)
      } else {
        el.removeAttribute('class')
      }
    }
  }

  // Generic toggle handler
  const createToggleHandler = (storeMethod: () => void, callback?: () => void) => {
    return () => {
      storeMethod()
      callback?.()
    }
  }

  // Generic value change handler
  const createValueHandler = <T>(
    storeMethod: (value: T) => void,
    callback?: (value: T) => void
  ) => {
    return (value: T) => {
      if (value !== undefined && value !== null) {
        storeMethod(value)
        callback?.(value)
      }
    }
  }

  // Basic settings handler
  const basicHandlers = {
    // Worktab tabs
    workTab: createToggleHandler(() => settingStore.setWorkTab(!settingStore.showWorkTab)),

    // Menu accordion
    uniqueOpened: createToggleHandler(() => settingStore.setUniqueOpened()),

    // Show menu button
    menuButton: createToggleHandler(() => settingStore.setButton()),

    // Show fast entry
    fastEnter: createToggleHandler(() => settingStore.setFastEnter()),

    // Show refresh button
    refreshButton: createToggleHandler(() => settingStore.setShowRefreshButton()),

    // Show breadcrumb
    crumbs: createToggleHandler(() => settingStore.setCrumbs()),

    // Show language switch
    language: createToggleHandler(() => settingStore.setLanguage()),

    // Show progress bar
    nprogress: createToggleHandler(() => settingStore.setNprogress()),

    // Color-weak mode
    colorWeak: createToggleHandler(
      () => settingStore.setColorWeak(),
      () => {
        domOperations.setHtmlClass('color-weak', settingStore.colorWeak)
      }
    ),

    // Watermark visibility
    watermark: createToggleHandler(() =>
      settingStore.setWatermarkVisible(!settingStore.watermarkVisible)
    ),

    // Menu expanded width
    menuOpenWidth: createValueHandler<number>((width: number) =>
      settingStore.setMenuOpenWidth(width)
    ),

    // Tab style
    tabStyle: createValueHandler<string>((style: string) => settingStore.setTabStyle(style)),

    // Page transition animation
    pageTransition: createValueHandler<string>((transition: string) =>
      settingStore.setPageTransition(transition)
    ),

    // Border radius size
    customRadius: createValueHandler<string>((radius: string) =>
      settingStore.setCustomRadius(radius)
    )
  }

  // Box style handlers
  const boxStyleHandlers = {
    // Set box mode
    setBoxMode: (type: 'border-mode' | 'shadow-mode') => {
      const { boxBorderMode } = storeToRefs(settingStore)

      // Prevent duplicate setting
      if (
        (type === 'shadow-mode' && boxBorderMode.value === false) ||
        (type === 'border-mode' && boxBorderMode.value === true)
      ) {
        return
      }

      setTimeout(() => {
        domOperations.setRootAttribute('data-box-mode', type)
        settingStore.setBorderMode()
      }, 50)
    }
  }

  // Color settings handlers
  const colorHandlers = {
    // Select theme color
    selectColor: (theme: string) => {
      settingStore.setElementTheme(theme)
      settingStore.reload()
    }
  }

  // Container settings handlers
  const containerHandlers = {
    // Set container width
    setWidth: (type: ContainerWidthEnum) => {
      settingStore.setContainerWidth(type)
      settingStore.reload()
    }
  }

  return {
    domOperations,
    basicHandlers,
    boxStyleHandlers,
    colorHandlers,
    containerHandlers,
    createToggleHandler,
    createValueHandler
  }
}
