import { StorageConfig } from '@/utils/storage'

/**
 * Storage key manager
 * Handles versioned storage key generation and data migration
 */
export class StorageKeyManager {
  /**
   * Get the current version's storage key
   */
  private getCurrentVersionKey(storeId: string): string {
    return StorageConfig.generateStorageKey(storeId)
  }

  /**
   * Check whether the current version's data exists
   */
  private hasCurrentVersionData(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  /**
   * Find same-named storage keys from other versions
   */
  private findExistingKey(storeId: string): string | null {
    const storageKeys = Object.keys(localStorage)
    const pattern = StorageConfig.createKeyPattern(storeId)

    return storageKeys.find((key) => pattern.test(key) && localStorage.getItem(key)) || null
  }

  /**
   * Migrate data from an old version to the current version
   */
  private migrateData(fromKey: string, toKey: string): void {
    try {
      const existingData = localStorage.getItem(fromKey)
      if (existingData) {
        localStorage.setItem(toKey, existingData)
        console.info(`[Storage] Migrated data: ${fromKey} → ${toKey}`)
      }
    } catch (error) {
      console.warn(`[Storage] Data migration failed: ${fromKey}`, error)
    }
  }

  /**
   * Get the persistent storage key (supports automatic data migration)
   */
  getStorageKey(storeId: string): string {
    const currentKey = this.getCurrentVersionKey(storeId)

    // Prefer the current version's data
    if (this.hasCurrentVersionData(currentKey)) {
      return currentKey
    }

    // Find and migrate data from other versions
    const existingKey = this.findExistingKey(storeId)
    if (existingKey) {
      this.migrateData(existingKey, currentKey)
    }

    return currentKey
  }
}
