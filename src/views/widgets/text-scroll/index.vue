<template>
  <div class="page-content">
    <!-- Basic Usage -->
    <ArtTextScroll
      text="Art Design Pro is an admin template focused on UX and visual design. <a target='_blank' href='https://www.lingchen.kim/art-design-pro/docs/'>Click me</a> to visit the docs"
      showClose
    />

    <!-- Different Types -->
    <ArtTextScroll type="success" text="This is a success-type scrolling announcement" showClose />

    <ArtTextScroll type="warning" text="This is a warning-type scrolling announcement" showClose />

    <ArtTextScroll type="danger" text="This is a danger-type scrolling announcement" showClose />

    <ArtTextScroll type="info" text="This is an info-type scrolling announcement" showClose />

    <!-- Dismissible -->
    <ArtTextScroll
      text="This is a dismissible scrolling announcement"
      showClose
      @close="handleClose"
    />

    <!-- Typewriter Effect -->
    <ArtTextScroll
      text="This is a scrolling announcement with typewriter effect (200 ms)"
      typewriter
      :typewriter-speed="200"
    />

    <!-- Custom Speed and Direction -->
    <ArtTextScroll
      text="This announcement scrolls slowly to the right"
      :speed="30"
      direction="right"
    />
  </div>
</template>

<script setup lang="ts">
  const handleClose = () => {
    console.log('Closed')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    :deep(.text-scroll-container) {
      margin-bottom: 20px;
    }
  }
</style>
