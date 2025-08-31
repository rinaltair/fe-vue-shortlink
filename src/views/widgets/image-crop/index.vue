<template>
  <div class="page-content">
    <ArtCutterImg
      v-model:imgUrl="imageUrl"
      :boxWidth="540"
      :boxHeight="300"
      :cutWidth="360"
      :cutHeight="200"
      :quality="1"
      :tool="true"
      :watermarkText="'My Watermark'"
      watermarkColor="#ff0000"
      :showPreview="true"
      :originalGraph="false"
      :title="'Image Crop'"
      :previewTitle="'Preview'"
      @error="handleError"
      @imageLoadComplete="handleLoadComplete"
      @imageLoadError="handleLoadError"
    />
  </div>
</template>

<script setup lang="ts">
  import lockImg from '@imgs/lock/lock_screen_1.webp'
  const imageUrl = ref(lockImg)

  const handleError = (error: any) => {
    console.error('Crop error:', error)
  }

  const handleLoadComplete = (result: any) => {
    console.log('Image loaded:', result)
  }

  const handleLoadError = (error: any) => {
    console.error('Image load failed:', error)
  }
</script>
