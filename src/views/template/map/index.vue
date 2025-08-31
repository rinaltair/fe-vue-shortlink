<template>
  <div class="page-content" element-loading-text="Loading...">
    <ArtMapChart />
  </div>
</template>

<script setup lang="ts">
  const ArtMapChart = defineAsyncComponent(
    () => import('@/components/core/charts/art-map-chart/index.vue')
  )
</script>

<style lang="scss" scoped>
  .page-content {
    height: 100%;
  }
</style>
