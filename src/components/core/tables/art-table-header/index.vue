<!-- Table header: size, refresh, fullscreen, columns, and other settings -->
<template>
  <div class="table-header">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <div v-if="shouldShow('refresh')" class="btn" @click="refresh">
        <i class="iconfont-sys">&#xe614;</i>
      </div>

      <ElDropdown v-if="shouldShow('size')" @command="handleTableSizeChange">
        <div class="btn">
          <i class="iconfont-sys">&#xe63d;</i>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <div v-for="item in tableSizeOptions" :key="item.value" class="table-size-btn-item">
              <ElDropdownItem
                :key="item.value"
                :command="item.value"
                :class="{ 'is-selected': tableSize === item.value }"
              >
                {{ item.label }}
              </ElDropdownItem>
            </div>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div v-if="shouldShow('fullscreen')" class="btn" @click="toggleFullScreen">
        <i class="iconfont-sys">{{ isFullScreen ? '&#xe62d;' : '&#xe8ce;' }}</i>
      </div>

      <!-- Column settings -->
      <ElPopover v-if="shouldShow('columns')" placement="bottom" trigger="click">
        <template #reference>
          <div class="btn"><i class="iconfont-sys">&#xe6bd;</i> </div>
        </template>
        <div>
          <VueDraggable v-model="columns">
            <div v-for="item in columns" :key="item.prop || item.type" class="column-option">
              <div class="drag-icon">
                <i class="iconfont-sys">&#xe648;</i>
              </div>
              <ElCheckbox v-model="item.checked" :disabled="item.disabled">{{
                item.label || (item.type === 'selection' ? t('table.selection') : '')
              }}</ElCheckbox>
            </div>
          </VueDraggable>
        </div>
      </ElPopover>
      <!-- Other settings -->
      <ElPopover v-if="shouldShow('settings')" placement="bottom" trigger="click">
        <template #reference>
          <div class="btn">
            <i class="iconfont-sys" style="font-size: 17px">&#xe72b;</i>
          </div>
        </template>
        <div>
          <ElCheckbox v-if="showZebra" v-model="isZebra" :value="true">{{
            t('table.zebra')
          }}</ElCheckbox>
          <ElCheckbox v-if="showBorder" v-model="isBorder" :value="true">{{
            t('table.border')
          }}</ElCheckbox>
          <ElCheckbox v-if="showHeaderBackground" v-model="isHeaderBackground" :value="true">{{
            t('table.headerBackground')
          }}</ElCheckbox>
        </div>
      </ElPopover>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TableSizeEnum } from '@/enums/formEnum'
  import { useTableStore } from '@/store/modules/table'
  import { ElPopover, ElCheckbox, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
  import { VueDraggable } from 'vue-draggable-plus'
  import { useI18n } from 'vue-i18n'
  import type { ColumnOption } from '@/types/component'

  defineOptions({ name: 'ArtTableHeader' })

  const { t } = useI18n()

  interface Props {
    /** zebra stripes */
    showZebra?: boolean
    /** border */
    showBorder?: boolean
    /** header background */
    showHeaderBackground?: boolean
    /** fullscreen class */
    fullClass?: string
    /** component layout, comma-separated child names */
    layout?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    showZebra: true,
    showBorder: true,
    showHeaderBackground: true,
    fullClass: 'art-page-view',
    layout: 'refresh,size,fullscreen,columns,settings'
  })

  const columns = defineModel<ColumnOption[]>('columns', {
    required: false,
    default: () => []
  })

  const emit = defineEmits<{
    (e: 'refresh'): void
  }>()

  // ========== State ==========

  /** Table size options */
  const tableSizeOptions = [
    { value: TableSizeEnum.SMALL, label: t('table.sizeOptions.small') },
    { value: TableSizeEnum.DEFAULT, label: t('table.sizeOptions.default') },
    { value: TableSizeEnum.LARGE, label: t('table.sizeOptions.large') }
  ]

  const tableStore = useTableStore()
  const { tableSize, isZebra, isBorder, isHeaderBackground } = storeToRefs(tableStore)

  // ========== Computed ==========

  /** Parse layout prop to array */
  const layoutItems = computed(() => {
    return props.layout.split(',').map((item) => item.trim())
  })

  // ========== Utils ==========

  /**
   * Check if a subcomponent should show
   * @param componentName Component name
   * @returns Whether to show
   */
  const shouldShow = (componentName: string) => {
    return layoutItems.value.includes(componentName)
  }

  // ========== Events ==========

  /** Handle refresh */
  const refresh = () => {
    emit('refresh')
  }

  /**
   * Handle table size change
   * @param command Table size enum value
   */
  const handleTableSizeChange = (command: TableSizeEnum) => {
    useTableStore().setTableSize(command)
  }

  // ========== Fullscreen ==========

  /** Is fullscreen */
  const isFullScreen = ref(false)

  /** Save original overflow for restore on exit */
  const originalOverflow = ref('')

  /**
   * Toggle fullscreen: hides page scrollbar, restores on exit
   */
  const toggleFullScreen = () => {
    const el = document.querySelector(`.${props.fullClass}`)
    if (!el) return

    isFullScreen.value = !isFullScreen.value

    if (isFullScreen.value) {
      // Enter fullscreen: save original style and hide scrollbar
      originalOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      el.classList.add('el-full-screen')
      tableStore.setIsFullScreen(true)
    } else {
      // Exit fullscreen: restore original style
      document.body.style.overflow = originalOverflow.value
      el.classList.remove('el-full-screen')
      tableStore.setIsFullScreen(false)
    }
  }

  /**
   * ESC key handler to exit fullscreen
   * Keep reference to remove listener on unmount
   */
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullScreen.value) {
      toggleFullScreen()
    }
  }

  // ========== Lifecycle ==========

  /** Register global listeners on mount */
  onMounted(() => {
    document.addEventListener('keydown', handleEscapeKey)
  })

  /** Cleanup on unmount */
  onUnmounted(() => {
    // Remove event listener
    document.removeEventListener('keydown', handleEscapeKey)

    // If unmounted while fullscreen, restore body overflow
    if (isFullScreen.value) {
      document.body.style.overflow = originalOverflow.value
      const el = document.querySelector(`.${props.fullClass}`)
      if (el) {
        el.classList.remove('el-full-screen')
      }
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.table-size-btn-item) {
    .el-dropdown-menu__item {
      margin-bottom: 3px !important;
    }

    &:last-child {
      .el-dropdown-menu__item {
        margin-bottom: 0 !important;
      }
    }
  }

  :deep(.is-selected) {
    background-color: rgba(var(--art-gray-200-rgb), 0.8) !important;
  }

  .table-header {
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 0;
    }

    .right {
      display: flex;
      align-items: center;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-left: 10px;
        color: var(--art-gray-700);
        cursor: pointer;
        background-color: rgba(var(--art-gray-200-rgb), 0.8);
        border-radius: 6px;
        transition: color 0.3s;
        transition: all 0.3s;

        i {
          font-size: 16px;
          color: var(--art-gray-700);
          user-select: none;
        }

        &:hover {
          background-color: rgba(var(--art-gray-300-rgb), 0.75);

          i {
            color: var(--art-gray-800);
          }
        }
      }
    }
  }

  :deep(.column-option) {
    display: flex;
    align-items: center;

    .drag-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      margin-right: 8px;
      color: var(--art-gray-500);
      cursor: move;

      i {
        font-size: 18px;
      }
    }
  }

  @media (max-width: $device-phone) {
    .table-header {
      flex-direction: column;

      .right {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;

        .btn {
          margin-right: 10px;
          margin-left: 0;
        }
      }
    }
  }
</style>
