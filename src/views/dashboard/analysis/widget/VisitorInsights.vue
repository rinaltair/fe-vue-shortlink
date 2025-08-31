<template>
  <div class="custom-card art-custom-card visitor-insights">
    <div class="custom-card-header">
      <span class="title">Visitor Insights</span>
    </div>
    <div class="custom-card-body">
      <ArtLineChart
        height="15rem"
        :data="chartData"
        :xAxisData="xAxisData"
        :showLegend="true"
        :showAxisLabel="true"
        :showAxisLine="false"
        :showSplitLine="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LineDataItem } from '@/types/component/chart'

  // Chart data
  const chartData = computed<LineDataItem[]>(() => [
    {
      name: 'Returning',
      data: [280, 350, 300, 250, 230, 210, 240, 280, 320, 350, 300, 200]
      // color: '#4ABEFF'
    },
    {
      name: 'New',
      data: [260, 200, 150, 130, 180, 270, 340, 380, 300, 220, 170, 130]
      // color: '#6E93FF'
    }
  ])

  // X-axis labels
  const xAxisData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
</script>

<style lang="scss" scoped>
  .visitor-insights {
    height: 330px;

    .custom-card-body {
      padding: 10px 20px;
    }
  }
</style>
