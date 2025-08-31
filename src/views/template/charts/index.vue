<!--
 * Partial props reference:
 * Chart height: height="12rem" | height="300px"
 * Bar width: barWidth="26%"
 * Border radius: :borderRadius="4" | :borderRadius="[6, 6, 0, 0]"
 * Colors: :colors=['#409eff', '#95E0FB']
 * Show legend: :showLegend="true"
 * Legend position: legendPosition="bottom" | "top" | "left" | "right"
 * Show tooltip: :showTooltip="true"
 * Stacked: :stack="true"
 * Data point size: :symbolSize="7"
 * Data point symbol: symbol="circle" | "rect" | "roundRect" | "triangle" | "diamond" | "pin" | "arrow" | "none"
-->
<template>
  <div class="charts">
    <h1 class="page-title">Charts</h1>

    <ElRow :gutter="20">
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Single Series)</span>
          </div>
          <ArtBarChart
            :data="singleBarData"
            :xAxisData="xAxisData"
            :showLegend="true"
            legendPosition="right"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Multiple Series)</span>
          </div>
          <ArtBarChart
            :data="multiBarData"
            :xAxisData="xAxisData"
            :showLegend="true"
            barWidth="26%"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Stacked)</span>
          </div>
          <ArtBarChart
            :data="stackBarData"
            :xAxisData="stackXAxisData"
            :showLegend="true"
            :stack="true"
            barWidth="26%"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Line</span>
          </div>
          <ArtLineChart
            :data="[58, 15, 82, 35, 120, 62, 45]"
            :xAxisData="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
            symbol="none"
            :symbolSize="7"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Line (Gradient Area)</span>
          </div>
          <ArtLineChart
            :data="[28, 45, 82, 35, 100, 32, 55]"
            :xAxisData="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
            :showAreaColor="true"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Line (Multiple Series)</span>
          </div>
          <ArtLineChart
            :data="multiLineData"
            :xAxisData="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
            :showLegend="true"
          />
        </div>
      </ElCol>

      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Horizontal)</span>
          </div>
          <ArtHBarChart
            :data="[50, 80, 120, 90, 60]"
            :xAxisData="['Product A', 'Product B', 'Product C', 'Product D', 'Product E']"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Horizontal)</span>
          </div>

          <ArtHBarChart
            :data="[
              { name: 'Series 1', data: [10, 20, 30] },
              { name: 'Series 2', data: [15, 25, 35] }
            ]"
            :xAxisData="['Category 1', 'Category 2', 'Category 3']"
            :showLegend="true"
            barWidth="30%"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bar (Horizontal Stacked)</span>
          </div>
          <ArtHBarChart
            :data="[
              { name: 'Series 1', data: [10, 20, 30] },
              { name: 'Series 2', data: [15, 25, 35] }
            ]"
            :xAxisData="['Category 1', 'Category 2', 'Category 3']"
            :showLegend="true"
            :stack="true"
            barWidth="30%"
          />
        </div>
      </ElCol>

      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Ring</span>
          </div>
          <ArtRingChart
            :data="[
              { value: 35, name: 'Category A' },
              { value: 28, name: 'Category B' },
              { value: 42, name: 'Category C' }
            ]"
            :radius="['54%', '70%']"
            legendPosition="bottom"
          />
        </div>
      </ElCol>

      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Ring</span>
          </div>
          <ArtRingChart
            :data="[
              { value: 35, name: 'Category A' },
              { value: 28, name: 'Category B' },
              { value: 42, name: 'Category C' },
              { value: 32, name: 'Category D' },
              { value: 26, name: 'Category E' },
              { value: 37, name: 'Category F' }
            ]"
            :radius="['54%', '70%']"
            :borderRadius="0"
            :showLegend="true"
            legendPosition="bottom"
            centerText="¥300,458"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Pie</span>
          </div>
          <ArtRingChart
            :data="[
              { value: 30, name: 'Category A' },
              { value: 25, name: 'Category B' },
              { value: 45, name: 'Category C' }
            ]"
            :radius="['0%', '70%']"
            :showLegend="true"
            legendPosition="right"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Scatter</span>
          </div>
          <ArtScatterChart
            :data="[
              { value: [1, 3] },
              { value: [2, 4] },
              { value: [3, 5] },
              { value: [4, 6] },
              { value: [5, 7] },
              { value: [6, 8] },
              { value: [7, 7] },
              { value: [8, 9] },
              { value: [9, 8] },
              { value: [10, 6] },
              { value: [11, 7] },
              { value: [12, 8] }
            ]"
          />
        </div>
      </ElCol>

      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Radar</span>
          </div>
          <ArtRadarChart
            :indicator="[
              { name: 'Sales', max: 100 },
              { name: 'Management', max: 100 },
              { name: 'Engineering', max: 100 },
              { name: 'Support', max: 100 },
              { name: 'Development', max: 100 }
            ]"
            :data="[
              {
                name: 'Budget',
                value: [80, 70, 90, 85, 75]
              },
              {
                name: 'Actual',
                value: [70, 75, 85, 80, 70]
              }
            ]"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>K-Line</span>
          </div>
          <ArtKLineChart
            :data="[
              { time: '2024-01-01', open: 20, close: 23, high: 25, low: 18 },
              { time: '2024-01-02', open: 23, close: 21, high: 24, low: 20 },
              { time: '2024-01-03', open: 21, close: 25, high: 26, low: 21 }
            ]"
            :showDataZoom="false"
            :dataZoomStart="0"
            :dataZoomEnd="100"
          />
        </div>
      </ElCol>
      <ElCol :xs="24" :md="12" :lg="8">
        <div class="card art-custom-card">
          <div class="card-header">
            <span>Bi-directional Stacked Bars</span>
          </div>
          <ArtDualBarCompareChart
            :positiveData="[50, 28, 80, 65, 68, 70, 60, 55]"
            :negativeData="[50, 28, 40, 45, 38, 50, 42, 48]"
            :xAxisData="[
              '0-4 yrs',
              '5-14 yrs',
              '15-24 yrs',
              '25-34 yrs',
              '35-44 yrs',
              '45-54 yrs',
              '55-64 yrs',
              '65+ yrs'
            ]"
            positiveName="Male Age Distribution"
            negativeName="Female Age Distribution"
          />
        </div>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import type { LineDataItem } from '@/types/component/chart'
  import { ref } from 'vue'

  // Multi-series line chart sample data
  const multiLineData: LineDataItem[] = [
    {
      name: 'Sales',
      data: [120, 132, 101, 134, 90, 130],
      areaStyle: {
        startOpacity: 0.1,
        endOpacity: 0
      }
    },
    {
      name: 'Profit',
      data: [80, 92, 71, 94, 60, 80],
      areaStyle: {
        startOpacity: 0.1,
        endOpacity: 0
      }
    }
  ]

  // Single-series sample
  const singleBarData = ref([120, 200, 150, 80, 70, 110, 130])
  const xAxisData = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

  // Multi-series sample
  const multiBarData = ref([
    {
      name: 'Sales',
      data: [120, 200, 150, 80, 70, 110, 130]
    },
    {
      name: 'Profit',
      data: [20, 50, 30, 15, 10, 25, 35]
    }
  ])

  // Stacked bar chart sample
  const stackBarData = ref([
    {
      name: 'Q1',
      data: [20, 25, 30, 35, 40],
      stack: 'total'
    },
    {
      name: 'Q2',
      data: [30, 35, 40, 45, 50],
      stack: 'total'
    }
  ])

  const stackXAxisData = ref(['Product A', 'Product B', 'Product C', 'Product D', 'Product E'])
</script>

<style lang="scss" scoped>
  .charts {
    padding-top: 20px;

    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .card {
      padding: 20px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        span {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
