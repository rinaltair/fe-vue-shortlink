<!-- Table component -->
<!-- Supports: all el-table props, events, slots (same as official API) -->
<!-- Extras: pagination, custom column rendering, loading, global border, zebra, size, header background -->
<!-- Ref: exposes elTableRef so you can call el-table methods via ref.value.elTableRef -->
<template>
  <div class="art-table" :class="{ 'is-empty': isEmpty }" :style="containerHeight">
    <ElTable
      ref="elTableRef"
      v-loading="!!loading"
      v-bind="{ ...$attrs, ...props, height, stripe, border, size, headerCellStyle }"
    >
      <template v-for="col in columns" :key="col.prop || col.type">
        <!-- Render global index column -->
        <ElTableColumn v-if="col.type === 'globalIndex'" v-bind="{ ...col }">
          <template #default="{ $index }">
            <span>{{ getGlobalIndex($index) }}</span>
          </template>
        </ElTableColumn>

        <!-- Render expand row -->
        <ElTableColumn v-else-if="col.type === 'expand'" v-bind="cleanColumnProps(col)">
          <template #default="{ row }">
            <component :is="col.formatter ? col.formatter(row) : null" />
          </template>
        </ElTableColumn>

        <!-- Render normal columns -->
        <ElTableColumn v-else v-bind="cleanColumnProps(col)">
          <template v-if="col.useHeaderSlot && col.prop" #header="headerScope">
            <slot
              :name="col.headerSlotName || `${col.prop}-header`"
              v-bind="{ ...headerScope, prop: col.prop, label: col.label }"
            >
              {{ col.label }}
            </slot>
          </template>
          <template v-if="col.useSlot && col.prop" #default="slotScope">
            <slot
              :name="col.slotName || col.prop"
              v-bind="{
                ...slotScope,
                prop: col.prop,
                value: col.prop ? slotScope.row[col.prop] : undefined
              }"
            />
          </template>
        </ElTableColumn>
      </template>

      <template v-if="$slots.default" #default><slot /></template>

      <template #empty>
        <div v-if="loading"></div>
        <ElEmpty v-else :description="emptyText" :image-size="120" />
      </template>
    </ElTable>

    <div
      class="pagination custom-pagination"
      v-if="showPagination"
      :class="mergedPaginationOptions?.align"
      ref="paginationRef"
    >
      <ElPagination
        v-bind="mergedPaginationOptions"
        :total="pagination?.total"
        :disabled="loading"
        :page-size="pagination?.size"
        :current-page="pagination?.current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import { ElPagination, ElTable, ElTableColumn, ElEmpty, type TableProps } from 'element-plus'
  import { storeToRefs } from 'pinia'
  import { ColumnOption } from '@/types'
  import { useTableStore } from '@/store/modules/table'
  import { useCommon } from '@/composables/useCommon'
  import { useElementSize, useWindowSize } from '@vueuse/core'

  defineOptions({ name: 'ArtTable' })

  const { width } = useWindowSize()
  const elTableRef = ref<InstanceType<typeof ElTable> | null>(null)
  const paginationRef = ref<HTMLElement>()
  const tableStore = useTableStore()
  const { isBorder, isZebra, tableSize, isFullScreen, isHeaderBackground } = storeToRefs(tableStore)

  /** Pagination config interface */
  interface PaginationConfig {
    /** current page */
    current: number
    /** page size */
    size: number
    /** total items */
    total: number
  }

  /** Pagination options interface */
  interface PaginationOptions {
    /** page size options */
    pageSizes?: number[]
    /** pagination alignment */
    align?: 'left' | 'center' | 'right'
    /** pagination layout */
    layout?: string
    /** show pagination background */
    background?: boolean
    /** hide pagination if single page */
    hideOnSinglePage?: boolean
    /** pagination size */
    size?: 'small' | 'default' | 'large'
    /** pager count */
    pagerCount?: number
  }

  /** ArtTable props interface */
  interface ArtTableProps extends TableProps<Record<string, any>> {
    /** loading state */
    loading?: boolean
    /** column render config */
    columns?: ColumnOption[]
    /** pagination state */
    pagination?: PaginationConfig
    /** pagination options */
    paginationOptions?: PaginationOptions
    /** empty data table height */
    emptyHeight?: string
    /** empty data text */
    emptyText?: string
    /** enable ArtTableHeader to solve auto height */
    showTableHeader?: boolean
  }

  const props = withDefaults(defineProps<ArtTableProps>(), {
    columns: () => [],
    fit: true,
    showHeader: true,
    stripe: undefined,
    border: undefined,
    size: undefined,
    emptyHeight: '360px',
    emptyText: 'No data',
    showTableHeader: true
  })

  const LAYOUT = {
    MOBILE: 'prev, pager, next, sizes, jumper, total',
    IPAD: 'prev, pager, next, jumper, total',
    DESKTOP: 'total, prev, pager, next, sizes, jumper'
  }

  const layout = computed(() => {
    if (width.value < 768) {
      return LAYOUT.MOBILE
    } else if (width.value < 1024) {
      return LAYOUT.IPAD
    } else {
      return LAYOUT.DESKTOP
    }
  })

  // Default pagination constants
  const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
    pageSizes: [10, 20, 30, 50, 100],
    align: 'center',
    background: true,
    layout: layout.value,
    hideOnSinglePage: false,
    size: 'default',
    pagerCount: width.value > 1200 ? 7 : 5
  }

  // Merge pagination options
  const mergedPaginationOptions = computed(() => ({
    ...DEFAULT_PAGINATION_OPTIONS,
    ...props.paginationOptions
  }))

  // Border (priority: props > store)
  const border = computed(() => props.border ?? isBorder.value)
  // Zebra stripe
  const stripe = computed(() => props.stripe ?? isZebra.value)
  // Table size
  const size = computed(() => props.size ?? tableSize.value)
  // Whether data is empty
  const isEmpty = computed(() => props.data?.length === 0)

  const { height: paginationHeight } = useElementSize(paginationRef)

  // Container height calc
  const containerHeight = computed(() => {
    let offset = 0
    if (!props.showTableHeader) {
      offset = paginationHeight.value === 0 ? 0 : 45
    } else {
      offset = paginationHeight.value === 0 ? 25 : 84
    }
    return { height: offset === 0 ? '100%' : `calc(100% - ${offset}px)` }
  })

  // Table height logic
  const height = computed(() => {
    // Fill fullscreen when in fullscreen mode
    if (isFullScreen.value) return '100%'
    // Fixed height when empty and not loading
    if (isEmpty.value && !props.loading) return props.emptyHeight
    // Use provided height
    if (props.height) return props.height
    // Default to fill container height
    return '100%'
  })

  // Header background cell style
  const headerCellStyle = computed(() => ({
    background: isHeaderBackground.value
      ? 'var(--el-fill-color-lighter)'
      : 'var(--art-main-bg-color)',
    ...(props.headerCellStyle || {}) // merge user styles
  }))

  // Whether to show pagination
  const showPagination = computed(() => props.pagination && !isEmpty.value)

  // Clean column props: remove slot-only custom props so ElTableColumn won't misinterpret
  const cleanColumnProps = (col: ColumnOption) => {
    const columnProps = { ...col }
    // Delete custom slot control props
    delete columnProps.useHeaderSlot
    delete columnProps.headerSlotName
    delete columnProps.useSlot
    delete columnProps.slotName
    return columnProps
  }

  // Pagination size change
  const handleSizeChange = (val: number) => {
    emit('pagination:size-change', val)
  }

  // Pagination current page change
  const handleCurrentChange = (val: number) => {
    emit('pagination:current-change', val)
    scrollToTop() // Scroll to table top after page change
  }

  // Scroll table content to top and optionally page top
  const scrollToTop = () => {
    nextTick(() => {
      elTableRef.value?.setScrollTop(0) // Scroll ElTable internal scroll to top
      useCommon().scrollToTop() // Use common composable to scroll page top
    })
  }

  // Global index
  const getGlobalIndex = (index: number) => {
    if (!props.pagination) return index + 1
    const { current, size } = props.pagination
    return (current - 1) * size + index + 1
  }

  const emit = defineEmits<{
    (e: 'pagination:size-change', val: number): void
    (e: 'pagination:current-change', val: number): void
  }>()

  defineExpose({
    scrollToTop,
    elTableRef
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
