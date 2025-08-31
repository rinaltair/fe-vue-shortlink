/**
 * Storage configuration management
 * Centralizes constants and options related to storage
 */
export class StorageConfig {
  /** Current application version */
  static readonly CURRENT_VERSION = __APP_VERSION__

  /** Storage key prefix */
  static readonly STORAGE_PREFIX = 'sys-v'

  /** Version key name */
  static readonly VERSION_KEY = 'sys-version'

  /** Version that skips upgrade checks */
  static readonly SKIP_UPGRADE_VERSION = '1.0.0'

  /** Upgrade processing delay (ms) */
  static readonly UPGRADE_DELAY = 1000

  /** Logout delay (ms) */
  static readonly LOGOUT_DELAY = 1000

  /**
   * Generate a versioned storage key
   * @param storeId Storage ID
   * @param version Version; defaults to current version
   */
  static generateStorageKey(storeId: string, version: string = this.CURRENT_VERSION): string {
    return `${this.STORAGE_PREFIX}${version}-${storeId}`
  }

  /**
   * Generate legacy storage key (without separator)
   * @param version Version; defaults to current version
   */
  static generateLegacyKey(version: string = this.CURRENT_VERSION): string {
    return `${this.STORAGE_PREFIX}${version}`
  }

  /**
   * Create a regex to match storage keys
   * @param storeId Storage ID
   */
  static createKeyPattern(storeId: string): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}[^-]+-${storeId}$`)
  }

  /**
   * Create a regex to match current-version storage keys
   */
  static createCurrentVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}${this.CURRENT_VERSION}-`)
  }

  /**
   * Create a regex to match any versioned storage key
   */
  static createVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}`)
  }

  /**
   * Check if key is for current version
   */
  static isCurrentVersionKey(key: string): boolean {
    return key.startsWith(`${this.STORAGE_PREFIX}${this.CURRENT_VERSION}`)
  }

  /**
   * Check if key is versioned
   */
  static isVersionedKey(key: string): boolean {
    return key.startsWith(this.STORAGE_PREFIX)
  }

  /**
   * Extract version from a storage key
   */
  static extractVersionFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}([^-]+)`))
    return match ? match[1] : null
  }

  /**
   * Extract storage ID from a storage key
   */
  static extractStoreIdFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}[^-]+-(.+)$`))
    return match ? match[1] : null
  }
}
