import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { ElLoading } from 'element-plus'

const DEFAULT_LOADING_CONFIG = {
  lock: true,
  background: 'rgba(0, 0, 0, 0)',
  svg: fourDotsSpinnerSvg,
  svgViewBox: '0 0 40 40',
  customClass: 'art-loading-fix'
} as const

interface LoadingInstance {
  close: () => void
}

let loadingInstance: LoadingInstance | null = null

export const loadingService = {
  /**
   * Show loading
   * @returns Function to hide loading
   */
  showLoading(): () => void {
    if (!loadingInstance) {
      loadingInstance = ElLoading.service(DEFAULT_LOADING_CONFIG)
    }
    return () => this.hideLoading()
  },

  /**
   * Hide loading
   */
  hideLoading(): void {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}
