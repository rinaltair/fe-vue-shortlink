<!-- Line chart: supports multiple series and staggered animation -->
<template>
  <div
    ref="chartRef"
    class="art-line-chart"
    :style="{ height: props.height }"
    v-loading="props.loading"
  >
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import type { EChartsOption } from 'echarts'
  import { getCssVar, hexToRgba } from '@/utils/ui'
  import { useChartOps, useChart } from '@/composables/useChart'
  import type { LineChartProps, LineDataItem } from '@/types/component/chart'

  defineOptions({ name: 'ArtLineChart' })

  const props = withDefaults(defineProps<LineChartProps>(), {
    // Basic config
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // Data config
    data: () => [0, 0, 0, 0, 0, 0, 0],
    xAxisData: () => [],
    lineWidth: 2.5,
    showAreaColor: false,
    smooth: true,
    symbol: 'none',
    symbolSize: 6,
    animationDelay: 200,

    // Axis display config
    showAxisLabel: true,
    showAxisLine: true,
    showSplitLine: true,

    // Interaction config
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // Use base useChart hook
  const {
    chartRef,
    isDark,
    initChart,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend
  } = useChart()

  // Animation state and timer management
  const isAnimating = ref(false)
  const animationTimer = ref<ReturnType<typeof setTimeout>>()
  const animatedData = ref<number[] | LineDataItem[]>([])

  // Clear timer
  const clearAnimationTimer = () => {
    if (animationTimer.value) {
      clearTimeout(animationTimer.value)
      animationTimer.value = undefined
    }
  }

  // Check if data is empty
  const isEmpty = computed(() => {
    if (props.isEmpty) return true

    // Check single-series case
    if (Array.isArray(props.data) && typeof props.data[0] === 'number') {
      const singleData = props.data as number[]
      return !singleData.length || singleData.every((val) => val === 0)
    }

    // Check multi-series case
    if (Array.isArray(props.data) && typeof props.data[0] === 'object') {
      const multiData = props.data as LineDataItem[]
      return (
        !multiData.length ||
        multiData.every((item) => !item.data?.length || item.data.every((val) => val === 0))
      )
    }

    return true
  })

  // Determine if multi-series
  const isMultipleData = computed(() => {
    return (
      Array.isArray(props.data) &&
      props.data.length > 0 &&
      typeof props.data[0] === 'object' &&
      'name' in props.data[0]
    )
  })

  // Cache computed max value to avoid repeated calculation
  const maxValue = computed(() => {
    if (isMultipleData.value) {
      const multiData = props.data as LineDataItem[]
      return multiData.reduce((max, item) => {
        if (item.data?.length) {
          const itemMax = Math.max(...item.data)
          return Math.max(max, itemMax)
        }
        return max
      }, 0)
    } else {
      const singleData = props.data as number[]
      return singleData?.length ? Math.max(...singleData) : 0
    }
  })

  // Initialize animation data
  const initAnimationData = () => {
    if (isMultipleData.value) {
      const multiData = props.data as LineDataItem[]
      return multiData.map((item) => ({
        ...item,
        data: new Array(item.data.length).fill(0)
      }))
    } else {
      const singleData = props.data as number[]
      return new Array(singleData.length).fill(0)
    }
  }

  // Copy real data
  const copyRealData = () => {
    return isMultipleData.value
      ? [...(props.data as LineDataItem[])]
      : [...(props.data as number[])]
  }

  // Get color config
  const getColor = (customColor?: string, index?: number) => {
    if (customColor) return customColor

    if (index !== undefined) {
      return props.colors![index % props.colors!.length]
    }

    return getCssVar('--el-color-primary')
  }

  // Generate area style
  const generateAreaStyle = (item: LineDataItem, color: string) => {
    // If areaStyle exists or area color is enabled, show area style
    if (!item.areaStyle && !item.showAreaColor && !props.showAreaColor) return undefined

    const areaConfig = item.areaStyle || {}
    if (areaConfig.custom) return areaConfig.custom

    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: hexToRgba(color, areaConfig.startOpacity || 0.2).rgba
        },
        {
          offset: 1,
          color: hexToRgba(color, areaConfig.endOpacity || 0.02).rgba
        }
      ])
    }
  }

  // Generate single-series area style
  const generateSingleAreaStyle = () => {
    if (!props.showAreaColor) return undefined

    const color = getColor(props.colors[0])
    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: hexToRgba(color, 0.2).rgba
        },
        {
          offset: 1,
          color: hexToRgba(color, 0.02).rgba
        }
      ])
    }
  }

  // Create series config
  const createSeriesItem = (config: {
    name?: string
    data: number[]
    color?: string
    smooth?: boolean
    symbol?: string
    symbolSize?: number
    lineWidth?: number
    areaStyle?: any
  }) => {
    return {
      name: config.name,
      data: config.data,
      type: 'line' as const,
      color: config.color,
      smooth: config.smooth ?? props.smooth,
      symbol: config.symbol ?? props.symbol,
      symbolSize: config.symbolSize ?? props.symbolSize,
      lineStyle: {
        width: config.lineWidth ?? props.lineWidth,
        color: config.color
      },
      areaStyle: config.areaStyle,
      emphasis: {
        focus: 'series' as const,
        lineStyle: {
          width: (config.lineWidth ?? props.lineWidth) + 1
        }
      }
    }
  }

  // Generate chart options
  const generateChartOptions = (isInitial = false): EChartsOption => {
    const options: EChartsOption = {
      animation: true,
      animationDuration: isInitial ? 0 : 1300,
      animationDurationUpdate: isInitial ? 0 : 1300,
      grid: getGridWithLegend(props.showLegend && isMultipleData.value, props.legendPosition, {
        top: 15,
        right: 15,
        left: 0
      }),
      tooltip: props.showTooltip ? getTooltipStyle() : undefined,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.xAxisData,
        axisTick: getAxisTickStyle(),
        axisLine: getAxisLineStyle(props.showAxisLine),
        axisLabel: getAxisLabelStyle(props.showAxisLabel)
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maxValue.value,
        axisLabel: getAxisLabelStyle(props.showAxisLabel),
        axisLine: getAxisLineStyle(props.showAxisLine),
        splitLine: getSplitLineStyle(props.showSplitLine)
      }
    }

    // Add legend config
    if (props.showLegend && isMultipleData.value) {
      options.legend = getLegendStyle(props.legendPosition)
    }

    // Generate series data
    if (isMultipleData.value) {
      const multiData = animatedData.value as LineDataItem[]
      options.series = multiData.map((item, index) => {
        const itemColor = getColor(props.colors[index], index)
        const areaStyle = generateAreaStyle(item, itemColor)

        return createSeriesItem({
          name: item.name,
          data: item.data,
          color: itemColor,
          smooth: item.smooth,
          symbol: item.symbol,
          lineWidth: item.lineWidth,
          areaStyle
        })
      })
    } else {
      // Single-series case
      const singleData = animatedData.value as number[]
      const computedColor = getColor(props.colors[0])
      const areaStyle = generateSingleAreaStyle()

      options.series = [
        createSeriesItem({
          data: singleData,
          color: computedColor,
          areaStyle
        })
      ]
    }

    return options
  }

  // Update chart
  const updateChart = (options: EChartsOption) => {
    initChart(options, isEmpty.value)
  }

  // Initialize animation (optimized staggered animation for multi-series)
  const initChartWithAnimation = () => {
    if (!isEmpty.value) {
      clearAnimationTimer()
      isAnimating.value = true

      // If multi-series, use staggered animation
      if (isMultipleData.value) {
        const multiData = props.data as LineDataItem[]

        // Initialize data to 0
        animatedData.value = initAnimationData()
        updateChart(generateChartOptions(true))

        // Staggered update for each series
        multiData.forEach((item, index) => {
          setTimeout(
            () => {
              // Update each series one by one
              const currentAnimatedData = animatedData.value as LineDataItem[]
              currentAnimatedData[index] = { ...item }
              animatedData.value = [...currentAnimatedData]
              updateChart(generateChartOptions(false))
            },
            index * props.animationDelay + 100
          )
        })

        // Mark animation as complete
        const totalDelay = (multiData.length - 1) * props.animationDelay + 1500
        setTimeout(() => {
          isAnimating.value = false
        }, totalDelay)
      } else {
        // For single-series, keep the simple animation
        animatedData.value = initAnimationData()
        updateChart(generateChartOptions(true))

        animationTimer.value = setTimeout(() => {
          animatedData.value = copyRealData()
          updateChart(generateChartOptions(false))
          isAnimating.value = false
        }, 100)
      }
    } else {
      animatedData.value = copyRealData()
      updateChart(generateChartOptions(false))
    }
  }

  // Chart render function
  const renderChart = () => {
    initChartWithAnimation()
  }

  // Handle animation when chart enters the viewport
  const handleChartVisible = () => {
    // When the chart becomes visible, use the same animation logic
    initChartWithAnimation()
  }

  // Watch data changes - optimize watcher to reduce unnecessary rerenders
  watch(
    [() => props.data, () => props.xAxisData, () => props.colors],
    () => {
      // Only trigger rerender when not animating
      if (!isAnimating.value) {
        renderChart()
      }
    },
    { deep: true }
  )

  // Watch theme changes - update via setOption instead of full rerender
  watch(isDark, () => {
    // Get chart instance
    const chartInstance =
      (chartRef.value as any)?.__echart__ || echarts.getInstanceByDom(chartRef.value as HTMLElement)

    if (chartInstance && !isEmpty.value) {
      // Regenerate options and update chart to avoid full rerender
      const newOptions = generateChartOptions(false)
      chartInstance.setOption(newOptions)
    }
  })

  // Lifecycle
  onMounted(() => {
    renderChart()

    // Listen for chart visibility event
    if (chartRef.value) {
      chartRef.value.addEventListener('chartVisible', handleChartVisible)
    }
  })

  onBeforeUnmount(() => {
    clearAnimationTimer()

    // Clean up event listeners
    if (chartRef.value) {
      chartRef.value.removeEventListener('chartVisible', handleChartVisible)
    }
  })
</script>

<style lang="scss" scoped>
  .art-line-chart {
    position: relative;
    width: calc(100% + 10px);
  }
</style>
