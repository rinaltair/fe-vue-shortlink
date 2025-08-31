import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { useUserStore } from '@/store/modules/user'
import { StorageConfig } from '@/utils/storage/storage-config'
import { RoutesAlias } from '@/router/routesAlias'

/**
 * Storage compatibility manager
 * Handles storage compatibility checks and data validation across versions
 */
class StorageCompatibilityManager {
  /**
   * Get system version
   */
  getSystemVersion(): string | null {
    return localStorage.getItem(StorageConfig.VERSION_KEY)
  }

  /**
   * Get system storage (compatible with legacy format)
   */
  getSystemStorage(): any {
    const version = this.getSystemVersion() || StorageConfig.CURRENT_VERSION
    const legacyKey = StorageConfig.generateLegacyKey(version)
    const data = localStorage.getItem(legacyKey)
    return data ? JSON.parse(data) : null
  }

  /**
   * Check whether current version has storage data
   */
  private hasCurrentVersionStorage(): boolean {
    const storageKeys = Object.keys(localStorage)
    const currentVersionPattern = StorageConfig.createCurrentVersionPattern()

    return storageKeys.some(
      (key) => currentVersionPattern.test(key) && localStorage.getItem(key) !== null
    )
  }

  /**
   * Check whether any versioned storage data exists
   */
  private hasAnyVersionStorage(): boolean {
    const storageKeys = Object.keys(localStorage)
    const versionPattern = StorageConfig.createVersionPattern()

    return storageKeys.some((key) => versionPattern.test(key) && localStorage.getItem(key) !== null)
  }

  /**
   * Get local storage data in legacy format
   */
  private getLegacyStorageData(): Record<string, any> {
    try {
      const systemStorage = this.getSystemStorage()
      return systemStorage || {}
    } catch (error) {
      console.warn('[Storage] Failed to parse legacy storage data:', error)
      return {}
    }
  }

  /**
   * Show storage error message
   */
  private showStorageError(): void {
    ElMessage({
      type: 'error',
      offset: 40,
      duration: 5000,
      message: 'The system detected abnormal local data. Please log in again to continue.'
    })
  }

  /**
   * Perform system logout
   */
  private performSystemLogout(): void {
    setTimeout(() => {
      try {
        localStorage.clear()
        useUserStore().logOut()
        router.push(RoutesAlias.Login)
        console.info('[Storage] Performed system logout')
      } catch (error) {
        console.error('[Storage] System logout failed:', error)
      }
    }, StorageConfig.LOGOUT_DELAY)
  }

  /**
   * Handle storage exceptions
   */
  private handleStorageError(): void {
    this.showStorageError()
    this.performSystemLogout()
  }

  /**
   * Check if on the login page
   */
  private isOnLoginPage(): boolean {
    return location.href.includes(RoutesAlias.Login)
  }

  /**
   * Validate integrity of storage data
   */
  validateStorageData(): boolean {
    // Skip validation on the login page
    if (this.isOnLoginPage()) {
      return true
    }

    try {
      // Prefer checking the new version storage structure
      if (this.hasCurrentVersionStorage()) {
        // console.debug('[Storage] Found current-version storage data')
        return true
      }

      // Check if any versioned storage data exists
      if (this.hasAnyVersionStorage()) {
        console.debug('[Storage] Found storage data for another version; migration may be required')
        return true
      }

      // Check the legacy storage structure
      const legacyData = this.getLegacyStorageData()
      if (Object.keys(legacyData).length === 0) {
        console.warn('[Storage] No storage data found; re-login required')
        this.performSystemLogout()
        return false
      }

      console.debug('[Storage] Found legacy storage data')
      return true
    } catch (error) {
      console.error('[Storage] Storage data validation failed:', error)
      this.handleStorageError()
      return false
    }
  }

  /**
   * Check whether storage is empty
   */
  isStorageEmpty(): boolean {
    // Check the new version storage structure
    if (this.hasCurrentVersionStorage()) {
      return false
    }

    // Check whether any versioned storage data exists
    if (this.hasAnyVersionStorage()) {
      return false
    }

    // Check the legacy storage structure
    const legacyData = this.getLegacyStorageData()
    return Object.keys(legacyData).length === 0
  }

  /**
   * Check storage compatibility
   */
  checkCompatibility(): boolean {
    try {
      const isValid = this.validateStorageData()
      const isEmpty = this.isStorageEmpty()

      if (isValid || isEmpty) {
        // console.debug('[Storage] Storage compatibility check passed')
        return true
      }

      console.warn('[Storage] Storage compatibility check failed')
      return false
    } catch (error) {
      console.error('[Storage] Compatibility check error:', error)
      return false
    }
  }
}

// Create storage compatibility manager instance
const storageManager = new StorageCompatibilityManager()

/**
 * Get system storage data
 */
export function getSystemStorage(): any {
  return storageManager.getSystemStorage()
}

/**
 * Get system version number
 */
export function getSysVersion(): string | null {
  return storageManager.getSystemVersion()
}

/**
 * Validate local storage data
 */
export function validateStorageData(): boolean {
  return storageManager.validateStorageData()
}

/**
 * Check storage compatibility
 */
export function checkStorageCompatibility(): boolean {
  return storageManager.checkCompatibility()
}
