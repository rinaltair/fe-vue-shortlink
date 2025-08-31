<template>
  <div class="custom-card art-custom-card volume-service-level">
    <div class="custom-card-header">
      <span class="title">Volume and Service Level</span>
    </div>
    <div class="custom-card-body">
      <ArtBarChart
        height="14.3rem"
        :data="volumeServiceData"
        :xAxisData="serviceCategories"
        :showLegend="true"
        :showAxisLine="false"
        :stack="true"
        barWidth="22%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Service categories
  const serviceCategories = ref(['Product A', 'Product B', 'Product C', 'Product D', 'Product E'])

  // Volume data
  const volumeServiceData = ref([
    {
      name: 'Volume',
      data: [20, 25, 30, 35, 40],
      stack: 'total'
      // color: '#0095FF'
    },
    {
      name: 'Service',
      data: [30, 35, 40, 45, 50],
      stack: 'total'
      // color: '#95E0FB'
    }
  ])
</script>

<style lang="scss" scoped>
  .volume-service-level {
    height: 330px;

    .custom-card-body {
      padding: 20px;
    }
  }
</style>
