<!-- Image cropper component github: https://github.com/acccccccb/vue-img-cutter/tree/master -->
<template>
  <div class="cutter-container">
    <div class="cutter-component">
      <div class="title">{{ title }}</div>
      <ImgCutter
        ref="imgCutterModal"
        @cutDown="cutDownImg"
        @onPrintImg="cutterPrintImg"
        @onImageLoadComplete="handleImageLoadComplete"
        @onImageLoadError="handleImageLoadError"
        @onClearAll="handleClearAll"
        v-bind="cutterProps"
        class="img-cutter"
      >
        <template #choose>
          <el-button type="primary" plain v-ripple>Select Image</el-button>
        </template>
        <template #cancel>
          <el-button type="danger" plain v-ripple>Clear</el-button>
        </template>
        <template #confirm>
          <!-- <el-button type="primary" style="margin-left: 10px">Confirm</el-button> -->
          <div></div>
        </template>
      </ImgCutter>
    </div>

    <div v-if="showPreview" class="preview-container">
      <div class="title">{{ previewTitle }}</div>
      <div
        class="preview-box"
        :style="{
          width: `${cutterProps.cutWidth}px`,
          height: `${cutterProps.cutHeight}px`
        }"
      >
        <img class="preview-img" :src="temImgPath" alt="Preview" v-if="temImgPath" />
      </div>
      <el-button class="download-btn" @click="downloadImg" :disabled="!temImgPath" v-ripple
        >Download Image</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import ImgCutter from 'vue-img-cutter'

  defineOptions({ name: 'ArtCutterImg' })

  interface CutterProps {
    // Basic configuration
    /** Modal mode */
    isModal?: boolean
    /** Show toolbar */
    tool?: boolean
    /** Toolbar background color */
    toolBgc?: string
    /** Title */
    title?: string
    /** Preview title */
    previewTitle?: string
    /** Show preview */
    showPreview?: boolean

    // Size configuration
    /** Container width */
    boxWidth?: number
    /** Container height */
    boxHeight?: number
    /** Crop width */
    cutWidth?: number
    /** Crop height */
    cutHeight?: number
    /** Allow resizing */
    sizeChange?: boolean

    // Move and zoom configuration
    /** Allow moving */
    moveAble?: boolean
    /** Allow image moving */
    imgMove?: boolean
    /** Allow scaling */
    scaleAble?: boolean

    // Image configuration
    /** Show original image */
    originalGraph?: boolean
    /** Allow cross-origin */
    crossOrigin?: boolean
    /** File type */
    fileType?: 'png' | 'jpeg' | 'webp'
    /** Quality */
    quality?: number

    // Watermark configuration
    /** Watermark text */
    watermarkText?: string
    /** Watermark font size */
    watermarkFontSize?: number
    /** Watermark color */
    watermarkColor?: string

    // Other features
    /** Save crop position */
    saveCutPosition?: boolean
    /** Preview mode */
    previewMode?: boolean

    // Input image
    imgUrl?: string
  }

  interface CutterResult {
    fileName: string
    file: File
    blob: Blob
    dataURL: string
  }

  const props = withDefaults(defineProps<CutterProps>(), {
    // Default basic configuration
    isModal: false,
    tool: true,
    toolBgc: '#fff',
    title: '',
    previewTitle: '',
    showPreview: true,

    // Default size configuration
    boxWidth: 700,
    boxHeight: 458,
    cutWidth: 470,
    cutHeight: 270,
    sizeChange: true,

    // Default move and zoom configuration
    moveAble: true,
    imgMove: true,
    scaleAble: true,

    // Default image configuration
    originalGraph: true,
    crossOrigin: true,
    fileType: 'png',
    quality: 0.9,

    // Default watermark configuration
    watermarkText: '',
    watermarkFontSize: 20,
    watermarkColor: '#ffffff',

    // Default other features
    saveCutPosition: true,
    previewMode: true
  })

  const emit = defineEmits(['update:imgUrl', 'error', 'imageLoadComplete', 'imageLoadError'])

  const temImgPath = ref('')
  const imgCutterModal = ref()

  // Computed: aggregate ImgCutter props
  const cutterProps = computed(() => ({
    ...props,
    WatermarkText: props.watermarkText,
    WatermarkFontSize: props.watermarkFontSize,
    WatermarkColor: props.watermarkColor
  }))

  // Image preloading
  function preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
  }

  // Initialize cutter
  async function initImgCutter() {
    if (props.imgUrl) {
      try {
        await preloadImage(props.imgUrl)
        imgCutterModal.value?.handleOpen({
          name: 'Cover Image',
          src: props.imgUrl
        })
      } catch (error) {
        emit('error', error)
        console.error('Image load failed:', error)
      }
    }
  }

  // Lifecycle
  onMounted(() => {
    if (props.imgUrl) {
      temImgPath.value = props.imgUrl
      initImgCutter()
    }
  })

  // Watch image URL changes
  watch(
    () => props.imgUrl,
    (newVal) => {
      if (newVal) {
        temImgPath.value = newVal
        initImgCutter()
      }
    }
  )

  // Live preview
  function cutterPrintImg(result: { dataURL: string }) {
    temImgPath.value = result.dataURL
  }

  // Crop complete
  function cutDownImg(result: CutterResult) {
    emit('update:imgUrl', result.dataURL)
  }

  // Image load complete
  function handleImageLoadComplete(result: any) {
    emit('imageLoadComplete', result)
  }

  // Image load failed
  function handleImageLoadError(error: any) {
    emit('error', error)
    emit('imageLoadError', error)
  }

  // Clear all
  function handleClearAll() {
    temImgPath.value = ''
  }

  // Download image
  function downloadImg() {
    console.log('Download image')
    const a = document.createElement('a')
    a.href = temImgPath.value
    a.download = 'image.png'
    a.click()
  }
</script>

<style lang="scss" scoped>
  .cutter-container {
    display: flex;
    flex-flow: row wrap;

    .title {
      padding-bottom: 10px;
      font-size: 18px;
      font-weight: 500;
    }

    .cutter-component {
      margin-right: 30px;
    }

    .preview-container {
      .preview-box {
        background-color: #f6f6f6 !important;

        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .download-btn {
        display: block;
        margin: 20px auto;
      }
    }

    :deep(.toolBoxControl) {
      z-index: 100;
    }

    :deep(.dockMain) {
      right: 0;
      bottom: -40px;
      left: 0;
      z-index: 10;
      padding: 0;
      background-color: transparent !important;
      opacity: 1;
    }

    :deep(.copyright) {
      display: none !important;
    }

    :deep(.i-dialog-footer) {
      margin-top: 60px !important;
    }

    :deep(.dockBtn) {
      height: 26px;
      padding: 0 10px;
      font-size: 12px;
      line-height: 26px;
      color: var(--el-color-primary) !important;
      background-color: var(--el-color-primary-light-9) !important;
      border: 1px solid var(--el-color-primary-light-4) !important;
    }

    :deep(.dockBtnScrollBar) {
      margin: 0 10px 0 6px;
      background-color: var(--el-color-primary-light-1);
    }

    :deep(.scrollBarControl) {
      border-color: var(--el-color-primary);
    }

    :deep(.closeIcon) {
      line-height: 15px !important;
    }
  }

  .dark {
    .cutter-container {
      :deep(.toolBox) {
        border: transparent;
      }

      :deep(.dialogMain) {
        background-color: transparent !important;
      }

      :deep(.i-dialog-footer) {
        .btn {
          background-color: var(--el-color-primary) !important;
          border: transparent;
        }
      }
    }
  }
</style>
