import { upgradeLogList } from '@/mock/upgrade/changeLog'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { StorageConfig } from '@/utils/storage/storage-config'

/**
 * Version manager
 * Handles version comparison, upgrade checks, and data cleanup
 */
class VersionManager {
  /**
   * Normalize version string by removing leading 'v'
   */
  private normalizeVersion(version: string): string {
    return version.replace(/^v/, '')
  }

  /**
   * Get stored version number
   */
  private getStoredVersion(): string | null {
    return localStorage.getItem(StorageConfig.VERSION_KEY)
  }

  /**
   * Set version number in storage
   */
  private setStoredVersion(version: string): void {
    localStorage.setItem(StorageConfig.VERSION_KEY, version)
  }

  /**
   * Check whether to skip upgrade handling
   */
  private shouldSkipUpgrade(): boolean {
    return StorageConfig.CURRENT_VERSION === StorageConfig.SKIP_UPGRADE_VERSION
  }

  /**
   * Check if this is the first visit
   */
  private isFirstVisit(storedVersion: string | null): boolean {
    return !storedVersion
  }

  /**
   * Check if versions are the same
   */
  private isSameVersion(storedVersion: string): boolean {
    return storedVersion === StorageConfig.CURRENT_VERSION
  }

  /**
   * Find legacy storage structures
   */
  private findLegacyStorage(): { oldSysKey: string | null; oldVersionKeys: string[] } {
    const storageKeys = Object.keys(localStorage)
    const currentVersionPrefix = StorageConfig.generateStorageKey('').slice(0, -1) // remove trailing '-'

    // Find legacy single-key storage
    const oldSysKey =
      storageKeys.find(
        (key) =>
          StorageConfig.isVersionedKey(key) && key !== currentVersionPrefix && !key.includes('-')
      ) || null

    // Find legacy version-separated storage keys
    const oldVersionKeys = storageKeys.filter(
      (key) =>
        StorageConfig.isVersionedKey(key) &&
        !StorageConfig.isCurrentVersionKey(key) &&
        key.includes('-')
    )

    return { oldSysKey, oldVersionKeys }
  }

  /**
   * Check if re-login is required
   */
  private shouldRequireReLogin(storedVersion: string): boolean {
    const normalizedCurrent = this.normalizeVersion(StorageConfig.CURRENT_VERSION)
    const normalizedStored = this.normalizeVersion(storedVersion)

    return upgradeLogList.value.some((item) => {
      const itemVersion = this.normalizeVersion(item.version)
      return (
        item.requireReLogin && itemVersion > normalizedStored && itemVersion <= normalizedCurrent
      )
    })
  }

  /**
   * Build upgrade notification message
   */
  private buildUpgradeMessage(requireReLogin: boolean): string {
    const { title: content } = upgradeLogList.value[0]

    const messageParts = [
      `<p style="color: var(--art-gray-text-800) !important; padding-bottom: 5px;">`,
      `System upgraded to ${StorageConfig.CURRENT_VERSION}. Improvements include:`,
      `</p>`,
      content
    ]

    if (requireReLogin) {
      messageParts.push(
        `<p style="color: var(--main-color); padding-top: 5px;">Upgrade complete. Please log in again to continue.</p>`
      )
    }

    return messageParts.join('')
  }

  /**
   * Show upgrade notification
   */
  private showUpgradeNotification(message: string): void {
    ElNotification({
      title: 'System Upgrade Notice',
      message,
      duration: 0,
      type: 'success',
      dangerouslyUseHTMLString: true
    })
  }

  /**
   * Clean up legacy data
   */
  private cleanupLegacyData(oldSysKey: string | null, oldVersionKeys: string[]): void {
    // Clean legacy single-key storage
    if (oldSysKey) {
      localStorage.removeItem(oldSysKey)
      console.info(`[Upgrade] Cleared legacy storage: ${oldSysKey}`)
    }

    // Clean legacy version-separated storage
    oldVersionKeys.forEach((key) => {
      localStorage.removeItem(key)
      console.info(`[Upgrade] Cleared legacy storage: ${key}`)
    })
  }

  /**
   * Perform logout after upgrade
   */
  private performLogout(): void {
    try {
      useUserStore().logOut()
      console.info('[Upgrade] Performed post-upgrade logout')
    } catch (error) {
      console.error('[Upgrade] Post-upgrade logout failed:', error)
    }
  }

  /**
   * Execute upgrade flow
   */
  private async executeUpgrade(
    storedVersion: string,
    legacyStorage: ReturnType<typeof this.findLegacyStorage>
  ): Promise<void> {
    try {
      if (!upgradeLogList.value.length) {
        console.warn('[Upgrade] Upgrade log list is empty')
        return
      }

      const requireReLogin = this.shouldRequireReLogin(storedVersion)
      const message = this.buildUpgradeMessage(requireReLogin)

      // Show upgrade notification
      this.showUpgradeNotification(message)

      // Update version number
      this.setStoredVersion(StorageConfig.CURRENT_VERSION)

      // Clean up old data
      this.cleanupLegacyData(legacyStorage.oldSysKey, legacyStorage.oldVersionKeys)

      // Perform logout (if needed)
      if (requireReLogin) {
        this.performLogout()
      }

      console.info(
        `[Upgrade] Upgrade complete: ${storedVersion} → ${StorageConfig.CURRENT_VERSION}`
      )
    } catch (error) {
      console.error('[Upgrade] System upgrade processing failed:', error)
    }
  }

  /**
   * Main system upgrade process
   */
  async processUpgrade(): Promise<void> {
    // Skip specific version
    if (this.shouldSkipUpgrade()) {
      console.debug('[Upgrade] Skip version upgrade check')
      return
    }

    const storedVersion = this.getStoredVersion()

    // First-visit handling
    if (this.isFirstVisit(storedVersion)) {
      this.setStoredVersion(StorageConfig.CURRENT_VERSION)
      console.info('[Upgrade] First visit; set current version')
      return
    }

    // Same version; no upgrade needed
    if (this.isSameVersion(storedVersion!)) {
      // console.debug('[Upgrade] Same version; no upgrade needed')
      return
    }

    // Check for legacy data requiring upgrade
    const legacyStorage = this.findLegacyStorage()
    if (!legacyStorage.oldSysKey && legacyStorage.oldVersionKeys.length === 0) {
      this.setStoredVersion(StorageConfig.CURRENT_VERSION)
      console.info('[Upgrade] No legacy data; version updated')
      return
    }

    // Delay upgrade to ensure the app is fully loaded
    setTimeout(() => {
      this.executeUpgrade(storedVersion!, legacyStorage)
    }, StorageConfig.UPGRADE_DELAY)
  }
}

// Create version manager instance
const versionManager = new VersionManager()

/**
 * System upgrade entry function
 */
export async function systemUpgrade(): Promise<void> {
  await versionManager.processUpgrade()
}
