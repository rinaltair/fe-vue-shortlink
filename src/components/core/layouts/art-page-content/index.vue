<!-- Layout content -->
<template>
  <div
    class="layout-content abc"
    :class="{ 'no-basic-layout': isFullPage }"
    :style="containerStyle"
  >
    <!-- Festival text scroll -->
    <ArtFestivalTextScroll v-if="!isFullPage" />

    <RouterView v-if="isRefresh" v-slot="{ Component, route }" :style="contentStyle">
      <!-- Route info debug -->
      <div v-if="isOpenRouteInfo === 'true'" class="route-info">
        router meta：{{ route.meta }}
      </div>

      <!-- Cached route transition -->
      <Transition :name="showTransitionMask ? '' : actualTransition" mode="out-in" appear>
        <KeepAlive :max="10" :exclude="keepAliveExclude">
          <component
            class="art-page-view"
            :is="Component"
            :key="route.path"
            v-if="route.meta.keepAlive"
          />
        </KeepAlive>
      </Transition>

      <!-- Non-cached route transition -->
      <Transition :name="showTransitionMask ? '' : actualTransition" mode="out-in" appear>
        <component
          class="art-page-view"
          :is="Component"
          :key="route.path"
          v-if="!route.meta.keepAlive"
        />
      </Transition>
    </RouterView>

    <!-- Fullscreen page transition overlay (improves UX) -->
    <Teleport to="body">
      <div v-show="showTransitionMask" class="full-page-mask" />
    </Teleport>
  </div>
</template>
<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useRoute } from 'vue-router'
  import { useCommon } from '@/composables/useCommon'
  import { useSettingStore } from '@/store/modules/setting'
  import { useWorktabStore } from '@/store/modules/worktab'

  defineOptions({ name: 'ArtPageContent' })

  const route = useRoute()
  const { containerMinHeight } = useCommon()
  const { pageTransition, containerWidth, refresh } = storeToRefs(useSettingStore())
  const { keepAliveExclude } = storeToRefs(useWorktabStore())

  const isRefresh = shallowRef(true)
  const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO
  const showTransitionMask = ref(false)

  // Check if current route needs raw layout
  const isFullPage = computed(() => route.matched.some((r) => r.meta?.isFullPage))
  const prevIsFullPage = ref(isFullPage.value)

  // Choose transition name: avoid animation when returning from fullscreen
  const actualTransition = computed(() =>
    prevIsFullPage.value && !isFullPage.value ? '' : pageTransition.value
  )

  // Watch fullscreen state and show overlay
  watch(isFullPage, (val, oldVal) => {
    if (val !== oldVal) {
      showTransitionMask.value = true
      // Delay hiding overlay to allow page transition
      setTimeout(() => {
        showTransitionMask.value = false
      }, 50)
    }

    nextTick(() => {
      prevIsFullPage.value = val
    })
  })

  const containerStyle = computed(
    (): CSSProperties =>
      isFullPage.value
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 2500,
            background: 'var(--art-bg-color)'
          }
        : {
            maxWidth: containerWidth.value
          }
  )

  const contentStyle = computed(
    (): CSSProperties => ({
      minHeight: containerMinHeight.value
    })
  )

  const reload = () => {
    isRefresh.value = false
    nextTick(() => {
      isRefresh.value = true
    })
  }

  watch(refresh, reload, { flush: 'post' })
</script>

<style lang="scss" scoped>
  .layout-content {
    &.no-basic-layout {
      overflow: auto;
    }
  }

  .route-info {
    padding: 6px 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: var(--art-gray-600);
    background: var(--art-gray-200);
    border: 1px solid var(--art-border-dashed-color);
    border-radius: 6px;
  }

  .full-page-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    background-color: var(--art-main-bg-color);
  }
</style>
