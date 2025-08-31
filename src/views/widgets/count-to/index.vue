<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Count-To component based on VueUse useTransition</h1>
      <p>High-performance number animation with full control and events</p>
    </div>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h2>Basic Usage</h2>
      <div class="number-display">
        <ArtCountTo :target="1000" :duration="2000" />
      </div>
    </div>

    <!-- Prefix and Suffix -->
    <div class="demo-section">
      <h2>Prefix and Suffix</h2>
      <div class="number-display">
        <ArtCountTo :target="20000" :duration="2500" prefix="¥" suffix=" CNY" :decimals="2" />
      </div>
    </div>

    <!-- Decimals and Separator -->
    <div class="demo-section">
      <h2>Decimals and Separator</h2>
      <div class="number-display">
        <ArtCountTo :target="2023.45" :duration="3000" :decimals="2" separator="," />
      </div>
    </div>

    <!-- Easing Comparison -->
    <div class="demo-section">
      <h2>Easing Comparison</h2>
      <div class="easing-demo">
        <div class="easing-item" v-for="easing in easingTypes" :key="easing.type">
          <div class="easing-label">{{ easing.name }}</div>
          <div class="number-display">
            <ArtCountTo :target="easingTarget" :duration="3000" :easing="easing.type" />
          </div>
        </div>
      </div>
      <div class="trigger-center">
        <el-button @click="triggerEasing">Trigger all animations</el-button>
      </div>
    </div>

    <!-- Controls -->
    <div class="demo-section">
      <h2>Controls</h2>
      <div class="number-display">
        <ArtCountTo
          ref="countToRef"
          :target="controlTarget"
          :duration="2000"
          @started="handleAnimationStarted"
          @finished="handleAnimationFinished"
          @paused="handleAnimationPaused"
          @reset="handleAnimationReset"
        />
      </div>

      <div class="control-buttons">
        <el-button @click="startCount">Start</el-button>
        <el-button @click="pauseCount">Pause</el-button>
        <el-button @click="resetCount">Reset</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ArtCountTo from '@/components/core/text-effect/art-count-to/index.vue'

  // Control variables
  const controlTarget = ref(0)
  const countToRef = ref()

  // Target value for easing demo
  const easingTarget = ref(0)

  // Easing types
  const easingTypes = [
    { name: 'Linear', type: 'linear' },
    { name: 'Ease Out Cubic', type: 'easeOutCubic' },
    { name: 'Ease Out Expo', type: 'easeOutExpo' },
    { name: 'Ease Out Sine', type: 'easeOutSine' },
    { name: 'Ease In Out', type: 'easeInOutCubic' },
    { name: 'Ease In Quad', type: 'easeInQuad' }
  ] as const

  // Start
  const startCount = () => {
    const newTarget = 5000
    controlTarget.value = newTarget
    countToRef.value?.start(newTarget)
  }

  // Pause
  const pauseCount = () => {
    countToRef.value?.pause()
  }

  // Reset
  const resetCount = () => {
    countToRef.value?.reset()
    controlTarget.value = 0
  }

  // Trigger easing demo
  const triggerEasing = () => {
    easingTarget.value = easingTarget.value === 0 ? 1000 : 0
  }

  // Listen for animation events
  const handleAnimationStarted = (value: number) => {
    console.log('Animation started, target:', value)
  }

  const handleAnimationFinished = (value: number) => {
    console.log('Animation finished, final value:', value)
  }

  const handleAnimationPaused = (value: number) => {
    console.log('Animation paused, current value:', value)
  }

  const handleAnimationReset = () => {
    console.log('Animation reset')
  }
</script>

<style scoped lang="scss">
  .page-content {
    .page-header {
      margin-bottom: 60px;
      text-align: center;

      h1 {
        margin: 1rem 0 16px;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.2;
        color: #333;
      }

      p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: #666;
      }
    }

    .demo-section {
      margin-bottom: 60px;

      h2 {
        margin: 0 0 24px;
        font-size: 1.2rem;
        font-weight: 500;
        color: #333;
      }
    }

    .number-display {
      padding: 20px;
      margin-bottom: 20px;
      font-size: 2rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: #495057;
      text-align: center;
      background: var(--art-gray-100);
      border: 1px solid var(--art-border-color);
      border-radius: 8px;
    }

    .control-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .easing-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;

      .easing-item {
        text-align: center;

        .easing-label {
          margin-bottom: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #666;
        }

        .number-display {
          padding: 16px;
          margin-bottom: 0;
          font-size: 1.5rem;
        }
      }
    }

    .trigger-center {
      text-align: center;
    }
  }
</style>
