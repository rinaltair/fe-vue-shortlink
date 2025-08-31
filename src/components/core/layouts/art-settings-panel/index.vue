<!-- Settings Panel -->
<template>
  <div class="layout-settings">
    <SettingDrawer v-model="showDrawer" @open="handleOpen" @close="handleClose">
      <!-- Header close button -->
      <SettingHeader @close="closeDrawer" />
      <!-- Theme style -->
      <ThemeSettings />
      <!-- Menu layout -->
      <MenuLayoutSettings />
      <!-- Menu style -->
      <MenuStyleSettings />
      <!-- Theme color -->
      <ColorSettings />
      <!-- Box style -->
      <BoxStyleSettings />
      <!-- Container width -->
      <ContainerSettings />
      <!-- Basic settings -->
      <BasicSettings />
    </SettingDrawer>
  </div>
</template>

<script setup lang="ts">
  import { useSettingsPanel } from './composables/useSettingsPanel'

  import SettingDrawer from './widget/SettingDrawer.vue'
  import SettingHeader from './widget/SettingHeader.vue'
  import ThemeSettings from './widget/ThemeSettings.vue'
  import MenuLayoutSettings from './widget/MenuLayoutSettings.vue'
  import MenuStyleSettings from './widget/MenuStyleSettings.vue'
  import ColorSettings from './widget/ColorSettings.vue'
  import BoxStyleSettings from './widget/BoxStyleSettings.vue'
  import ContainerSettings from './widget/ContainerSettings.vue'
  import BasicSettings from './widget/BasicSettings.vue'

  defineOptions({ name: 'ArtSettingsPanel' })

  interface Props {
    /** Whether to open */
    open?: boolean
  }

  const props = defineProps<Props>()

  // Use settings panel logic
  const settingsPanel = useSettingsPanel()
  const { showDrawer } = settingsPanel

  // Get various handlers
  const { handleWindowResize } = settingsPanel.useResponsiveLayout()
  const { handleOpen, handleClose, closeDrawer } = settingsPanel.useDrawerControl()
  const { initializeSettings, cleanupSettings } = settingsPanel.useSettingsInitializer()

  // Watch props changes
  settingsPanel.usePropsWatcher(props)

  onMounted(() => {
    initializeSettings()
    handleWindowResize()
  })

  onUnmounted(() => {
    cleanupSettings()
  })
</script>

<style lang="scss">
  @use './style';
</style>
