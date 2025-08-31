<!-- Basic banner component -->
<template>
  <div
    class="basic-banner art-custom-card"
    :class="{ 'has-decoration': decoration }"
    :style="{ backgroundColor: backgroundColor, height: height }"
    @click="emit('click')"
  >
    <!-- Meteor effect -->
    <div v-if="meteorConfig?.enabled && isDark" class="basic-banner__meteors">
      <span
        v-for="(meteor, index) in meteors"
        :key="index"
        class="meteor"
        :style="{
          top: '-60px',
          left: `${meteor.x}%`,
          animationDuration: `${meteor.speed}s`,
          animationDelay: `${meteor.delay}s`
        }"
      ></span>
    </div>

    <div class="basic-banner__content">
      <!-- title slot -->
      <slot name="title">
        <p v-if="title" class="basic-banner__title" :style="{ color: titleColor }">{{ title }}</p>
      </slot>

      <!-- subtitle slot -->
      <slot name="subtitle">
        <p v-if="subtitle" class="basic-banner__subtitle" :style="{ color: subtitleColor }">{{
          subtitle
        }}</p>
      </slot>

      <!-- button slot -->
      <slot name="button">
        <div
          v-if="buttonConfig?.show"
          class="basic-banner__button"
          :style="{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            borderRadius: buttonRadius
          }"
          @click.stop="emit('buttonClick')"
        >
          {{ buttonConfig?.text }}
        </div>
      </slot>

      <!-- default slot -->
      <slot></slot>

      <!-- background image -->
      <img
        v-if="imageConfig.src"
        class="basic-banner__background-image"
        :src="imageConfig.src"
        :style="{ width: imageConfig.width, bottom: imageConfig.bottom, right: imageConfig.right }"
        loading="lazy"
        alt="Background image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  defineOptions({ name: 'ArtBasicBanner' })

  // Meteor interface
  interface Meteor {
    /** Horizontal position (%) */
    x: number
    /** Speed */
    speed: number
    /** Delay */
    delay: number
  }

  // Button config interface
  interface ButtonConfig {
    /** Enable button */
    show: boolean
    /** Button text */
    text: string
    /** Button background */
    color?: string
    /** Button text color */
    textColor?: string
    /** Button border radius */
    radius?: string
  }

  // Meteor config interface
  interface MeteorConfig {
    /** Enable meteor */
    enabled: boolean
    /** Meteor count */
    count?: number
  }

  // Background image config interface
  interface ImageConfig {
    /** Image src */
    src: string
    /** Image width */
    width?: string
    /** Bottom distance */
    bottom?: string
    /** Right distance */
    right?: string // Distance from the right side
  }

  // Component props interface
  interface Props {
    /** Banner height */
    height?: string
    /** Title */
    title?: string
    /** Subtitle */
    subtitle?: string
    /** Background color */
    backgroundColor?: string
    /** Show decoration */
    decoration?: boolean
    /** Button config */
    buttonConfig?: ButtonConfig
    /** Meteor config */
    meteorConfig?: MeteorConfig
    /** Image config */
    imageConfig?: ImageConfig
    /** Title color */
    titleColor?: string
    /** Subtitle color */
    subtitleColor?: string
  }

  // Default props
  const props = withDefaults(defineProps<Props>(), {
    height: '11rem',
    titleColor: 'white',
    subtitleColor: 'white',
    backgroundColor: 'var(--el-color-primary-light-3)',
    decoration: true,
    buttonConfig: () => ({
      show: true,
      text: 'View',
      color: '#fff',
      textColor: '#333',
      radius: '6px'
    }),
    meteorConfig: () => ({ enabled: false, count: 10 }),
    imageConfig: () => ({ src: '', width: '12rem', bottom: '-3rem', right: '0' })
  })

  // Component events
  const emit = defineEmits<{
    (e: 'click'): void // Banner click
    (e: 'buttonClick'): void // Button click
  }>()

  // Compute button style
  const buttonColor = computed(() => props.buttonConfig?.color ?? '#fff')
  const buttonTextColor = computed(() => props.buttonConfig?.textColor ?? '#333')
  const buttonRadius = computed(() => props.buttonConfig?.radius ?? '6px')

  // Meteor data init
  const meteors = ref<Meteor[]>([])
  onMounted(() => {
    if (props.meteorConfig?.enabled) {
      meteors.value = generateMeteors(props.meteorConfig?.count ?? 10)
    }
  })

  /**
   * Generate meteor data array
   * @param count Meteor count
   * @returns Meteor data array
   */
  function generateMeteors(count: number): Meteor[] {
    // Compute area width for each meteor
    const segmentWidth = 100 / count
    return Array.from({ length: count }, (_, index) => {
      // Compute start position
      const segmentStart = index * segmentWidth
      // Random x within area
      const x = segmentStart + Math.random() * segmentWidth
      // Randomize speed
      const isSlow = Math.random() > 0.5
      return {
        x,
        speed: isSlow ? 5 + Math.random() * 3 : 2 + Math.random() * 2,
        delay: Math.random() * 5
      }
    })
  }
</script>

<style lang="scss" scoped>
  .basic-banner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 2rem;
    overflow: hidden;
    color: white;
    border-radius: calc(var(--custom-radius) + 2px) !important;

    &__content {
      position: relative;
      z-index: 1;
    }

    &__title {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    &__subtitle {
      position: relative;
      z-index: 10;
      margin: 0 0 1.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    &__button {
      box-sizing: border-box;
      display: inline-block;
      min-width: 80px;
      height: var(--el-component-custom-height);
      padding: 0 12px;
      font-size: 14px;
      line-height: var(--el-component-custom-height);
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
      }
    }

    &__background-image {
      position: absolute;
      right: 0;
      bottom: -3rem;
      z-index: 0;
      width: 12rem;
    }

    &.has-decoration::after {
      position: absolute;
      right: -10%;
      bottom: -20%;
      width: 60%;
      height: 140%;
      content: '';
      background: rgb(255 255 255 / 10%);
      border-radius: 30%;
      transform: rotate(-20deg);
    }

    &__meteors {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .meteor {
        position: absolute;
        width: 2px;
        height: 60px;
        background: linear-gradient(
          to top,
          rgb(255 255 255 / 40%),
          rgb(255 255 255 / 10%),
          transparent
        );
        opacity: 0;
        transform-origin: top left;
        animation-name: meteor-fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        &::before {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 2px;
          height: 2px;
          content: '';
          background: rgb(255 255 255 / 50%);
        }
      }
    }
  }

  @keyframes meteor-fall {
    0% {
      opacity: 1;
      transform: translate(0, -60px) rotate(-45deg);
    }

    100% {
      opacity: 0;
      transform: translate(400px, 340px) rotate(-45deg);
    }
  }

  @media (max-width: $device-phone) {
    .basic-banner {
      box-sizing: border-box;
      justify-content: flex-start;
      padding: 16px;

      &__title {
        font-size: 1.4rem;
      }

      &__background-image {
        display: none;
      }

      &.has-decoration::after {
        display: none;
      }
    }
  }
</style>
