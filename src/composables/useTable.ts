import { ref, reactive, computed, onMounted, onUnmounted, nextTick, readonly } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useTableColumns } from './useTableColumns'
import type { ColumnOption } from '@/types/component'
import { TableCache, CacheInvalidationStrategy, type ApiResponse } from '../utils/table/tableCache'
import {
  type BaseRequestParams,
  type TableError,
  defaultResponseAdapter,
  extractTableData,
  updatePaginationFromResponse,
  createSmartDebounce,
  createErrorHandler
} from '../utils/table/tableUtils'

// Optimized config interface - grouped by concern
export interface UseTableConfig<
  T = unknown,
  P extends BaseRequestParams = BaseRequestParams,
  R = any
> {
  // Core config
  core: {
    /** API request function */
    apiFn: (params: P) => Promise<R>
    /** Default request params */
    apiParams?: Partial<P>
    /** Exclude keys from apiParams */
    excludeParams?: (keyof P)[]
    /** Load immediately */
    immediate?: boolean
    /** Column config factory */
    columnsFactory?: () => ColumnOption<T>[]
    /** Custom pagination field mapping */
    paginationKey?: {
      /** Current page key (default 'current') */
      current?: string
      /** Page size key (default 'size') */
      size?: string
    }
  }

  // Data processing
  transform?: {
    /** Data transformer */
    dataTransformer?: (data: unknown) => T[]
    /** Response adapter */
    responseAdapter?: (response: R) => ApiResponse<T>
  }

  // Performance
  performance?: {
    /** Enable cache */
    enableCache?: boolean
    /** Cache time (ms) */
    cacheTime?: number
    /** Debounce delay (ms) */
    debounceTime?: number
    /** Max cache entries */
    maxCacheSize?: number
  }

  // Lifecycle hooks
  hooks?: {
    /** On success (only when network request succeeds) */
    onSuccess?: (data: T[], response: ApiResponse<T>) => void
    /** On error */
    onError?: (error: TableError) => void
    /** On cache hit (when using cached data) */
    onCacheHit?: (data: T[], response: ApiResponse<T>) => void
    /** On loading state change */
    onLoading?: (loading: boolean) => void
    /** On reset form */
    resetFormCallback?: () => void
  }

  // Debug config
  debug?: {
    /** Enable log */
    enableLog?: boolean
    /** Log level */
    logLevel?: 'info' | 'warn' | 'error'
  }
}

/**
 * useTable - Powerful table data management hook
 *
 * Provides a complete table solution, including:
 * - Data fetching and caching
 * - Pagination control
 * - Search
 * - Smart refresh strategies
 * - Error handling
 * - Column config management
 */
export function useTable<T = unknown, P extends BaseRequestParams = BaseRequestParams, R = any>(
  config: UseTableConfig<T, P, R>
) {
  const {
    core: {
      apiFn,
      apiParams = {} as Partial<P>,
      excludeParams = [],
      immediate = true,
      columnsFactory,
      paginationKey = { current: 'current', size: 'size' }
    },
    transform: { dataTransformer, responseAdapter = defaultResponseAdapter } = {},
    performance: {
      enableCache = false,
      cacheTime = 5 * 60 * 1000,
      debounceTime = 300,
      maxCacheSize = 50
    } = {},
    hooks: { onSuccess, onError, onCacheHit, resetFormCallback } = {},
    debug: { enableLog = false } = {}
  } = config

  // Pagination field keys
  const pageKey = paginationKey?.current || 'current'
  const sizeKey = paginationKey?.size || 'size'

  // Reactive trigger to update cache stats manually
  const cacheUpdateTrigger = ref(0)

  // Logger helpers
  const logger = {
    log: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.log(`[useTable] ${message}`, ...args)
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.warn(`[useTable] ${message}`, ...args)
      }
    },
    error: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.error(`[useTable] ${message}`, ...args)
      }
    }
  }

  // Cache instance
  const cache = enableCache ? new TableCache<T>(cacheTime, maxCacheSize, enableLog) : null

  // Loading state
  const loading = ref(false)

  // Error state
  const error = ref<TableError | null>(null)

  // Table data
  const data = ref<T[]>([])

  // Abort controller
  let abortController: AbortController | null = null

  // Cache cleanup timer
  let cacheCleanupTimer: NodeJS.Timeout | null = null

  // Search params
  const searchParams = reactive(
    Object.assign(
      {
        [pageKey]: 1,
        [sizeKey]: 10
      },
      apiParams || {}
    ) as P
  )

  // Pagination config
  const pagination = reactive<Api.Common.PaginatingParams>({
    current: (searchParams as any)[pageKey] || 1,
    size: (searchParams as any)[sizeKey] || 10,
    total: 0
  })

  // Mobile pagination (responsive)
  const { width } = useWindowSize()
  const mobilePagination = computed(() => ({
    ...pagination,
    small: width.value < 768
  }))

  // Column config
  const columnConfig = columnsFactory ? useTableColumns<T>(columnsFactory) : null
  const columns = columnConfig?.columns
  const columnChecks = columnConfig?.columnChecks

  // Has data
  const hasData = computed(() => data.value.length > 0)

  // Cache statistics
  const cacheInfo = computed(() => {
    // Depend on trigger to recompute on cache change
    void cacheUpdateTrigger.value
    if (!cache) return { total: 0, size: '0KB', hitRate: '0 avg hits' }
    return cache.getStats()
  })

  // Error handler
  const handleError = createErrorHandler(onError, enableLog)

  // Clear cache selectively for different scenarios
  const clearCache = (strategy: CacheInvalidationStrategy, context?: string): void => {
    if (!cache) return

    let clearedCount = 0

    switch (strategy) {
      case CacheInvalidationStrategy.CLEAR_ALL:
        cache.clear()
        logger.log(`Cleared all cache - ${context || ''}`)
        break

      case CacheInvalidationStrategy.CLEAR_CURRENT:
        clearedCount = cache.clearCurrentSearch(searchParams)
        logger.log(`Cleared current search cache ${clearedCount} items - ${context || ''}`)
        break

      case CacheInvalidationStrategy.CLEAR_PAGINATION:
        clearedCount = cache.clearPagination()
        logger.log(`Cleared pagination cache ${clearedCount} items - ${context || ''}`)
        break

      case CacheInvalidationStrategy.KEEP_ALL:
      default:
        logger.log(`Kept cache unchanged - ${context || ''}`)
        break
    }
    // Manually bump cache update trigger
    cacheUpdateTrigger.value++
  }

  // Core method to fetch data
  const fetchData = async (
    params?: Partial<P>,
    useCache = enableCache
  ): Promise<ApiResponse<T>> => {
    // Cancel previous request
    if (abortController) {
      abortController.abort()
    }

    // Create a new abort controller
    const currentController = new AbortController()
    abortController = currentController

    loading.value = true
    error.value = null

    try {
      let requestParams = Object.assign(
        {},
        searchParams,
        {
          [pageKey]: pagination.current,
          [sizeKey]: pagination.size
        },
        params || {}
      ) as P

      // Strip excluded params
      if (excludeParams.length > 0) {
        const filteredParams = { ...requestParams }
        excludeParams.forEach((key) => {
          delete (filteredParams as any)[key]
        })
        requestParams = filteredParams as P
      }

      // Check cache
      if (useCache && cache) {
        const cachedItem = cache.get(requestParams)
        if (cachedItem) {
          data.value = cachedItem.data
          updatePaginationFromResponse(pagination, cachedItem.response)

          // Avoid resetting same values to prevent reactive loops
          if ((searchParams as any)[pageKey] !== pagination.current) {
            ;(searchParams as any)[pageKey] = pagination.current
          }
          if ((searchParams as any)[sizeKey] !== pagination.size) {
            ;(searchParams as any)[sizeKey] = pagination.size
          }

          loading.value = false

          // On cache hit, trigger dedicated callback (not onSuccess)
          if (onCacheHit) {
            onCacheHit(cachedItem.data, cachedItem.response)
          }

          logger.log(`Cache hit`)
          return cachedItem.response
        }
      }

      const response = await apiFn(requestParams)

      // Check if request was cancelled
      if (currentController.signal.aborted) {
        throw new Error('Request cancelled')
      }

      // Adapt response to standard format
      const standardResponse = responseAdapter(response)

      // Process response data
      let tableData = extractTableData(standardResponse)

      // Apply data transformer
      if (dataTransformer) {
        tableData = dataTransformer(tableData)
      }

      // Update state
      data.value = tableData
      updatePaginationFromResponse(pagination, standardResponse)

      // Avoid resetting same values to prevent reactive loops
      if ((searchParams as any)[pageKey] !== pagination.current) {
        ;(searchParams as any)[pageKey] = pagination.current
      }
      if ((searchParams as any)[sizeKey] !== pagination.size) {
        ;(searchParams as any)[sizeKey] = pagination.size
      }

      // Cache data
      if (useCache && cache) {
        cache.set(requestParams, tableData, standardResponse)
        // Manually bump cache update trigger
        cacheUpdateTrigger.value++
        logger.log(`Data cached`)
      }

      // Success callback
      if (onSuccess) {
        onSuccess(tableData, standardResponse)
      }

      return standardResponse
    } catch (err) {
      if (err instanceof Error && err.message === 'Request cancelled') {
        // Request cancelled; ignore
        return { records: [], total: 0, current: 1, size: 10 }
      }

      data.value = []
      const tableError = handleError(err, 'Failed to fetch table data')
      throw tableError
    } finally {
      loading.value = false
      // Only clear abortController if still current
      if (abortController === currentController) {
        abortController = null
      }
    }
  }

  // Fetch data (keep current page)
  const getData = async (params?: Partial<P>): Promise<ApiResponse<T> | void> => {
    try {
      return await fetchData(params)
    } catch {
      // Errors handled in fetchData
      return Promise.resolve()
    }
  }

  // Fetch with pagination reset to first page (search)
  const getDataByPage = async (params?: Partial<P>): Promise<ApiResponse<T> | void> => {
    pagination.current = 1
    ;(searchParams as any)[pageKey] = 1

    // Clear cache for current search to ensure fresh data
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Search data')

    try {
      return await fetchData(params, false) // Do not use cache for search
    } catch {
      // Errors handled in fetchData
      return Promise.resolve()
    }
  }

  // Debounced search helper
  const debouncedGetDataByPage = createSmartDebounce(getDataByPage, debounceTime)

  // Reset search params
  const resetSearchParams = async (): Promise<void> => {
    // Cancel debounced search
    debouncedGetDataByPage.cancel()

    // Save pagination defaults
    const defaultPagination = {
      [pageKey]: 1,
      [sizeKey]: (searchParams as any)[sizeKey] || 10
    }

    // Clear all search params
    Object.keys(searchParams).forEach((key) => {
      delete (searchParams as Record<string, any>)[key]
    })

    // Reset defaults
    Object.assign(searchParams, apiParams || {}, defaultPagination)

    // Reset pagination
    pagination.current = 1
    pagination.size = (defaultPagination as any)[sizeKey]

    // Clear error state
    error.value = null

    // Clear cache
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, 'Reset search')

    // Refetch data
    await getData()

    // Run reset callback
    if (resetFormCallback) {
      await nextTick()
      resetFormCallback()
    }
  }

  // Prevent duplicate invocation flag
  let isCurrentChanging = false

  // Handle page size change
  const handleSizeChange = async (newSize: number): Promise<void> => {
    if (newSize <= 0) return

    debouncedGetDataByPage.cancel()

    pagination.size = newSize
    pagination.current = 1
    ;(searchParams as any)[sizeKey] = newSize
    ;(searchParams as any)[pageKey] = 1

    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Page size change')

    await getData()
  }

  // Handle current page change
  const handleCurrentChange = async (newCurrent: number): Promise<void> => {
    if (newCurrent <= 0) return

    // Avoid duplicate calls
    if (isCurrentChanging) {
      return
    }

    // If page unchanged, skip request
    if (pagination.current === newCurrent) {
      logger.log('Page number unchanged; skip request')
      return
    }

    try {
      isCurrentChanging = true

      // Only update necessary state
      pagination.current = newCurrent
      // Only update when pagination field differs
      if ((searchParams as any)[pageKey] !== newCurrent) {
        ;(searchParams as any)[pageKey] = newCurrent
      }

      await getData()
    } finally {
      isCurrentChanging = false
    }
  }

  // Refresh methods for different scenarios

  // After create: go to first page and clear pagination cache
  const refreshCreate = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    pagination.current = 1
    ;(searchParams as any)[pageKey] = 1
    clearCache(CacheInvalidationStrategy.CLEAR_PAGINATION, 'Create data')
    await getData()
  }

  // After update: keep current page; clear current search cache
  const refreshUpdate = async (): Promise<void> => {
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Edit data')
    await getData()
  }

  // After remove: adjust page smartly to avoid empty screen
  const refreshRemove = async (): Promise<void> => {
    const { total, size, current } = pagination
    const totalPage = Math.max(1, Math.ceil(total / size))
    const isLastPage = current === totalPage
    const isSingleItemPage = data.value.length === 1
    const isEmptyLastPage = isLastPage && data.value.length === 0

    // If single item on page (not first) or empty last page -> go to previous page
    if ((isSingleItemPage && current > 1) || isEmptyLastPage) {
      pagination.current -= 1
      ;(searchParams as any)[pageKey] = pagination.current
    }

    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Delete data')
    await getData()
  }

  // Full refresh: clear all cache and refetch (manual)
  const refreshData = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, 'Manual refresh')
    await getData()
  }

  // Soft refresh: clear current search cache; keep pagination (scheduled)
  const refreshSoft = async (): Promise<void> => {
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Soft refresh')
    await getData()
  }

  // Cancel current request
  const cancelRequest = (): void => {
    if (abortController) {
      abortController.abort()
    }
    debouncedGetDataByPage.cancel()
  }

  // Clear data
  const clearData = (): void => {
    data.value = []
    error.value = null
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, 'Clear data')
  }

  // Cleanup expired cache entries
  const clearExpiredCache = (): number => {
    if (!cache) return 0
    const cleanedCount = cache.cleanupExpired()
    if (cleanedCount > 0) {
      // Manually bump cache update trigger
      cacheUpdateTrigger.value++
    }
    return cleanedCount
  }

  // Set periodic cleanup for expired cache
  if (enableCache && cache) {
    cacheCleanupTimer = setInterval(() => {
      const cleanedCount = cache.cleanupExpired()
      if (cleanedCount > 0) {
        logger.log(`Auto cleaned ${cleanedCount} expired cache entries`)
        // Manually bump cache update trigger
        cacheUpdateTrigger.value++
      }
    }, cacheTime / 2) // Clean up every half cache period
  }

  // Auto-load on mount
  if (immediate) {
    onMounted(async () => {
      await getData()
    })
  }

  // Cleanup thoroughly on unmount
  onUnmounted(() => {
    cancelRequest()
    if (cache) {
      cache.clear()
    }
    if (cacheCleanupTimer) {
      clearInterval(cacheCleanupTimer)
    }
  })

  // Optimized return structure
  return {
    // Data
    /** Table data */
    data,
    /** Loading state */
    loading: readonly(loading),
    /** Error state */
    error: readonly(error),
    /** Whether data is empty */
    isEmpty: computed(() => data.value.length === 0),
    /** Whether there is data */
    hasData,

    // Pagination
    /** Pagination state */
    pagination: readonly(pagination),
    /** Mobile pagination config */
    paginationMobile: mobilePagination,
    /** Handle page size change */
    handleSizeChange,
    /** Handle current page change */
    handleCurrentChange,

    // Search
    /** Search params */
    searchParams,
    /** Reset search params */
    resetSearchParams,

    // Data operations
    /** Load data */
    fetchData: getData,
    /** Get data */
    getData: getDataByPage,
    /** Get data (debounced) */
    getDataDebounced: debouncedGetDataByPage,
    /** Clear data */
    clearData,

    // Refresh strategies
    /** Full refresh: clear all cache and refetch (manual) */
    refreshData,
    /** Soft refresh: clear current search cache, keep pagination (scheduled) */
    refreshSoft,
    /** After create: go to first page and clear pagination cache */
    refreshCreate,
    /** After update: keep current page and clear current search cache */
    refreshUpdate,
    /** After remove: adjust page smartly to avoid empty screen */
    refreshRemove,

    // Cache control
    /** Cache statistics */
    cacheInfo,
    /** Clear cache selectively depending on scenario */
    clearCache,
    // Supported strategies:
    // CLEAR_ALL, CLEAR_CURRENT, CLEAR_PAGINATION, KEEP_ALL
    /** Clear expired cache items */
    clearExpiredCache,

    // Request control
    /** Cancel current request */
    cancelRequest,

    // Column config (if columnsFactory provided)
    ...(columnConfig && {
      /** Table column config */
      columns,
      /** Column visibility control */
      columnChecks,
      /** Add column */
      addColumn: columnConfig.addColumn,
      /** Remove column */
      removeColumn: columnConfig.removeColumn,
      /** Toggle column visibility */
      toggleColumn: columnConfig.toggleColumn,
      /** Update column config */
      updateColumn: columnConfig.updateColumn,
      /** Batch update columns */
      batchUpdateColumns: columnConfig.batchUpdateColumns,
      /** Reorder columns */
      reorderColumns: columnConfig.reorderColumns,
      /** Get specific column config */
      getColumnConfig: columnConfig.getColumnConfig,
      /** Get all column configs */
      getAllColumns: columnConfig.getAllColumns,
      /** Reset all columns to default */
      resetColumns: columnConfig.resetColumns
    })
  }
}

// Re-export types and enums for convenience
export { CacheInvalidationStrategy } from '../utils/table/tableCache'
export type { ApiResponse, CacheItem } from '../utils/table/tableCache'
export type { BaseRequestParams, TableError } from '../utils/table/tableUtils'
