<template>
  <!-- Layout container -->
  <ArtLayouts>
    <!-- Top bar, horizontal/mixed menu -->
    <ArtHeaderBar />
    <!-- Left-side / two-column menu -->
    <ArtSidebarMenu />
    <!-- Page content -->
    <ArtPageContent />
    <!-- Settings panel -->
    <ArtSettingsPanel />
    <!-- Global search -->
    <ArtGlobalSearch />
    <!-- Screen lock -->
    <ArtScreenLock />
    <!-- Chat window -->
    <ArtChatWindow />
    <!-- Fireworks effect -->
    <ArtFireworksEffect />
    <!-- Watermark effect -->
    <ArtWatermark />
  </ArtLayouts>
</template>

<script setup lang="ts">
  defineOptions({ name: 'IndexLayout' })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
