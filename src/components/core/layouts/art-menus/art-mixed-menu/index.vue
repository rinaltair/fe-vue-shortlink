<!-- Mixed menu -->
<template>
  <div class="mixed-top-menu">
    <!-- Left scroll button -->
    <div v-show="showLeftArrow" class="scroll-btn left" @click="scroll('left')">
      <ElIcon>
        <ArrowLeft />
      </ElIcon>
    </div>

    <!-- Scroll container -->
    <ElScrollbar
      ref="scrollbarRef"
      wrap-class="scrollbar-wrapper"
      :horizontal="true"
      @scroll="handleScroll"
      @wheel="handleWheel"
    >
      <div class="scroll-bar">
        <template v-for="item in processedMenuList" :key="item.meta.title">
          <div
            v-if="!item.meta.isHide"
            class="item"
            :class="{ active: item.isActive }"
            @click="handleMenuJump(item, true)"
          >
            <i class="iconfont-sys" v-html="item.meta.icon" />
            <span>{{ item.formattedTitle }}</span>
            <div v-if="item.meta.showBadge" class="art-badge art-badge-mixed" />
          </div>
        </template>
      </div>
    </ElScrollbar>

    <!-- Right scroll button -->
    <div v-show="showRightArrow" class="scroll-btn right" @click="scroll('right')">
      <ElIcon>
        <ArrowRight />
      </ElIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { ElScrollbar, ElIcon } from 'element-plus'
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import { useThrottleFn } from '@vueuse/core'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { handleMenuJump } from '@/utils/navigation'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'ArtMixedMenu' })

  interface Props {
    /** Menu list data */
    list: AppRouteRecord[]
  }

  interface ProcessedMenuItem extends AppRouteRecord {
    isActive: boolean
    formattedTitle: string
  }

  type ScrollDirection = 'left' | 'right'

  const route = useRoute()

  const props = withDefaults(defineProps<Props>(), {
    list: () => []
  })

  const scrollbarRef = ref<any>()
  const showLeftArrow = ref(false)
  const showRightArrow = ref(false)

  /** Scroll configuration */
  const SCROLL_CONFIG = {
    /** Scroll distance when clicking arrows */
    BUTTON_SCROLL_DISTANCE: 200,
    /** Step for fast wheel scrolling */
    WHEEL_FAST_STEP: 35,
    /** Step for slow wheel scrolling */
    WHEEL_SLOW_STEP: 30,
    /** Threshold to distinguish fast vs slow scrolling */
    WHEEL_FAST_THRESHOLD: 100
  }

  /**
   * Get current active path
   * Cached with computed to avoid recalculation
   */
  const currentActivePath = computed(() => {
    return String(route.meta.activePath || route.path)
  })

  /**
   * Check if a menu item is active
   * Recursively checks children for current path
   * @param item Menu item
   * @returns Whether active
   */
  const isMenuItemActive = (item: AppRouteRecord): boolean => {
    const activePath = currentActivePath.value

    // If has children, recursively check
    if (item.children?.length) {
      return item.children.some((child) => {
        if (child.children?.length) {
          return isMenuItemActive(child)
        }
        return child.path === activePath
      })
    }

    // Directly compare path
    return item.path === activePath
  }

  /**
   * Preprocess menu list
   * Cache active state and formatted title per item
   */
  const processedMenuList = computed<ProcessedMenuItem[]>(() => {
    return props.list.map((item) => ({
      ...item,
      isActive: isMenuItemActive(item),
      formattedTitle: formatMenuTitle(item.meta.title)
    }))
  })

  /**
   * Core scroll handler
   * Show/hide arrow buttons based on position
   */
  const handleScrollCore = (): void => {
    if (!scrollbarRef.value?.wrapRef) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollbarRef.value.wrapRef

    // Determine whether to show left arrow
    showLeftArrow.value = scrollLeft > 0

    // Determine whether to show right arrow
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth
  }

  /**
   * Throttled scroll handler
   * Interval set to 16ms (~60fps)
   */
  const handleScroll = useThrottleFn(handleScrollCore, 16)

  /**
   * Scroll the menu container
   * @param direction Scroll direction: left | right
   */
  const scroll = (direction: ScrollDirection): void => {
    if (!scrollbarRef.value?.wrapRef) return

    const currentScroll = scrollbarRef.value.wrapRef.scrollLeft
    const targetScroll =
      direction === 'left'
        ? currentScroll - SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE
        : currentScroll + SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE

    // Smooth scroll to target
    scrollbarRef.value.wrapRef.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  /**
   * Handle mouse wheel event
   * Optimized for responsiveness
   * @param event Wheel event
   */
  const handleWheel = (event: WheelEvent): void => {
    // Prevent default and stop propagation to avoid page scroll
    event.preventDefault()
    event.stopPropagation()

    // Handle scroll immediately for responsiveness
    if (!scrollbarRef.value?.wrapRef) return

    const { wrapRef } = scrollbarRef.value
    const { scrollLeft, scrollWidth, clientWidth } = wrapRef

    // Use smaller step for smoother scroll
    const scrollStep =
      Math.abs(event.deltaY) > SCROLL_CONFIG.WHEEL_FAST_THRESHOLD
        ? SCROLL_CONFIG.WHEEL_FAST_STEP
        : SCROLL_CONFIG.WHEEL_SLOW_STEP
    const scrollDelta = event.deltaY > 0 ? scrollStep : -scrollStep
    const targetScroll = Math.max(0, Math.min(scrollLeft + scrollDelta, scrollWidth - clientWidth))

    // Immediate scroll, no animation
    wrapRef.scrollLeft = targetScroll

    // Update arrow button status
    handleScrollCore()
  }

  /**
   * Initialize scroll state
   */
  const initScrollState = (): void => {
    nextTick(() => {
      handleScrollCore()
    })
  }

  onMounted(initScrollState)
</script>

<style lang="scss" scoped>
  .mixed-top-menu {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;

    :deep(.el-scrollbar__bar.is-horizontal) {
      bottom: 5px;
      display: none;
      height: 2px;
    }

    :deep(.scrollbar-wrapper) {
      flex: 1;
      min-width: 0;
      margin: 0 50px 0 30px;
    }

    .scroll-bar {
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      flex-wrap: nowrap;
      align-items: center;
      height: 60px;
      white-space: nowrap;

      .item {
        position: relative;
        flex-shrink: 0; // Prevent menu items from being compressed
        height: 40px;
        padding: 0 12px;
        font-size: 14px;
        line-height: 40px;
        cursor: pointer;
        border-radius: 6px;

        i {
          margin-right: 5px;
          font-size: 15px;
        }

        &:hover {
          color: var(--main-color);
        }

        &.active {
          color: var(--main-color);
          background-color: var(--main-bg-color);

          &::after {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            margin: auto;
            content: '';
            background-color: var(--main-color);
          }
        }
      }
    }

    .scroll-btn {
      position: absolute;
      top: 50%;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      color: var(--art-text-gray-600);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      transform: translateY(-50%);

      &:hover {
        color: var(--art-text-gray-900);
        background-color: rgba(var(--art-gray-200-rgb), 0.8);
      }

      &.left {
        left: 3px;
      }

      &.right {
        right: 10px;
      }
    }
  }

  @media (max-width: $device-notebook) {
    .mixed-top-menu {
      :deep(.scrollbar-wrapper) {
        margin: 0 45px;
      }
    }
  }
</style>
