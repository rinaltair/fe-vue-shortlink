<!-- Progress bar card -->
<template>
  <div class="progress-card art-custom-card">
    <div class="progress-info" :style="{ justifyContent: icon ? 'space-between' : 'flex-start' }">
      <div class="left">
        <i
          v-if="icon"
          class="iconfont-sys"
          v-html="icon"
          :style="{
            color: iconColor,
            backgroundColor: iconBgColor,
            fontSize: iconSize + 'px',
            borderRadius: iconBgRadius + 'px'
          }"
        ></i>
      </div>
      <div class="right">
        <ArtCountTo
          class="percentage"
          :target="percentage"
          :duration="2000"
          suffix="%"
          :style="{ textAlign: icon ? 'right' : 'left' }"
        />
        <p class="title">{{ title }}</p>
      </div>
    </div>
    <ElProgress
      :percentage="currentPercentage"
      :stroke-width="strokeWidth"
      :show-text="false"
      :color="color"
    />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtProgressCard' })

  interface Props {
    /** Progress percentage */
    percentage: number
    /** Title */
    title: string
    /** Color */
    color?: string
    /** Icon */
    icon?: string
    /** Icon color */
    iconColor?: string
    /** Icon background color */
    iconBgColor?: string
    /** Icon background border radius */
    iconBgRadius?: number
    /** Icon size */
    iconSize?: number
    /** Progress bar stroke width */
    strokeWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    strokeWidth: 5,
    iconBgRadius: 8,
    color: '#67C23A'
  })

  const animationDuration = 500
  const currentPercentage = ref(0)

  const animateProgress = () => {
    const startTime = Date.now()
    const startValue = currentPercentage.value
    const endValue = props.percentage

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      currentPercentage.value = startValue + (endValue - startValue) * progress

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  onMounted(() => {
    animateProgress()
  })

  // Re-run animation when the percentage prop changes
  watch(
    () => props.percentage,
    () => {
      animateProgress()
    }
  )
</script>

<style lang="scss" scoped>
  .progress-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 8rem;
    padding: 0 20px;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 4px);

    .progress-info {
      display: flex;
      align-items: center;
      margin-block-end: 15px;

      .left {
        i {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          background-color: var(--art-gray-300);
        }
      }

      .right {
        .percentage {
          display: block;
          margin-block-end: 4px;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--art-gray-900);
        }

        .title {
          font-size: 0.875rem;
          color: var(--art-gray-600);
        }
      }
    }

    :deep(.el-progress-bar__outer) {
      background-color: rgb(240 240 240);
    }
  }
</style>
