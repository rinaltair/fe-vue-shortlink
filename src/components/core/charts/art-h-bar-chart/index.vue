<!-- Horizontal bar chart -->
<template>
  <div ref="chartRef" :style="{ height: props.height }" v-loading="props.loading"></div>
</template>

<script setup lang="ts">
  import { useChartOps, useChartComponent } from '@/composables/useChart'
  import { getCssVar } from '@/utils/ui'
  import type { EChartsOption } from 'echarts'
  import type { BarChartProps, BarDataItem } from '@/types/component/chart'
  import * as echarts from 'echarts'

  defineOptions({ name: 'ArtHBarChart' })

  const props = withDefaults(defineProps<BarChartProps>(), {
    // Basic configuration
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // Data configuration
    data: () => [0, 0, 0, 0, 0, 0, 0],
    xAxisData: () => [],
    barWidth: '36%',
    stack: false,

    // Axis display configuration
    showAxisLabel: true,
    showAxisLine: true,
    showSplitLine: true,

    // Interaction configuration
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // Determine if it is multi-series data
  const isMultipleData = computed(() => {
    return (
      Array.isArray(props.data) &&
      props.data.length > 0 &&
      typeof props.data[0] === 'object' &&
      'name' in props.data[0]
    )
  })

  // Get color configuration
  const getColor = (customColor?: string, index?: number) => {
    if (customColor) return customColor

    if (index !== undefined) {
      return props.colors![index % props.colors!.length]
    }

    // Default gradient color
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: getCssVar('--el-color-primary')
      },
      {
        offset: 1,
        color: getCssVar('--el-color-primary-light-4')
      }
    ])
  }

  // Create gradient color
  const createGradientColor = (color: string) => {
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: color
      },
      {
        offset: 1,
        color: color
      }
    ])
  }

  // Get base item style configuration
  const getBaseItemStyle = (color: any) => ({
    borderRadius: 4,
    color: typeof color === 'string' ? createGradientColor(color) : color
  })

  // Create series configuration
  const createSeriesItem = (config: {
    name?: string
    data: number[]
    color?: string | echarts.graphic.LinearGradient
    barWidth?: string | number
    stack?: string
  }) => {
    const animationConfig = getAnimationConfig()

    return {
      name: config.name,
      data: config.data,
      type: 'bar' as const,
      stack: config.stack,
      itemStyle: getBaseItemStyle(config.color),
      barWidth: config.barWidth || props.barWidth,
      ...animationConfig
    }
  }

  // Use chart component abstraction
  const {
    chartRef,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend
  } = useChartComponent({
    props,
    checkEmpty: () => {
      // Check single-series data case
      if (Array.isArray(props.data) && typeof props.data[0] === 'number') {
        const singleData = props.data as number[]
        return !singleData.length || singleData.every((val) => val === 0)
      }

      // Check multi-series data case
      if (Array.isArray(props.data) && typeof props.data[0] === 'object') {
        const multiData = props.data as BarDataItem[]
        return (
          !multiData.length ||
          multiData.every((item) => !item.data?.length || item.data.every((val) => val === 0))
        )
      }

      return true
    },
    watchSources: [() => props.data, () => props.xAxisData, () => props.colors],
    generateOptions: (): EChartsOption => {
      const options: EChartsOption = {
        grid: getGridWithLegend(props.showLegend && isMultipleData.value, props.legendPosition, {
          top: 15,
          right: 0,
          left: 0
        }),
        tooltip: props.showTooltip ? getTooltipStyle() : undefined,
        xAxis: {
          type: 'value',
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          splitLine: getSplitLineStyle(props.showSplitLine)
        },
        yAxis: {
          type: 'category',
          data: props.xAxisData,
          axisTick: getAxisTickStyle(),
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine)
        }
      }

      // Add legend configuration
      if (props.showLegend && isMultipleData.value) {
        options.legend = getLegendStyle(props.legendPosition)
      }

      // Generate series data
      if (isMultipleData.value) {
        const multiData = props.data as BarDataItem[]
        options.series = multiData.map((item, index) => {
          const computedColor = getColor(props.colors[index], index)

          return createSeriesItem({
            name: item.name,
            data: item.data,
            color: computedColor,
            barWidth: item.barWidth,
            stack: props.stack ? item.stack || 'total' : undefined
          })
        })
      } else {
        // Single-series data case
        const singleData = props.data as number[]
        const computedColor = getColor()

        options.series = [
          createSeriesItem({
            data: singleData,
            color: computedColor
          })
        ]
      }

      return options
    }
  })
</script>

<style lang="scss" scoped>
  .art-h-bar-chart {
    position: relative;
    width: 100%;
  }
</style>
