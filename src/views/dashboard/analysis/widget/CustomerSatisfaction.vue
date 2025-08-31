<template>
  <div class="custom-card art-custom-card customer-satisfaction">
    <div class="custom-card-header">
      <span class="title">Customer Satisfaction</span>
    </div>
    <div class="custom-card-body">
      <ArtLineChart
        height="100%"
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
      name: 'Last Month',
      data: [65, 72, 68, 75, 82, 78, 85],
      areaStyle: {
        startOpacity: 0.08,
        endOpacity: 0
      }
    },
    {
      name: 'This Month',
      data: [78, 85, 82, 88, 92, 89, 95],
      areaStyle: {
        startOpacity: 0.08,
        endOpacity: 0
      }
    }
  ])

  // X-axis labels
  const xAxisData = ['1', '2', '3', '4', '5', '6', '7']
</script>

<style lang="scss" scoped>
  .customer-satisfaction {
    height: 400px;

    .custom-card-body {
      height: calc(100% - 145px);
      padding: 60px 20px 10px;
    }
  }

  @media screen and (max-width: $device-phone) {
    .customer-satisfaction {
      height: 300px;

      .custom-card-body {
        height: calc(100% - 100px);
        padding-top: 20px;
      }
    }
  }
</style>
