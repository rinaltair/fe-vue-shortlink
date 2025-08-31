<!-- Watermark component -->
<template>
  <div v-if="watermarkVisible" class="layout-watermark" :style="{ zIndex: zIndex }">
    <el-watermark
      :content="content"
      :font="{ fontSize: fontSize, color: fontColor }"
      :rotate="rotate"
      :gap="[gapX, gapY]"
      :offset="[offsetX, offsetY]"
    >
      <div style="height: 100vh"></div>
    </el-watermark>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'ArtWatermark' })

  const settingStore = useSettingStore()
  const { watermarkVisible } = storeToRefs(settingStore)

  interface WatermarkProps {
    /** watermark content */
    content?: string
    /** watermark visible */
    visible?: boolean
    /** watermark font size */
    fontSize?: number
    /** watermark color */
    fontColor?: string
    /** watermark rotation */
    rotate?: number
    /** watermark gap X */
    gapX?: number
    /** watermark gap Y */
    gapY?: number
    /** watermark offset X */
    offsetX?: number
    /** watermark offset Y */
    offsetY?: number
    /** watermark z-index */
    zIndex?: number
  }

  withDefaults(defineProps<WatermarkProps>(), {
    content: AppConfig.systemInfo.name,
    visible: false,
    fontSize: 16,
    fontColor: 'rgba(128, 128, 128, 0.2)',
    rotate: -22,
    gapX: 100,
    gapY: 100,
    offsetX: 50,
    offsetY: 50,
    zIndex: 3100
  })
</script>

<style lang="scss" scoped>
  .layout-watermark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
  }
</style>
