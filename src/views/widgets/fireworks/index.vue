<template>
  <div class="page-content">
    <div class="action-buttons">
      <ElButton :disabled="isLaunching" v-ripple @click="handleSingleLaunch"
        >✨ Launch a Sparkler</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(bp)"
        >🎉 Open Lucky Red Packet</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch('')"
        >🎆 Brilliant Fireworks Show</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(sd)"
        >❄️ Falling Snowflakes</ElButton
      >
      <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch(sd)"
        >❄️ Romantic Blizzard</ElButton
      >
    </div>

    <ElDescriptions
      title="Fireworks Component Notes"
      direction="vertical"
      :column="1"
      border
      style="margin-top: 50px"
    >
      <ElDescriptionsItem label="When it shows">
        The fireworks component is globally registered and controlled via configuration. The default
        date in config has passed and will not trigger again during your use.
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Styles">
        By default it shows geometry shapes. You can configure images, but they need to be
        predefined in src/components/core/layouts/art-fireworks-effect/index.vue
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Configuration">
        Configure festivals and styles in src/config/festival.ts
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Shortcuts">
        command + shift + p or ctrl + shift + p
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script setup lang="ts">
  import { mittBus } from '@/utils/sys'

  import bp from '@imgs/ceremony/hb.png'
  import sd from '@imgs/ceremony/sd.png'

  const timerRef = ref<ReturnType<typeof setInterval> | null>(null)
  const isLaunching = ref(false)

  const triggerFireworks = (count: number, src: string) => {
    // Clear previous timer
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }

    isLaunching.value = true // Set state when starting launch

    let fired = 0
    timerRef.value = setInterval(() => {
      mittBus.emit('triggerFireworks', src)
      fired++

      // Clear timer after reaching the count
      if (fired >= count) {
        clearInterval(timerRef.value!)
        timerRef.value = null
        isLaunching.value = false // Re-enable after launch completes
      }
    }, 1000)
  }

  // Simplified handlers
  const handleSingleLaunch = () => {
    mittBus.emit('triggerFireworks')
  }

  const handleMultipleLaunch = (src: string) => {
    triggerFireworks(10, src)
  }

  const handleImageLaunch = (src: string) => {
    mittBus.emit('triggerFireworks', src)
  }

  // Cleanup timer on unmount
  onUnmounted(() => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  })
</script>

<style lang="scss" scoped>
  .action-buttons {
    margin-bottom: 20px;
  }
</style>
