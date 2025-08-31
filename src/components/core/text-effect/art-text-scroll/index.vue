<!-- Text scroll component: supports 5 styles, two directions, and custom HTML content -->
<template>
  <div ref="containerRef" class="text-scroll-container" :class="[`text-scroll--${props.type}`]">
    <div class="left-icon">
      <i class="iconfont-sys">&#xe64a;</i>
    </div>
    <div class="scroll-wrapper">
      <div
        class="text-scroll-content"
        :class="{ scrolling: shouldScroll }"
        :style="scrollStyle"
        ref="scrollContent"
      >
        <div class="scroll-item" v-html="sanitizedContent"></div>
        <div class="scroll-item" v-html="sanitizedContent"></div>
      </div>
    </div>
    <div class="right-icon" @click="handleRightIconClick" v-if="showClose">
      <i class="iconfont-sys">&#xe83a;</i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useElementHover } from '@vueuse/core'

  defineOptions({ name: 'ArtTextScroll' })

  const emit = defineEmits(['close'])

  interface Props {
    /** text */
    text: string
    /** scroll speed */
    speed?: number
    /** scroll direction (left/right) */
    direction?: 'left' | 'right'
    /** type (default/success/warning/danger/info) */
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    /** show close button */
    showClose?: boolean
    /** enable typewriter effect */
    typewriter?: boolean
    /** typewriter speed */
    typewriterSpeed?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    speed: 70,
    direction: 'left',
    type: 'default',
    showClose: false,
    typewriter: false,
    typewriterSpeed: 100
  })

  // State
  const containerRef = ref<HTMLElement | null>(null)
  const isHovered = useElementHover(containerRef)
  const scrollContent = ref<HTMLElement | null>(null)
  const animationDuration = ref(0)

  // Typewriter reactive state
  const currentText = ref('')
  let typewriterTimer: ReturnType<typeof setTimeout> | null = null

  // Typewriter completion state
  const isTypewriterComplete = ref(false)

  // Scroll state
  const shouldScroll = computed(() => {
    if (props.typewriter) {
      return !isHovered.value && isTypewriterComplete.value
    }
    return !isHovered.value
  })

  // Sanitized content
  const sanitizedContent = computed(() => (props.typewriter ? currentText.value : props.text))

  // Scroll CSS variables
  const scrollStyle = computed(() => ({
    '--animation-duration': `${animationDuration.value}s`,
    '--animation-play-state': shouldScroll.value ? 'running' : 'paused',
    '--animation-direction': props.direction === 'left' ? 'normal' : 'reverse'
  }))

  // Compute animation duration
  const calculateDuration = () => {
    if (scrollContent.value) {
      const contentWidth = scrollContent.value.scrollWidth / 2
      animationDuration.value = contentWidth / props.speed
    }
  }

  // Handle right icon click
  const handleRightIconClick = () => {
    emit('close')
  }

  // Typewriter implementation
  const startTypewriter = () => {
    let index = 0
    currentText.value = ''
    isTypewriterComplete.value = false // reset state

    const type = () => {
      if (index < props.text.length) {
        currentText.value += props.text[index]
        index++
        typewriterTimer = setTimeout(type, props.typewriterSpeed)
      } else {
        isTypewriterComplete.value = true // set when typing completes
      }
    }

    type()
  }

  // Lifecycle hooks
  onMounted(() => {
    calculateDuration()
    window.addEventListener('resize', calculateDuration)

    if (props.typewriter) {
      startTypewriter()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateDuration)
    if (typewriterTimer) {
      clearTimeout(typewriterTimer)
    }
  })

  // Watch text changes to restart typewriter
  watch(
    () => props.text,
    () => {
      if (props.typewriter) {
        if (typewriterTimer) {
          clearTimeout(typewriterTimer)
        }
        startTypewriter()
      }
    }
  )
</script>

<style scoped lang="scss">
  $text-scroll-height: 34px;
  $icon-width: 40px;
  $border-radius: calc(var(--custom-radius) / 2 + 2px);
  $types: (
    default: primary,
    success: success,
    warning: warning,
    danger: danger,
    info: info
  );

  // Base container styles
  .text-scroll-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 16px;
    overflow: hidden;
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--main-color);
    border-radius: $border-radius;

    // Shared styles for left/right icons
    .left-icon,
    .right-icon {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 2;
      width: $icon-width;
      height: $text-scroll-height;
      line-height: $text-scroll-height;
      text-align: center;
      background-color: var(--el-color-primary-light-9);

      i {
        color: var(--main-color);
      }
    }

    .left-icon {
      left: 0;
    }

    .right-icon {
      right: 0;
      cursor: pointer;
      background-color: transparent;
    }

    // Scroll wrapper
    .scroll-wrapper {
      flex: 1;
      margin-left: $text-scroll-height;
      overflow: hidden;
    }

    // Scroll content
    .text-scroll-content {
      display: flex;
      height: $text-scroll-height;
      line-height: $text-scroll-height;
      white-space: nowrap;
      animation: scroll linear infinite;
      animation-duration: var(--animation-duration);
      animation-play-state: var(--animation-play-state);
      animation-direction: var(--animation-direction);

      .scroll-item {
        display: inline-block;
        min-width: 100%;
        padding: 0 10px;
        font-size: 14px;
        color: var(--el-color-primary-light-2);
        text-align: center;

        :deep(a) {
          color: #fd4e4e;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        // Typewriter caret effect
        &::after {
          content: '|';
          opacity: 0;
          animation: cursor 1s infinite;
        }
      }
    }

    // Generate type styles dynamically
    @each $type, $color in $types {
      &.text-scroll--#{$type} {
        background-color: var(--el-color-#{$color}-light-9);
        border-color: var(--el-color-#{$color});

        .left-icon,
        .right-icon {
          background-color: var(--el-color-#{$color}-light-9);

          i {
            color: var(--el-color-#{$color});
          }
        }

        .scroll-item {
          color: var(--el-color-#{$color});
        }
      }
    }
  }

  // Scroll animation
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  // Caret animation
  @keyframes cursor {
    0%,
    100% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
  }
</style>
