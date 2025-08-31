<template>
  <div class="page-content">
    <ElRow :gutter="20">
      <ElCol :span="6" v-for="preset in qrcodePresets" :key="preset.title">
        <ElCard class="qrcode-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ preset.title }}</span>
            </div>
          </template>

          <div class="qrcode-preview">
            <QrcodeVue :value="qrValue" v-bind="preset.config" />
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue'
  import { ref, reactive, watch } from 'vue'
  import type { Level, RenderAs, ImageSettings } from 'qrcode.vue'

  // QR content
  const qrValue = ref('https://www.lingchen.kim')
  const isShowLogo = ref(false)

  // Preset QR styles
  const qrcodePresets = [
    {
      title: 'Render as SVG',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'svg' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000'
      }
    },
    {
      title: 'Render as Canvas',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000'
      }
    },
    {
      title: 'Custom Colors',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#f0f0f0',
        foreground: '#4080ff'
      }
    },
    {
      title: 'With Logo',
      config: {
        size: 160,
        level: 'H' as Level,
        renderAs: 'canvas' as RenderAs,
        margin: 0,
        background: '#ffffff',
        foreground: '#000000',
        imageSettings: {
          src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
          width: 40,
          height: 40,
          excavate: true
        }
      }
    }
  ]

  // QR config
  const qrcodeConfig = reactive({
    size: 160,
    level: 'H' as Level,
    renderAs: 'canvas' as RenderAs,
    margin: 0,
    background: '#ffffff',
    foreground: '#000000',
    imageSettings: {
      src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
      width: 40,
      height: 40,
      excavate: true
    } as ImageSettings
  })

  // Watch logo visibility
  watch(isShowLogo, (val) => {
    if (!val) {
      qrcodeConfig.imageSettings = {} as ImageSettings
    } else {
      qrcodeConfig.imageSettings = {
        src: 'https://www.lingchen.kim/art-design-pro/assets/avatar-DJIoI-3F.png',
        width: 40,
        height: 40,
        excavate: true
      }
    }
  })
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;

    .qrcode-card {
      margin-bottom: 20px;

      .card-header {
        font-size: 16px;
        font-weight: bold;
      }

      .qrcode-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 4px;
      }
    }
  }
</style>
