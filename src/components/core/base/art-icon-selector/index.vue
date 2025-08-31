<!-- Icon selector -->
<template>
  <div class="icon-selector">
    <div
      class="select"
      @click="handleClick"
      :style="{ width: props.width }"
      :class="[size, { 'is-disabled': disabled }, { 'has-icon': selectValue }]"
    >
      <div class="icon">
        <i
          :class="`iconfont-sys ${selectValue}`"
          v-show="props.iconType === IconTypeEnum.CLASS_NAME"
        ></i>
        <i
          class="iconfont-sys"
          v-html="selectValue"
          v-show="props.iconType === IconTypeEnum.UNICODE"
        ></i>
      </div>
      <div class="text"> {{ props.text }} </div>
      <div class="arrow">
        <i class="iconfont-sys arrow-icon">&#xe709;</i>
        <i class="iconfont-sys clear-icon" @click.stop="clearIcon">&#xe83a;</i>
      </div>
    </div>

    <el-dialog title="Select Icon" width="40%" v-model="visible" align-center>
      <el-scrollbar height="400px">
        <ul class="icons-list" v-show="activeName === 'icons'">
          <li v-for="icon in iconsList" :key="icon.className" @click="selectorIcon(icon)">
            <i
              :class="`iconfont-sys ${icon.className}`"
              v-show="iconType === IconTypeEnum.CLASS_NAME"
            ></i>
            <i
              class="iconfont-sys"
              v-html="icon.unicode"
              v-show="iconType === IconTypeEnum.UNICODE"
            ></i>
          </li>
        </ul>
      </el-scrollbar>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">Cancel</el-button>
          <el-button type="primary" @click="visible = false">OK</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { IconTypeEnum } from '@/enums/appEnum'
  import { extractIconClasses, type IconfontType } from '@/utils/constants'

  defineOptions({ name: 'ArtIconSelector' })

  // Component size types
  type ComponentSize = 'large' | 'default' | 'small'

  // Props interface
  interface Props {
    /** Icon type */
    iconType?: IconTypeEnum
    /** v-model bound icon value */
    modelValue?: string
    /** Display text */
    text?: string
    /** Component width */
    width?: string
    /** Component size */
    size?: ComponentSize
    /** Disabled */
    disabled?: boolean
  }

  // Emits interface
  interface Emits {
    'update:modelValue': [value: string]
    getIcon: [value: string]
  }

  // Define props with withDefaults
  const props = withDefaults(defineProps<Props>(), {
    iconType: IconTypeEnum.CLASS_NAME,
    modelValue: '',
    text: 'Icon Selector',
    width: '200px',
    size: 'default',
    disabled: false
  })

  // Define emits
  const emits = defineEmits<Emits>()

  // Reactive data
  const selectValue = ref<string>(props.modelValue)
  const visible = ref<boolean>(false)
  const activeName = ref<string>('icons')

  // Icon list - computed for performance
  const iconsList = computed<IconfontType[]>(() => extractIconClasses())

  // Watch modelValue changes
  watch(
    () => props.modelValue,
    (newVal: string) => {
      selectValue.value = newVal
    },
    { immediate: true }
  )

  // Select icon
  const selectorIcon = (icon: IconfontType): void => {
    const iconValue =
      props.iconType === IconTypeEnum.CLASS_NAME ? icon.className : icon.unicode || ''

    selectValue.value = iconValue
    visible.value = false

    // Emit v-model update and custom events
    emits('update:modelValue', iconValue)
    emits('getIcon', iconValue)
  }

  // Handle click event
  const handleClick = (): void => {
    if (!props.disabled) {
      visible.value = true
    }
  }

  // Clear icon
  const clearIcon = (): void => {
    selectValue.value = ''

    // Emit v-model update and custom events
    emits('update:modelValue', '')
    emits('getIcon', '')
  }

  // Computed: current icon type (for template)
  const iconType = computed<IconTypeEnum>(() => props.iconType)
</script>

<style lang="scss" scoped>
  .icon-selector {
    width: 100%;

    .select {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--el-component-custom-height);
      padding: 0 15px;
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: calc(var(--custom-radius) / 3 + 2px) !important;
      transition: border 0.3s;

      @media (width <= 500px) {
        width: 100% !important;
      }

      &.large {
        height: 40px;
      }

      &.small {
        height: 24px;
      }

      &:hover:not(.is-disabled).has-icon {
        .arrow-icon {
          display: none;
        }

        .clear-icon {
          display: block !important;
        }
      }

      &:hover {
        border-color: var(--art-text-gray-400);
      }

      .icon {
        display: flex;
        align-items: center;
        width: 20px;
        color: var(--art-gray-700);

        i {
          display: block;
          margin: 0 auto;
          font-size: 16px;
        }
      }

      .text {
        display: flex;
        display: inline-block;
        align-items: center;
        width: 50%;
        font-size: 14px;
        color: var(--art-gray-600);

        @include ellipsis();

        @media (width <= 500px) {
          display: none;
        }
      }

      .arrow {
        display: flex;
        align-items: center;
        height: calc(100% - 2px);

        i {
          font-size: 13px;
          color: var(--art-gray-600);
        }

        .clear-icon {
          display: none;
        }
      }

      &.is-disabled {
        cursor: not-allowed;
        background-color: var(--el-disabled-bg-color);
        border-color: var(--el-border-color-lighter);

        .icon,
        .text,
        .arrow {
          color: var(--el-text-color-placeholder);
        }

        &:hover {
          border-color: var(--el-border-color-lighter);
        }
      }
    }

    .icons-list {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      border-top: 1px solid var(--art-border-color);
      border-left: 1px solid var(--art-border-color);

      li {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        aspect-ratio: 1 / 1;
        color: var(--art-gray-600);
        text-align: center;
        border-right: 1px solid var(--art-border-color);
        border-bottom: 1px solid var(--art-border-color);

        &:hover {
          cursor: pointer;
          background: var(--art-gray-100);
        }

        i {
          font-size: 22px;
          color: var(--art-gray-800);
        }
      }
    }
  }
</style>
