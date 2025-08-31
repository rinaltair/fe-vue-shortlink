<!-- Bidirectional stacked bar chart -->
<template>
  <div ref="chartRef" :style="{ height: props.height }" v-loading="props.loading"> </div>
</template>

<script setup lang="ts">
  import { useChartOps, useChartComponent } from '@/composables/useChart'
  import type { EChartsOption, BarSeriesOption } from 'echarts'
  import type { BidirectionalBarChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtDualBarCompareChart' })

  const props = withDefaults(defineProps<BidirectionalBarChartProps>(), {
    // Basic configuration
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    // Data configuration
    positiveData: () => [],
    negativeData: () => [],
    xAxisData: () => [],
    positiveName: 'Positive Data',
    negativeName: 'Negative Data',
    barWidth: 16,
    yAxisMin: -100,
    yAxisMax: 100,

    // Style configuration
    showDataLabel: false,
    positiveBorderRadius: () => [10, 10, 0, 0],
    negativeBorderRadius: () => [0, 0, 10, 10],

    // Axis display configuration
    showAxisLabel: true,
    showAxisLine: false,
    showSplitLine: false,

    // Interaction configuration
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // Helper function to create series configuration
  const createSeriesConfig = (config: {
    name: string
    data: number[]
    borderRadius: number | number[]
    labelPosition: 'top' | 'bottom'
    colorIndex: number
    formatter?: (params: any) => string
  }): BarSeriesOption => {
    const { fontColor } = useChartOps()
    const animationConfig = getAnimationConfig()

    return {
      name: config.name,
      type: 'bar',
      stack: 'total',
      barWidth: props.barWidth,
      barGap: '-100%',
      data: config.data,
      itemStyle: {
        borderRadius: config.borderRadius,
        color: props.colors[config.colorIndex]
      },
      label: {
        show: props.showDataLabel,
        position: config.labelPosition,
        formatter: config.formatter || ((params: any) => String(params.value)),
        color: fontColor,
        fontSize: 12
      },
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
      return (
        props.isEmpty ||
        !props.positiveData.length ||
        !props.negativeData.length ||
        (props.positiveData.every((val) => val === 0) &&
          props.negativeData.every((val) => val === 0))
      )
    },
    watchSources: [
      () => props.positiveData,
      () => props.negativeData,
      () => props.xAxisData,
      () => props.colors
    ],
    generateOptions: (): EChartsOption => {
      // Process negative data to ensure negative values
      const processedNegativeData = props.negativeData.map((val) => (val > 0 ? -val : val))

      // Optimized grid configuration
      const gridConfig = {
        top: props.showLegend ? 50 : 20,
        right: 0,
        left: 0,
        bottom: 0, // Increase bottom spacing
        containLabel: true
      }

      const options: EChartsOption = {
        backgroundColor: 'transparent',
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        grid: getGridWithLegend(props.showLegend, props.legendPosition, gridConfig),

        // Optimized tooltip configuration
        tooltip: props.showTooltip
          ? {
              ...getTooltipStyle(),
              trigger: 'axis',
              axisPointer: {
                type: 'none' // Remove indicator line
              }
            }
          : undefined,

        // Legend configuration
        legend: props.showLegend
          ? {
              ...getLegendStyle(props.legendPosition),
              data: [props.negativeName, props.positiveName]
            }
          : undefined,

        // X axis configuration
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          boundaryGap: true
        },

        // Y axis configuration
        yAxis: {
          type: 'value',
          min: props.yAxisMin,
          max: props.yAxisMax,
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine),
          splitLine: getSplitLineStyle(props.showSplitLine)
        },

        // Series configuration
        series: [
          // Negative data series
          createSeriesConfig({
            name: props.negativeName,
            data: processedNegativeData,
            borderRadius: props.negativeBorderRadius,
            labelPosition: 'bottom',
            colorIndex: 1,
            formatter: (params: any) => String(Math.abs(params.value))
          }),
          // Positive data series
          createSeriesConfig({
            name: props.positiveName,
            data: props.positiveData,
            borderRadius: props.positiveBorderRadius,
            labelPosition: 'top',
            colorIndex: 0
          })
        ]
      }

      return options
    }
  })
</script>
