// Table cache management

// Cache invalidation strategies
export enum CacheInvalidationStrategy {
  /** Clear all cache */
  CLEAR_ALL = 'clear_all',
  /** Clear only current search cache */
  CLEAR_CURRENT = 'clear_current',
  /** Clear all pagination cache (keep other search caches) */
  CLEAR_PAGINATION = 'clear_pagination',
  /** Keep all cache */
  KEEP_ALL = 'keep_all'
}

// Generic API response (compatible with multiple backend formats)
export interface ApiResponse<T = unknown> {
  records?: T[]
  data?: T[]
  total?: number
  current?: number
  size?: number
  [key: string]: unknown
}

// Cache item interface
export interface CacheItem<T> {
  data: T[]
  response: ApiResponse<T>
  timestamp: number
  params: string
  // Cache tags for grouping
  tags: Set<string>
  // Access count (for LRU)
  accessCount: number
  // Last access time
  lastAccessTime: number
}

// Enhanced cache manager
export class TableCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private cacheTime: number
  private maxSize: number
  private enableLog: boolean

  constructor(cacheTime = 5 * 60 * 1000, maxSize = 50, enableLog = false) {
    // Default: 5 minutes, up to 50 entries
    this.cacheTime = cacheTime
    this.maxSize = maxSize
    this.enableLog = enableLog
  }

  // Internal logger
  private log(message: string, ...args: any[]) {
    if (this.enableLog) {
      console.log(`[TableCache] ${message}`, ...args)
    }
  }

  // 🔧 Generate stable cache key
  private generateKey(params: unknown): string {
    if (!params || typeof params !== 'object') {
      return JSON.stringify(params)
    }

    // Sort object keys then stringify to stabilize keys
    const sortedParams = this.sortObjectKeys(params as Record<string, unknown>)
    return JSON.stringify(sortedParams)
  }

  // Recursively sort object keys
  private sortObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    const keys = Object.keys(obj).sort()

    for (const key of keys) {
      const value = obj[key]
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.sortObjectKeys(value as Record<string, unknown>)
      } else {
        result[key] = value
      }
    }

    return result
  }

  // 🔧 Enhance type safety
  private generateTags(params: Record<string, unknown>): Set<string> {
    const tags = new Set<string>()

    // Add search tags
    const searchKeys = Object.keys(params).filter(
      (key) =>
        !['current', 'size', 'total'].includes(key) &&
        params[key] !== undefined &&
        params[key] !== '' &&
        params[key] !== null
    )

    if (searchKeys.length > 0) {
      const searchTag = searchKeys.map((key) => `${key}:${String(params[key])}`).join('|')
      tags.add(`search:${searchTag}`)
    } else {
      tags.add('search:default')
    }

    // Add pagination tag
    tags.add(`pagination:${params.size || 10}`)
    // Add generic pagination tag for clearing
    tags.add('pagination')

    return tags
  }

  // 🔧 LRU eviction
  private evictLRU(): void {
    if (this.cache.size <= this.maxSize) return

    // Find least-used entry
    let lruKey = ''
    let minAccessCount = Infinity
    let oldestTime = Infinity

    for (const [key, item] of this.cache.entries()) {
      if (
        item.accessCount < minAccessCount ||
        (item.accessCount === minAccessCount && item.lastAccessTime < oldestTime)
      ) {
        lruKey = key
        minAccessCount = item.accessCount
        oldestTime = item.lastAccessTime
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
      this.log(`LRU evicted cache: ${lruKey}`)
    }
  }

  // Set cache
  set(params: unknown, data: T[], response: ApiResponse<T>): void {
    const key = this.generateKey(params)
    const tags = this.generateTags(params as Record<string, unknown>)
    const now = Date.now()

    // Check for eviction
    this.evictLRU()

    this.cache.set(key, {
      data,
      response,
      timestamp: now,
      params: key,
      tags,
      accessCount: 1,
      lastAccessTime: now
    })
  }

  // Get cache
  get(params: unknown): CacheItem<T> | null {
    const key = this.generateKey(params)
    const item = this.cache.get(key)

    if (!item) return null

    // Expiration check
    if (Date.now() - item.timestamp > this.cacheTime) {
      this.cache.delete(key)
      return null
    }

    // Update access stats
    item.accessCount++
    item.lastAccessTime = Date.now()

    return item
  }

  // Clear cache by tags
  clearByTags(tags: string[]): number {
    let clearedCount = 0

    for (const [key, item] of this.cache.entries()) {
      // Check if has any matching tag
      const hasMatchingTag = tags.some((tag) =>
        Array.from(item.tags).some((itemTag) => itemTag.includes(tag))
      )

      if (hasMatchingTag) {
        this.cache.delete(key)
        clearedCount++
      }
    }

    return clearedCount
  }

  // Clear current search cache
  clearCurrentSearch(params: unknown): number {
    const key = this.generateKey(params)
    const deleted = this.cache.delete(key)
    return deleted ? 1 : 0
  }

  // Clear pagination cache
  clearPagination(): number {
    return this.clearByTags(['pagination'])
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache stats
  getStats(): { total: number; size: string; hitRate: string } {
    const total = this.cache.size
    let totalSize = 0
    let totalAccess = 0

    for (const item of this.cache.values()) {
      // Rough size estimate (JSON string length)
      totalSize += JSON.stringify(item.data).length
      totalAccess += item.accessCount
    }

    // Human-readable size
    const sizeInKB = (totalSize / 1024).toFixed(2)
    const avgHits = total > 0 ? (totalAccess / total).toFixed(1) : '0'

    return {
      total,
      size: `${sizeInKB}KB`,
      hitRate: `${avgHits} avg hits`
    }
  }

  // Cleanup expired cache
  cleanupExpired(): number {
    let cleanedCount = 0
    const now = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.cacheTime) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }
}
