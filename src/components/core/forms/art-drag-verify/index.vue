<!-- Drag-to-verify component -->
<template>
  <div
    ref="dragVerify"
    class="drag_verify"
    :style="dragVerifyStyle"
    @mousemove="dragMoving"
    @mouseup="dragFinish"
    @mouseleave="dragFinish"
    @touchmove="dragMoving"
    @touchend="dragFinish"
  >
    <!-- Progress bar -->
    <div
      class="dv_progress_bar"
      :class="{ goFirst2: isOk }"
      ref="progressBar"
      :style="progressBarStyle"
    >
    </div>

    <!-- Hint text -->
    <div class="dv_text" :style="textStyle" ref="messageRef">
      <slot name="textBefore" v-if="$slots.textBefore"></slot>
      {{ message }}
      <slot name="textAfter" v-if="$slots.textAfter"></slot>
    </div>

    <!-- Slider handler -->
    <div
      class="dv_handler dv_handler_bg"
      :class="{ goFirst: isOk }"
      @mousedown="dragStart"
      @touchstart="dragStart"
      ref="handler"
      :style="handlerStyle"
    >
      <i class="iconfont-sys" v-html="value ? successIcon : handlerIcon"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtDragVerify' })

  // Event definitions
  const emit = defineEmits(['handlerMove', 'update:value', 'passCallback'])

  // Component props interface
  interface PropsType {
    /** Whether passed */
    value: boolean
    /** Component width */
    width?: number | string
    /** Component height */
    height?: number
    /** Default hint text */
    text?: string
    /** Success text */
    successText?: string
    /** Background color */
    background?: string
    /** Progress bar background */
    progressBarBg?: string
    /** Completed state background */
    completedBg?: string
    /** Rounded */
    circle?: boolean
    /** Border radius */
    radius?: string
    /** Slider icon */
    handlerIcon?: string
    /** Success icon */
    successIcon?: string
    /** Slider background */
    handlerBg?: string
    /** Text size */
    textSize?: string
    /** Text color */
    textColor?: string
  }

  // Default props
  const props = withDefaults(defineProps<PropsType>(), {
    value: false,
    width: '100%',
    height: 40,
    text: 'Hold and drag the slider',
    successText: 'success',
    background: '#eee',
    progressBarBg: '#1385FF',
    completedBg: '#57D187',
    circle: false,
    radius: 'calc(var(--custom-radius) / 3 + 2px)',
    handlerIcon: '&#xea50;',
    successIcon: '&#xe621;',
    handlerBg: '#fff',
    textSize: '13px',
    textColor: '#333'
  })

  // Component state interface
  interface StateType {
    isMoving: boolean // Whether dragging
    x: number // Drag start position
    isOk: boolean // Whether verification succeeded
  }

  // Reactive state
  const state = reactive(<StateType>{
    isMoving: false,
    x: 0,
    isOk: false
  })

  // Destructure reactive state
  const { isOk } = toRefs(state)

  // DOM element refs
  const dragVerify = ref()
  const messageRef = ref()
  const handler = ref()
  const progressBar = ref()

  // Touch variables - used to prevent page scroll
  let startX: number, startY: number, moveX: number, moveY: number

  /**
   * Touch start handler
   * @param e Touch event
   */
  const onTouchStart = (e: any) => {
    startX = e.targetTouches[0].pageX
    startY = e.targetTouches[0].pageY
  }

  /**
   * Touch move handler - detect horizontal slide and prevent default (page scroll)
   * @param e Touch event
   */
  const onTouchMove = (e: any) => {
    moveX = e.targetTouches[0].pageX
    moveY = e.targetTouches[0].pageY

    // If horizontal distance > vertical, prevent default to stop page scrolling
    if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
      e.preventDefault()
    }
  }

  // Global listeners
  document.addEventListener('touchstart', onTouchStart)
  document.addEventListener('touchmove', onTouchMove, { passive: false })

  // Get numeric width
  const getNumericWidth = (): number => {
    if (typeof props.width === 'string') {
      // If string, try to get actual width from DOM element
      return dragVerify.value?.offsetWidth || 260
    }
    return props.width
  }

  // Get width as style string
  const getStyleWidth = (): string => {
    if (typeof props.width === 'string') {
      return props.width
    }
    return props.width + 'px'
  }

  // Init after mount
  onMounted(() => {
    // Set CSS custom properties
    dragVerify.value?.style.setProperty('--textColor', props.textColor)

    // After DOM update, set width-related properties
    nextTick(() => {
      const numericWidth = getNumericWidth()
      dragVerify.value?.style.setProperty('--width', Math.floor(numericWidth / 2) + 'px')
      dragVerify.value?.style.setProperty('--pwidth', -Math.floor(numericWidth / 2) + 'px')
    })

    // Re-add listeners (ensure binding)
    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
  })

  // Cleanup before unmount
  onBeforeUnmount(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
  })

  // Slider style
  const handlerStyle = {
    left: '0',
    width: props.height + 'px',
    height: props.height + 'px',
    background: props.handlerBg
  }

  // Root container style
  const dragVerifyStyle = computed(() => ({
    width: getStyleWidth(),
    height: props.height + 'px',
    lineHeight: props.height + 'px',
    background: props.background,
    borderRadius: props.circle ? props.height / 2 + 'px' : props.radius
  }))

  // Progress bar style
  const progressBarStyle = {
    background: props.progressBarBg,
    height: props.height + 'px',
    borderRadius: props.circle
      ? props.height / 2 + 'px 0 0 ' + props.height / 2 + 'px'
      : props.radius
  }

  // Text style
  const textStyle = computed(() => ({
    fontSize: props.textSize
  }))

  // Display message
  const message = computed(() => {
    return props.value ? props.successText : props.text
  })

  /**
   * Drag start handler
   * @param e Mouse or touch event
   */
  const dragStart = (e: any) => {
    if (!props.value) {
      state.isMoving = true
      handler.value.style.transition = 'none'
      // Calculate drag start position
      state.x =
        (e.pageX || e.touches[0].pageX) - parseInt(handler.value.style.left.replace('px', ''), 10)
    }
    emit('handlerMove')
  }

  /**
   * Drag move handler
   * @param e Mouse or touch event
   */
  const dragMoving = (e: any) => {
    if (state.isMoving && !props.value) {
      const numericWidth = getNumericWidth()
      // Calculate current position
      let _x = (e.pageX || e.touches[0].pageX) - state.x

      // Move within valid range
      if (_x > 0 && _x <= numericWidth - props.height) {
        handler.value.style.left = _x + 'px'
        progressBar.value.style.width = _x + props.height / 2 + 'px'
      } else if (_x > numericWidth - props.height) {
        // Reached the end, mark success
        handler.value.style.left = numericWidth - props.height + 'px'
        progressBar.value.style.width = numericWidth - props.height / 2 + 'px'
        passVerify()
      }
    }
  }

  /**
   * Drag finish handler
   * @param e Mouse or touch event
   */
  const dragFinish = (e: any) => {
    if (state.isMoving && !props.value) {
      const numericWidth = getNumericWidth()
      // Calculate final position
      let _x = (e.pageX || e.changedTouches[0].pageX) - state.x

      if (_x < numericWidth - props.height) {
        // Not dragged to end, reset
        state.isOk = true
        handler.value.style.left = '0'
        handler.value.style.transition = 'all 0.2s'
        progressBar.value.style.width = '0'
        state.isOk = false
      } else {
        // Dragged to end, keep success state
        handler.value.style.transition = 'none'
        handler.value.style.left = numericWidth - props.height + 'px'
        progressBar.value.style.width = numericWidth - props.height / 2 + 'px'
        passVerify()
      }
      state.isMoving = false
    }
  }

  /**
   * Verification pass handler
   */
  const passVerify = () => {
    emit('update:value', true)
    state.isMoving = false
    // Update styles to success state
    progressBar.value.style.background = props.completedBg
    messageRef.value.style['-webkit-text-fill-color'] = 'unset'
    messageRef.value.style.animation = 'slidetounlock2 2s cubic-bezier(0, 0.2, 1, 1) infinite'
    messageRef.value.style.color = '#fff'
    emit('passCallback')
  }

  /**
   * Reset verification state
   */
  const reset = () => {
    // Reset slider position
    handler.value.style.left = '0'
    progressBar.value.style.width = '0'
    // Reset icon
    handler.value.children[0].innerHTML = props.handlerIcon
    // Reset text styles
    messageRef.value.style['-webkit-text-fill-color'] = 'transparent'
    messageRef.value.style.animation = 'slidetounlock 2s cubic-bezier(0, 0.2, 1, 1) infinite'
    messageRef.value.style.color = props.background
    // Reset state
    emit('update:value', false)
    state.isOk = false
    state.isMoving = false
    state.x = 0
  }

  // Expose reset to parent
  defineExpose({
    reset
  })
</script>

<style lang="scss" scoped>
  .drag_verify {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    border: 1px solid var(--art-border-dashed-color);

    .dv_handler {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;

      i {
        padding-left: 0;
        font-size: 14px;
        color: #999;
      }

      .el-icon-circle-check {
        margin-top: 9px;
        color: #6c6;
      }
    }

    .dv_progress_bar {
      position: absolute;
      width: 0;
      height: 34px;
    }

    .dv_text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: transparent;
      user-select: none;
      background: linear-gradient(
        to right,
        var(--textColor) 0%,
        var(--textColor) 40%,
        #fff 50%,
        var(--textColor) 60%,
        var(--textColor) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      animation: slidetounlock 2s cubic-bezier(0, 0.2, 1, 1) infinite;
      -webkit-text-fill-color: transparent;
      text-size-adjust: none;

      * {
        -webkit-text-fill-color: var(--textColor);
      }
    }
  }

  .goFirst {
    left: 0 !important;
    transition: left 0.5s;
  }

  .goFirst2 {
    width: 0 !important;
    transition: width 0.5s;
  }
</style>

<style lang="scss">
  @keyframes slidetounlock {
    0% {
      background-position: var(--pwidth) 0;
    }

    100% {
      background-position: var(--width) 0;
    }
  }

  @keyframes slidetounlock2 {
    0% {
      background-position: var(--pwidth) 0;
    }

    100% {
      background-position: var(--pwidth) 0;
    }
  }
</style>
