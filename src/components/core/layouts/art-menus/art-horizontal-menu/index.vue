<!-- Horizontal menu -->
<template>
  <div class="top-menu">
    <ElMenu
      :ellipsis="true"
      mode="horizontal"
      :default-active="routerPath"
      text-color="var(--art-text-gray-700)"
      :popper-offset="-6"
      background-color="transparent"
      :show-timeout="50"
      :hide-timeout="50"
      popper-class="horizontal-menu-popper"
    >
      <HorizontalSubmenu
        v-for="item in filteredMenuItems"
        :key="item.path"
        :item="item"
        :isMobile="false"
        :level="0"
      />
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
  import type { AppRouteRecord } from '@/types/router'
  import HorizontalSubmenu from './widget/HorizontalSubmenu.vue'

  defineOptions({ name: 'ArtHorizontalMenu' })

  interface Props {
    /** Menu list data */
    list: AppRouteRecord[]
  }

  const route = useRoute()

  const props = withDefaults(defineProps<Props>(), {
    list: () => []
  })

  /**
   * Filtered menu item list
   * Only display menu items that are not hidden
   */
  const filteredMenuItems = computed(() => {
    return filterMenuItems(props.list)
  })

  /**
   * Currently active route path
   * Used for menu highlight
   */
  const routerPath = computed(() => String(route.meta.activePath || route.path))

  /**
   * Recursively filter menu items to remove hidden ones
   * If all children of a parent menu are hidden, the parent is hidden as well
   * @param items Menu item array
   * @returns Filtered menu item array
   */
  const filterMenuItems = (items: AppRouteRecord[]): AppRouteRecord[] => {
    return items
      .filter((item) => {
        // If the current item is hidden, filter it out
        if (item.meta.isHide) {
          return false
        }

        // If there are child menus, recursively filter them
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenuItems(item.children)
          // If all child menus are filtered out, hide the parent menu
          return filteredChildren.length > 0
        }

        // Leaf node and not hidden, keep it
        return true
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterMenuItems(item.children) : undefined
      }))
  }
</script>

<style lang="scss" scoped>
  .top-menu {
    flex: 1;
    overflow: hidden;

    .el-menu {
      width: 100%;
      border: none;
    }

    // Remove the default style of first-level el-menu-item
    .el-menu-item[tabindex='0'] {
      background-color: transparent !important;
      border: none !important;
    }
  }

  // Remove the bottom line of el-sub-menu
  :deep(.el-menu--horizontal .el-sub-menu__title) {
    padding: 0 30px 0 10px !important;
    border: 0 !important;
  }
</style>
