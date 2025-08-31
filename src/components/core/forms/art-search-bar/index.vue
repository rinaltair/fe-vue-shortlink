<!-- Table search component -->
<!-- Supports common form components, custom components, slots, validation, hidden items -->
<!-- Usage similar to Element Plus docs; put attributes in props -->
<template>
  <section class="art-search-bar art-custom-card" :class="{ 'is-expanded': isExpanded }">
    <ElForm
      ref="formRef"
      :model="modelValue"
      :label-position="labelPosition"
      v-bind="{ ...$attrs }"
    >
      <ElRow class="search-form-row" :gutter="gutter">
        <ElCol
          v-for="item in visibleFormItems"
          :key="item.key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="item.span || span"
          :xl="item.span || span"
        >
          <ElFormItem
            :label="item.label"
            :prop="item.key"
            :label-width="item.labelWidth || labelWidth"
          >
            <slot :name="item.key" :item="item" :modelValue="modelValue">
              <component
                :is="getComponent(item)"
                v-model="modelValue[item.key]"
                v-bind="getProps(item)"
              >
                <!-- Select -->
                <template v-if="item.type === 'select' && getProps(item)?.options">
                  <el-option
                    v-for="option in getProps(item).options"
                    v-bind="option"
                    :key="option.value"
                  />
                </template>

                <!-- Checkbox group -->
                <template v-if="item.type === 'checkboxgroup' && getProps(item)?.options">
                  <el-checkbox
                    v-for="option in getProps(item).options"
                    v-bind="option"
                    :key="option.value"
                  />
                </template>

                <!-- Radio group -->
                <template v-if="item.type === 'radiogroup' && getProps(item)?.options">
                  <el-radio
                    v-for="option in getProps(item).options"
                    v-bind="option"
                    :key="option.value"
                  />
                </template>

                <!-- Dynamic slot support -->
                <template v-for="(slotFn, slotName) in getSlots(item)" :key="slotName" #[slotName]>
                  <component :is="slotFn" />
                </template>
              </component>
            </slot>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="24" :md="span" :lg="span" :xl="span" class="action-column">
          <div class="action-buttons-wrapper" :style="actionButtonsStyle">
            <div class="form-buttons">
              <el-button v-if="showReset" class="reset-button" @click="handleReset" v-ripple>
                {{ t('table.searchBar.reset') }}
              </el-button>
              <el-button
                v-if="showSearch"
                type="primary"
                class="search-button"
                @click="handleSearch"
                v-ripple
                :disabled="disabledSearch"
              >
                {{ t('table.searchBar.search') }}
              </el-button>
            </div>
            <div v-if="shouldShowExpandToggle" class="filter-toggle" @click="toggleExpand">
              <span>{{ expandToggleText }}</span>
              <div class="icon-wrapper">
                <el-icon>
                  <ArrowUpBold v-if="isExpanded" />
                  <ArrowDownBold v-else />
                </el-icon>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
  import { useWindowSize } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElSwitch,
    ElCheckbox,
    ElCheckboxGroup,
    ElRadioGroup,
    ElButton,
    ElIcon,
    FormInstance,
    ElRate,
    ElSlider,
    ElRow,
    ElCol,
    ElCascader,
    ElTimePicker,
    ElTimeSelect,
    ElTreeSelect
  } from 'element-plus'

  defineOptions({ name: 'ArtSearchBar' })

  const componentMap = {
    input: ElInput, // Input
    number: ElInputNumber, // Number input
    select: ElSelect, // Select
    switch: ElSwitch, // Switch
    checkbox: ElCheckbox, // Checkbox
    checkboxgroup: ElCheckboxGroup, // Checkbox group
    radiogroup: ElRadioGroup, // Radio group
    date: ElDatePicker, // Date picker
    daterange: ElDatePicker, // Date range picker
    datetime: ElDatePicker, // Datetime picker
    datetimerange: ElDatePicker, // Datetime range picker
    rate: ElRate, // Rate
    slider: ElSlider, // Slider
    cascader: ElCascader, // Cascader
    timepicker: ElTimePicker, // Time picker
    timeselect: ElTimeSelect, // Time select
    treeselect: ElTreeSelect // Tree select
  }

  const { width } = useWindowSize()
  const { t } = useI18n()
  const isMobile = computed(() => width.value < 500)

  const formInstance = useTemplateRef<FormInstance>('formRef')

  // Form item config
  export interface SearchFormItem {
    /** Unique key */
    key: string
    /** Label text */
    label: string
    /** Label width (overrides Form labelWidth) */
    labelWidth?: string | number
    /** Item type (predefined string or custom comp) */
    type: keyof typeof componentMap | string | (() => VNode)
    /** Hide item */
    hidden?: boolean
    /** Column span (24-grid) */
    span?: number
    /** Options for select/checkbox-group/radio-group */
    options?: Record<string, any>
    /** Component props */
    props?: Record<string, any>
    /** Slot config */
    slots?: Record<string, (() => any) | undefined>
    /** Placeholder */
    placeholder?: string
    /** See Element Plus docs for more */
  }

  // Form config
  interface SearchBarProps {
    /** Form data */
    items: SearchFormItem[]
    /** Column width (24-grid) */
    span?: number
    /** Control gap */
    gutter?: number
    /** Expand/collapse */
    isExpand?: boolean
    /** Default expanded (when showExpand true and isExpand false) */
    defaultExpanded?: boolean
    /** Label position */
    labelPosition?: 'left' | 'right' | 'top'
    /** Label width */
    labelWidth?: string | number
    /** Whether to show collapse */
    showExpand?: boolean
    /** Left-align threshold for buttons */
    buttonLeftLimit?: number
    /** Show reset button */
    showReset?: boolean
    /** Show search button */
    showSearch?: boolean
    /** Disable search button */
    disabledSearch?: boolean
  }

  const props = withDefaults(defineProps<SearchBarProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    isExpand: false,
    labelPosition: 'right',
    labelWidth: '70px',
    showExpand: true,
    defaultExpanded: false,
    buttonLeftLimit: 2,
    showReset: true,
    showSearch: true,
    disabledSearch: false
  })

  interface SearchBarEmits {
    reset: []
    search: []
  }

  const emit = defineEmits<SearchBarEmits>()

  const modelValue = defineModel<Record<string, any>>({ default: {} })

  /**
   * Expanded state
   */
  const isExpanded = ref(props.defaultExpanded)

  const rootProps = ['label', 'labelWidth', 'key', 'type', 'hidden', 'span', 'slots']

  const getProps = (item: SearchFormItem) => {
    if (item.props) return item.props
    const props = { ...item }
    rootProps.forEach((key) => delete (props as Record<string, any>)[key])
    return props
  }

  // Get slots
  const getSlots = (item: SearchFormItem) => {
    if (!item.slots) return {}
    const validSlots: Record<string, () => any> = {}
    Object.entries(item.slots).forEach(([key, slotFn]) => {
      if (slotFn) {
        validSlots[key] = slotFn
      }
    })
    return validSlots
  }

  // Components
  const getComponent = (item: SearchFormItem) => {
    const { type } = item
    if (type && typeof item.type !== 'string') return type
    // Default type is input
    return componentMap[type as keyof typeof componentMap] || componentMap['input']
  }

  /**
   * Visible form items
   */
  const visibleFormItems = computed(() => {
    const filteredItems = props.items.filter((item) => !item.hidden)
    const shouldShowLess = !props.isExpand && !isExpanded.value
    if (shouldShowLess) {
      const maxItemsPerRow = Math.floor(24 / props.span) - 1
      return filteredItems.slice(0, maxItemsPerRow)
    }
    return filteredItems
  })

  /**
   * Whether to show expand/collapse button
   */
  const shouldShowExpandToggle = computed(() => {
    const filteredItems = props.items.filter((item) => !item.hidden)
    return (
      !props.isExpand && props.showExpand && filteredItems.length > Math.floor(24 / props.span) - 1
    )
  })

  /**
   * Expand/collapse button text
   */
  const expandToggleText = computed(() => {
    return isExpanded.value ? t('table.searchBar.collapse') : t('table.searchBar.expand')
  })

  /**
   * Action button styles
   */
  const actionButtonsStyle = computed(() => ({
    'justify-content': isMobile.value
      ? 'flex-end'
      : props.items.filter((item) => !item.hidden).length <= props.buttonLeftLimit
        ? 'flex-start'
        : 'flex-end'
  }))

  /**
   * Toggle expand/collapse
   */
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
  }

  /**
   * Handle reset
   */
  const handleReset = () => {
    // Reset form fields (UI)
    formInstance.value?.resetFields()

    // Clear all form values (including hidden)
    Object.assign(
      modelValue.value,
      Object.fromEntries(props.items.map(({ key }) => [key, undefined]))
    )

    // Emit reset
    emit('reset')
  }

  /**
   * Handle search event
   */
  const handleSearch = () => {
    emit('search')
  }

  defineExpose({
    ref: formInstance,
    validate: (...args: any[]) => formInstance.value?.validate(...args),
    reset: handleReset
  })

  // Destructure props for template convenience
  const { span, gutter, labelPosition, labelWidth } = toRefs(props)
</script>

<style lang="scss" scoped>
  .art-search-bar {
    padding: 15px 20px 0;
    background-color: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px);

    .search-form-row {
      display: flex;
      flex-wrap: wrap;
    }

    .action-column {
      flex: 1;
      max-width: 100%;

      .action-buttons-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 12px;
      }

      .form-buttons {
        display: flex;
        gap: 8px;
      }

      .filter-toggle {
        display: flex;
        align-items: center;
        margin-left: 10px;
        line-height: 32px;
        color: var(--main-color);
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--ElColor-primary);
        }

        span {
          font-size: 14px;
          user-select: none;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          margin-left: 4px;
          font-size: 14px;
          transition: transform 0.2s ease;
        }
      }
    }
  }

  // Reactive optimizations
  @media (width <= 768px) {
    .art-search-bar {
      padding: 16px 16px 0;

      .action-column {
        .action-buttons-wrapper {
          flex-direction: column;
          gap: 8px;
          align-items: stretch;

          .form-buttons {
            justify-content: center;
          }

          .filter-toggle {
            justify-content: center;
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
