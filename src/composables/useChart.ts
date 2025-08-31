import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { getCssVar } from '@/utils/ui'
import type { BaseChartProps, ChartThemeConfig, UseChartOptions } from '@/types/component/chart'

// Chart theme configuration
export const useChartOps = (): ChartThemeConfig => ({
  /** */
  chartHeight: '16rem',
  /** Font size */
  fontSize: 13,
  /** Font color */
  fontColor: '#999',
  /** Theme color */
  themeColor: getCssVar('--el-color-primary-light-1'),
  /** Color palette */
  colors: [
    getCssVar('--el-color-primary-light-1'),
    '#4ABEFF',
    '#EDF2FF',
    '#14DEBA',
    '#FFAF20',
    '#FA8A6C',
    '#FFAF20'
  ]
})

// Constants
const RESIZE_DELAYS = [50, 100, 200, 350] as const
const MENU_RESIZE_DELAYS = [50, 100, 200] as const
const RESIZE_DEBOUNCE_DELAY = 100

export function useChart(options: UseChartOptions = {}) {
  const { initOptions, initDelay = 0, threshold = 0.1, autoTheme = true } = options

  const settingStore = useSettingStore()
  const { isDark, menuOpen, menuType } = storeToRefs(settingStore)

  const chartRef = ref<HTMLElement>()
  let chart: echarts.ECharts | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let pendingOptions: EChartsOption | null = null
  let resizeTimeoutId: number | null = null
  let resizeFrameId: number | null = null
  let isDestroyed = false
  let emptyStateDiv: HTMLElement | null = null

  // Unified cleanup for timers
  const clearTimers = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
      resizeTimeoutId = null
    }
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId)
      resizeFrameId = null
    }
  }

  // Optimize resize with requestAnimationFrame
  const requestAnimationResize = () => {
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId)
    }
    resizeFrameId = requestAnimationFrame(() => {
      handleResize()
      resizeFrameId = null
    })
  }

  // Debounced resize handler (for window resize)
  const debouncedResize = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId)
    }
    resizeTimeoutId = window.setTimeout(() => {
      requestAnimationResize()
      resizeTimeoutId = null
    }, RESIZE_DEBOUNCE_DELAY)
  }

  // Multi-delay resize handling - unified
  const multiDelayResize = (delays: readonly number[]) => {
    // Call once immediately for responsiveness
    nextTick(requestAnimationResize)

    // Use delay to ensure proper adaptation
    delays.forEach((delay) => {
      setTimeout(requestAnimationResize, delay)
    })
  }

  // Recompute chart size when menu collapses
  watch(menuOpen, () => multiDelayResize(RESIZE_DELAYS))

  // Trigger on menu type change
  watch(menuType, () => {
    nextTick(requestAnimationResize)
    setTimeout(() => multiDelayResize(MENU_RESIZE_DELAYS), 0)
  })

  // Reset chart options when theme changes
  if (autoTheme) {
    watch(isDark, () => {
      // Update empty state styles
      emptyStateManager.updateStyle()

      if (chart && !isDestroyed) {
        // Optimize theme update with requestAnimationFrame
        requestAnimationFrame(() => {
          if (chart && !isDestroyed) {
            const currentOptions = chart.getOption()
            if (currentOptions) {
              updateChart(currentOptions as EChartsOption)
            }
          }
        })
      }
    })
  }

  // Style generator - unified style config
  const createLineStyle = (color: string, width = 1, type?: 'solid' | 'dashed') => ({
    color,
    width,
    ...(type && { type })
  })

  // Axis line style
  const getAxisLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? '#444' : '#EDEDED')
  })

  // Split line style
  const getSplitLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? '#444' : '#EDEDED', 1, 'dashed')
  })

  // Axis label style
  const getAxisLabelStyle = (show: boolean = true) => {
    const { fontColor, fontSize } = useChartOps()
    return {
      show,
      color: fontColor,
      fontSize
    }
  }

  // Axis tick style
  const getAxisTickStyle = () => ({
    show: false
  })

  // Get animation config
  const getAnimationConfig = (animationDelay: number = 50, animationDuration: number = 1500) => ({
    animationDelay: (idx: number) => idx * animationDelay + 200,
    animationDuration: (idx: number) => animationDuration - idx * 50,
    animationEasing: 'quarticOut' as const
  })

  // Get tooltip config
  const getTooltipStyle = (trigger: 'item' | 'axis' = 'axis', customOptions: any = {}) => ({
    trigger,
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#333' : '#ddd',
    borderWidth: 1,
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
    ...customOptions
  })

  // Get legend config
  const getLegendStyle = (
    position: 'bottom' | 'top' | 'left' | 'right' = 'bottom',
    customOptions: any = {}
  ) => {
    const baseConfig = {
      textStyle: {
        color: isDark.value ? '#fff' : '#333'
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      ...customOptions
    }

    // Positional config
    switch (position) {
      case 'bottom':
        return {
          ...baseConfig,
          bottom: 0,
          left: 'center',
          orient: 'horizontal',
          icon: 'roundRect'
        }
      case 'top':
        return {
          ...baseConfig,
          top: 0,
          left: 'center',
          orient: 'horizontal',
          icon: 'roundRect'
        }
      case 'left':
        return {
          ...baseConfig,
          left: 0,
          top: 'center',
          orient: 'vertical',
          icon: 'roundRect'
        }
      case 'right':
        return {
          ...baseConfig,
          right: 0,
          top: 'center',
          orient: 'vertical',
          icon: 'roundRect'
        }
      default:
        return baseConfig
    }
  }

  // Compute grid config from legend position
  const getGridWithLegend = (
    showLegend: boolean,
    legendPosition: 'bottom' | 'top' | 'left' | 'right' = 'bottom',
    baseGrid: any = {}
  ) => {
    const defaultGrid = {
      top: 15,
      right: 15,
      bottom: 8,
      left: 0,
      containLabel: true,
      ...baseGrid
    }

    if (!showLegend) {
      return defaultGrid
    }

    // Adjust grid by legend position
    switch (legendPosition) {
      case 'bottom':
        return {
          ...defaultGrid,
          bottom: 40
        }
      case 'top':
        return {
          ...defaultGrid,
          top: 40
        }
      case 'left':
        return {
          ...defaultGrid,
          left: 120
        }
      case 'right':
        return {
          ...defaultGrid,
          right: 120
        }
      default:
        return defaultGrid
    }
  }

  // Create IntersectionObserver
  const createIntersectionObserver = () => {
    if (intersectionObserver || !chartRef.value) return

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && pendingOptions && !isDestroyed) {
            // Ensure next frame init via requestAnimationFrame
            requestAnimationFrame(() => {
              if (!isDestroyed && pendingOptions) {
                try {
                  // Element became visible: init chart
                  if (!chart) {
                    chart = echarts.init(entry.target as HTMLElement)
                  }

                  // Emit event for component animation logic
                  const event = new CustomEvent('chartVisible', {
                    detail: { options: pendingOptions }
                  })
                  entry.target.dispatchEvent(event)

                  pendingOptions = null
                  cleanupIntersectionObserver()
                } catch (error) {
                  console.error('Chart init failed:', error)
                }
              }
            })
          }
        })
      },
      { threshold }
    )

    intersectionObserver.observe(chartRef.value)
  }

  // Cleanup IntersectionObserver
  const cleanupIntersectionObserver = () => {
    if (intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
    }
  }

  // Check container visibility
  const isContainerVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
  }

  // Chart init core logic
  const performChartInit = (options: EChartsOption) => {
    if (!chart && chartRef.value && !isDestroyed) {
      chart = echarts.init(chartRef.value)
    }
    if (chart && !isDestroyed) {
      chart.setOption(options)
      pendingOptions = null
    }
  }

  // Empty state manager
  const emptyStateManager = {
    create: () => {
      if (!chartRef.value || emptyStateDiv) return

      emptyStateDiv = document.createElement('div')
      emptyStateDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${isDark.value ? '#666' : '#999'};
        background: transparent;
        z-index: 10;
        gap: 8px;
      `
      emptyStateDiv.innerHTML = `
        <i class="iconfont-sys" style="font-size: 48px; color: ${isDark.value ? '#555' : '#ccc'};">&#xe6da;</i>
        <span>No data</span>
      `

      // Ensure parent has relative positioning
      if (
        chartRef.value.style.position !== 'relative' &&
        chartRef.value.style.position !== 'absolute'
      ) {
        chartRef.value.style.position = 'relative'
      }

      chartRef.value.appendChild(emptyStateDiv)
    },

    remove: () => {
      if (emptyStateDiv && chartRef.value) {
        chartRef.value.removeChild(emptyStateDiv)
        emptyStateDiv = null
      }
    },

    updateStyle: () => {
      if (emptyStateDiv) {
        emptyStateDiv.style.color = isDark.value ? '#666' : '#999'
        const iconElement = emptyStateDiv.querySelector('i.iconfont-sys')
        if (iconElement) {
          ;(iconElement as HTMLElement).style.color = isDark.value ? '#555' : '#ccc'
        }
      }
    }
  }

  // Initialize chart
  const initChart = (options: EChartsOption = {}, isEmpty: boolean = false) => {
    if (!chartRef.value || isDestroyed) return

    const mergedOptions = { ...initOptions, ...options }

    try {
      if (isEmpty) {
        // Handle empty data: show custom empty-state div
        if (chart) {
          chart.clear()
        }
        emptyStateManager.create()
        return
      } else {
        // Remove empty-state div when data exists
        emptyStateManager.remove()
      }

      if (isContainerVisible(chartRef.value)) {
        // Visible: normal init
        if (initDelay > 0) {
          setTimeout(() => performChartInit(mergedOptions), initDelay)
        } else {
          performChartInit(mergedOptions)
        }
      } else {
        // Not visible: save options and set observer
        pendingOptions = mergedOptions
        createIntersectionObserver()
      }
    } catch (error) {
      console.error('Chart init failed:', error)
    }
  }

  // Update chart
  const updateChart = (options: EChartsOption) => {
    if (isDestroyed) return

    try {
      if (!chart) {
        // Init first if chart missing
        initChart(options)
        return
      }
      chart.setOption(options)
    } catch (error) {
      console.error('Chart update failed:', error)
    }
  }

  // Handle window resize
  const handleResize = () => {
    if (chart && !isDestroyed) {
      try {
        chart.resize()
      } catch (error) {
        console.error('Chart resize failed:', error)
      }
    }
  }

  // Destroy chart
  const destroyChart = () => {
    isDestroyed = true

    if (chart) {
      try {
        chart.dispose()
      } catch (error) {
        console.error('Chart destroy failed:', error)
      } finally {
        chart = null
      }
    }

    // Cleanup empty-state div
    emptyStateManager.remove()
    cleanupIntersectionObserver()
    clearTimers()
    pendingOptions = null
  }

  // Get chart instance
  const getChartInstance = () => chart

  // Is chart initialized
  const isChartInitialized = () => chart !== null

  onMounted(() => {
    window.addEventListener('resize', debouncedResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedResize)
  })

  onUnmounted(() => {
    destroyChart()
  })

  return {
    isDark,
    chartRef,
    initChart,
    updateChart,
    handleResize,
    destroyChart,
    getChartInstance,
    isChartInitialized,
    emptyStateManager,
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    useChartOps,
    getGridWithLegend
  }
}

// Advanced chart component abstraction
interface UseChartComponentOptions<T extends BaseChartProps> {
  /** Reactive props object */
  props: T
  /** Chart options generator */
  generateOptions: () => EChartsOption
  /** Empty data checker */
  checkEmpty?: () => boolean
  /** Custom reactive data to watch */
  watchSources?: (() => any)[]
  /** Custom visibility event handler */
  onVisible?: () => void
  /** useChart options */
  chartOptions?: UseChartOptions
}

export function useChartComponent<T extends BaseChartProps>(options: UseChartComponentOptions<T>) {
  const {
    props,
    generateOptions,
    checkEmpty,
    watchSources = [],
    onVisible,
    chartOptions = {}
  } = options

  const chart = useChart(chartOptions)
  const { chartRef, initChart, isDark, emptyStateManager } = chart

  // Check for empty data
  const isEmpty = computed(() => {
    if (props.isEmpty) return true
    if (checkEmpty) return checkEmpty()
    return false
  })

  // Update chart
  const updateChart = () => {
    nextTick(() => {
      if (isEmpty.value) {
        // Handle empty: show custom empty-state div
        if (chart.getChartInstance()) {
          chart.getChartInstance()?.clear()
        }
        emptyStateManager.create()
      } else {
        // With data: remove empty-state div and init
        emptyStateManager.remove()
        initChart(generateOptions())
      }
    })
  }

  // Handle when chart becomes visible
  const handleChartVisible = () => {
    if (onVisible) {
      onVisible()
    } else {
      updateChart()
    }
  }

  // Set data watchers
  const setupWatchers = () => {
    // Watch custom data sources
    if (watchSources.length > 0) {
      watch(watchSources, updateChart, { deep: true })
    }

    // Watch theme changes
    watch(isDark, () => {
      emptyStateManager.updateStyle()
      updateChart()
    })
  }

  // Setup lifecycle
  const setupLifecycle = () => {
    onMounted(() => {
      updateChart()

      // Listen to chart visible event
      if (chartRef.value) {
        chartRef.value.addEventListener('chartVisible', handleChartVisible)
      }
    })

    onBeforeUnmount(() => {
      // Cleanup event listeners
      if (chartRef.value) {
        chartRef.value.removeEventListener('chartVisible', handleChartVisible)
      }
      // Cleanup empty-state div
      emptyStateManager.remove()
    })
  }

  // Initialize
  setupWatchers()
  setupLifecycle()

  return {
    ...chart,
    isEmpty,
    updateChart,
    handleChartVisible
  }
}
