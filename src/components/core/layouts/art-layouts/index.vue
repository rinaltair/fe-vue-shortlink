<!-- Layout container component -->
<template>
  <div class="layouts" :style="layoutStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/transition.scss'
  import { MenuWidth, MenuTypeEnum } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { useSettingStore } from '@/store/modules/setting'
  import { getTabConfig } from '@/utils/ui'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'ArtLayouts' })

  const settingStore = useSettingStore()
  const menuStore = useMenuStore()
  const router = useRouter()

  const { menuType, menuOpen, showWorkTab, tabStyle } = storeToRefs(settingStore)

  // Menu width change
  watchEffect(() => {
    const isOpen = menuOpen.value
    const width = isOpen ? settingStore.getMenuOpenWidth : MenuWidth.CLOSE
    menuStore.setMenuWidth(width)
  })

  // Layout styles
  const layoutStyle = computed(() => ({
    paddingLeft: paddingLeft.value,
    paddingTop: paddingTop.value
  }))

  // Left padding
  const paddingLeft = computed(() => {
    const { meta } = router.currentRoute.value
    const isFirstLevel = meta.isFirstLevel
    const type = menuType.value
    const isOpen = menuOpen.value
    const width = isOpen ? settingStore.getMenuOpenWidth : MenuWidth.CLOSE

    switch (type) {
      case MenuTypeEnum.DUAL_MENU:
        return isFirstLevel ? '80px' : `calc(${width} + 80px)`
      case MenuTypeEnum.TOP_LEFT:
        return isFirstLevel ? 0 : width
      case MenuTypeEnum.TOP:
        return 0
      default:
        return width
    }
  })

  // Top padding
  const paddingTop = computed(() => {
    const { openTop, closeTop } = getTabConfig(tabStyle.value)
    return `${showWorkTab.value ? openTop : closeTop}px`
  })
</script>
