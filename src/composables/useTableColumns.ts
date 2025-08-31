import { ref, computed, watch } from 'vue'
import { $t } from '@/locales'
import type { ColumnOption } from '@/types/component'

/**
 * Special column types
 */
const SPECIAL_COLUMNS: Record<string, { prop: string; label: string }> = {
  selection: { prop: '__selection__', label: $t('table.column.selection') },
  expand: { prop: '__expand__', label: $t('table.column.expand') },
  index: { prop: '__index__', label: $t('table.column.index') }
}

/**
 * Get column unique key
 */
export const getColumnKey = <T>(col: ColumnOption<T>) =>
  SPECIAL_COLUMNS[col.type as keyof typeof SPECIAL_COLUMNS]?.prop ?? (col.prop as string)

/**
 * Get column checked state
 */
export const getColumnChecks = <T>(columns: ColumnOption<T>[]) =>
  columns.map((col) => {
    const special = col.type && SPECIAL_COLUMNS[col.type]
    if (special) {
      return { ...col, prop: special.prop, label: special.label, checked: true }
    }
    return { ...col, checked: col.checked ?? true }
  })

/**
 * Dynamic column config interface
 */
export interface DynamicColumnConfig<T = any> {
  /**
   * Add a column
   * @param column Column config
   * @param index Optional insert index (default end)
   */
  addColumn: (column: ColumnOption<T>, index?: number) => void
  /**
   * Remove a column
   * @param prop Column key
   */
  removeColumn: (prop: string) => void
  /**
   * Toggle column visibility
   * @param prop Column key
   * @param visible Optional visible state; defaults to toggle
   */
  toggleColumn: (prop: string, visible?: boolean) => void

  /**
   * Update column
   * @param prop Column key
   * @param updates Column config updates
   */
  updateColumn: (prop: string, updates: Partial<ColumnOption<T>>) => void
  /**
   * Batch update columns
   * @param updates Column updates
   */
  batchUpdateColumns: (updates: Array<{ prop: string; updates: Partial<ColumnOption<T>> }>) => void
  /**
   * Reorder columns
   * @param fromIndex Source index
   * @param toIndex Target index
   */
  reorderColumns: (fromIndex: number, toIndex: number) => void
  /**
   * Get a column config
   * @param prop Column key
   * @returns Column config
   */
  getColumnConfig: (prop: string) => ColumnOption<T> | undefined
  /**
   * Get all column configs
   * @returns All column configs
   */
  getAllColumns: () => ColumnOption<T>[]
  /**
   * Reset all columns
   */
  resetColumns: () => void
}

export function useTableColumns<T = any>(
  columnsFactory: () => ColumnOption<T>[]
): {
  columns: any
  columnChecks: any
} & DynamicColumnConfig<T> {
  const dynamicColumns = ref<ColumnOption<T>[]>(columnsFactory())
  const columnChecks = ref<ColumnOption<T>[]>(getColumnChecks(dynamicColumns.value))

  // When dynamicColumns changes, rebuild columnChecks but keep existing checked state
  watch(
    dynamicColumns,
    (newCols) => {
      const checkedMap = new Map(
        columnChecks.value.map((c) => [getColumnKey(c), c.checked ?? true])
      )
      const newChecks = getColumnChecks(newCols).map((c) => ({
        ...c,
        checked: checkedMap.has(getColumnKey(c)) ? checkedMap.get(getColumnKey(c)) : c.checked
      }))
      columnChecks.value = newChecks
    },
    { deep: true }
  )

  // Currently visible columns (based on columnChecks.checked)
  const columns = computed(() => {
    const colMap = new Map(dynamicColumns.value.map((c) => [getColumnKey(c), c]))
    return columnChecks.value
      .filter((c) => c.checked)
      .map((c) => colMap.get(getColumnKey(c)))
      .filter(Boolean) as ColumnOption<T>[]
  })

  // Support updater returning new array or mutating input array
  const setDynamicColumns = (updater: (cols: ColumnOption<T>[]) => void | ColumnOption<T>[]) => {
    const copy = [...dynamicColumns.value]
    const result = updater(copy)
    dynamicColumns.value = Array.isArray(result) ? result : copy
  }

  return {
    columns,
    columnChecks,

    addColumn: (column: ColumnOption<T>, index?: number) =>
      setDynamicColumns((cols) => {
        const next = [...cols]
        if (typeof index === 'number' && index >= 0 && index <= next.length) {
          next.splice(index, 0, column)
        } else {
          next.push(column)
        }
        return next
      }),

    removeColumn: (prop: string) =>
      setDynamicColumns((cols) => cols.filter((c) => getColumnKey(c) !== prop)),

    updateColumn: (prop: string, updates: Partial<ColumnOption<T>>) =>
      setDynamicColumns((cols) =>
        cols.map((c) => (getColumnKey(c) === prop ? { ...c, ...updates } : c))
      ),

    toggleColumn: (prop: string, visible?: boolean) => {
      const i = columnChecks.value.findIndex((c) => getColumnKey(c) === prop)
      if (i > -1) {
        const next = [...columnChecks.value]
        next[i] = { ...next[i], checked: visible ?? !next[i].checked }
        columnChecks.value = next
      }
    },

    resetColumns: () => {
      dynamicColumns.value = columnsFactory()
    },

    batchUpdateColumns: (updates) =>
      setDynamicColumns((cols) => {
        const map = new Map(updates.map((u) => [u.prop, u.updates]))
        return cols.map((c) => {
          const key = getColumnKey(c)
          const upd = map.get(key)
          return upd ? { ...c, ...upd } : c
        })
      }),

    reorderColumns: (fromIndex: number, toIndex: number) =>
      setDynamicColumns((cols) => {
        if (
          fromIndex < 0 ||
          fromIndex >= cols.length ||
          toIndex < 0 ||
          toIndex >= cols.length ||
          fromIndex === toIndex
        ) {
          return cols
        }
        const next = [...cols]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      }),

    getColumnConfig: (prop: string) => dynamicColumns.value.find((c) => getColumnKey(c) === prop),

    getAllColumns: () => [...dynamicColumns.value]
  }
}
