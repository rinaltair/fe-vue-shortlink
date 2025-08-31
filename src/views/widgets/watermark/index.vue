<template>
  <div class="page-content">
    <!-- Basic Text Watermark -->
    <ElCard class="card" shadow="never">
      <template #header>Basic Text Watermark</template>
      <ElWatermark content="Art Design Pro" :font="{ color: 'rgba(128, 128, 128, 0.2)' }">
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    <!-- Multi-line Text Watermark -->
    <ElCard class="card" shadow="never">
      <template #header>Multi-line Text Watermark</template>
      <ElWatermark
        :content="['Art Design Pro', 'Focus on UX, Visual Design']"
        :font="{ fontSize: 16, color: 'rgba(128, 128, 128, 0.2)' }"
      >
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    <!-- Image Watermark -->
    <ElCard class="card" shadow="never">
      <template #header>Image Watermark</template>
      <ElWatermark :image="watermarkImage" :opacity="0.2" :width="80" :height="20">
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    <!-- Custom Style Watermark -->
    <ElCard class="card" shadow="never">
      <template #header>Custom Style Watermark</template>
      <ElWatermark
        content="Art Design Pro"
        :font="{
          fontSize: 20,
          fontFamily: 'Arial',
          color: 'rgba(255, 0, 0, 0.3)'
        }"
        :rotate="-22"
        :gap="[100, 100]"
      >
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    <ElButton
      :type="settingStore.watermarkVisible ? 'danger' : 'primary'"
      @click="handleWatermarkVisible"
    >
      {{ settingStore.watermarkVisible ? 'Hide Global Watermark' : 'Show Global Watermark' }}
    </ElButton>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'

  const settingStore = useSettingStore()

  // Replace with your actual logo image URL
  const watermarkImage = ref('https://element-plus.org/images/element-plus-logo.svg')

  const handleWatermarkVisible = () => {
    useSettingStore().setWatermarkVisible(!settingStore.watermarkVisible)
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;

    .el-card {
      margin-bottom: 30px;
    }
  }
</style>
