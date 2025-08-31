import { useSettingStore } from '@/store/modules/setting'
import { Router } from 'vue-router'
import NProgress from 'nprogress'

/** Global afterEach route guard */
export function setupAfterEachGuard(router: Router) {
  router.afterEach(() => {
    if (useSettingStore().showNprogress) NProgress.done()
  })
}
