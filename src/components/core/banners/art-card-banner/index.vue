<!-- Card banner component -->
<template>
  <div class="card-banner art-custom-card" :style="{ height: props.height }">
    <div class="banner-content">
      <div class="banner-icon">
        <img :src="props.image" :alt="props.title" />
      </div>
      <div class="banner-text">
        <p class="banner-title">{{ props.title }}</p>
        <p class="banner-description">{{ props.description }}</p>
      </div>
      <div class="banner-buttons">
        <div
          v-if="props.cancelButton?.show"
          class="banner-button cancel-button"
          :style="{
            backgroundColor: props.cancelButton?.color,
            color: props.cancelButton?.textColor
          }"
          @click="handleCancel"
        >
          {{ props.cancelButton?.text }}
        </div>
        <div
          v-if="props.button?.show"
          class="banner-button"
          :style="{ backgroundColor: props.button?.color, color: props.button?.textColor }"
          @click="handleClick"
        >
          {{ props.button?.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Import default icon
  import defaultIcon from '@imgs/3d/icon1.webp'

  defineOptions({ name: 'ArtCardBanner' })

  // Props interface for card banner
  interface CardBannerProps {
    /** Height */
    height?: string
    /** Image path */
    image?: string
    /** Title text */
    title: string
    /** Description text */
    description: string
    /** Primary button config */
    button?: {
      /** Show */
      show?: boolean
      /** Button text */
      text?: string
      /** Background color */
      color?: string
      /** Text color */
      textColor?: string
    }
    /** Cancel button config */
    cancelButton?: {
      /** Show */
      show?: boolean
      /** Button text */
      text?: string
      /** Background color */
      color?: string
      /** Text color */
      textColor?: string
    }
  }

  // Default props
  const props = withDefaults(defineProps<CardBannerProps>(), {
    height: '24rem',
    image: defaultIcon,
    title: '',
    description: '',
    // Primary button defaults
    button: () => ({
      show: true,
      text: 'View Details',
      color: 'var(--main-color)',
      textColor: '#fff'
    }),
    // Cancel button defaults
    cancelButton: () => ({
      show: false,
      text: 'Cancel',
      color: '#f5f5f5',
      textColor: '#666'
    })
  })

  // Component events
  const emit = defineEmits<{
    (e: 'click'): void // Primary button click
    (e: 'cancel'): void // Cancel button click
  }>()

  // Handle primary button click
  const handleClick = () => {
    emit('click')
  }

  // Handle cancel button click
  const handleCancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss" scoped>
  .card-banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 1.5rem;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 2px) !important;

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      text-align: center;
    }

    .banner-icon {
      width: 180px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .banner-text {
      box-sizing: border-box;
      padding: 0 16px;

      .banner-title {
        margin-bottom: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--art-text-gray-800);
      }

      .banner-description {
        margin: 0;
        font-size: 14px;
        color: var(--art-text-gray-600);
      }
    }

    .banner-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .banner-button {
      display: inline-block;
      height: var(--el-component-custom-height);
      padding: 0 12px;
      font-size: 14px;
      line-height: var(--el-component-custom-height);
      cursor: pointer;
      user-select: none;
      border-radius: 6px;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.9;
      }

      &.cancel-button {
        border: 1px solid #dcdfe6;
      }
    }
  }
</style>
