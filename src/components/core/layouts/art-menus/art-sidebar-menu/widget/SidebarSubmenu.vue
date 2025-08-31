<template>
  <template v-for="item in filteredMenuItems" :key="item.path">
    <!-- Item with submenus -->
    <ElSubMenu v-if="hasChildren(item)" :index="item.path || item.meta.title" :level="level">
      <template #title>
        <MenuItemIcon :icon="item.meta.icon" :color="theme?.iconColor" />
        <span class="menu-name">
          {{ formatMenuTitle(item.meta.title) }}
        </span>
        <div v-if="item.meta.showBadge" class="art-badge" style="right: 10px" />
      </template>

      <SidebarSubmenu
        :list="item.children"
        :is-mobile="isMobile"
        :level="level + 1"
        :theme="theme"
        @close="closeMenu"
      />
    </ElSubMenu>

    <!-- Regular menu item -->
    <ElMenuItem
      v-else
      :index="item.path || item.meta.title"
      :level-item="level + 1"
      @click="goPage(item)"
    >
      <MenuItemIcon :icon="item.meta.icon" :color="theme?.iconColor" />
      <div
        v-show="item.meta.showBadge && level === 0 && !menuOpen"
        class="art-badge"
        style="right: 5px"
      />

      <template #title>
        <span class="menu-name">
          {{ formatMenuTitle(item.meta.title) }}
        </span>
        <div v-if="item.meta.showBadge" class="art-badge" />
        <div v-if="item.meta.showTextBadge && (level > 0 || menuOpen)" class="art-text-badge">
          {{ item.meta.showTextBadge }}
        </div>
      </template>
    </ElMenuItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AppRouteRecord } from '@/types/router'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { handleMenuJump } from '@/utils/navigation'
  import { useSettingStore } from '@/store/modules/setting'

  interface MenuTheme {
    iconColor?: string
  }

  interface Props {
    /** Menu title */
    title?: string
    /** Menu list */
    list?: AppRouteRecord[]
    /** Theme config */
    theme?: MenuTheme
    /** Is mobile mode */
    isMobile?: boolean
    /** Menu level */
    level?: number
  }

  interface Emits {
    /** Close menu event */
    (e: 'close'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    list: () => [],
    theme: () => ({}),
    isMobile: false,
    level: 0
  })

  const emit = defineEmits<Emits>()

  const settingStore = useSettingStore()

  const { menuOpen } = storeToRefs(settingStore)

  /**
   * Filtered menu items list
   * Show only items that are not hidden
   */
  const filteredMenuItems = computed(() => filterRoutes(props.list))

  /**
   * Navigate to the specified page
   * @param item Menu item data
   */
  const goPage = (item: AppRouteRecord): void => {
    closeMenu()
    handleMenuJump(item)
  }

  /**
   * Close the menu
   * Trigger the close event for the parent component
   */
  const closeMenu = (): void => {
    emit('close')
  }

  /**
   * Recursively filter menu routes and remove hidden items
   * If all children of a parent menu are hidden, the parent will also be hidden
   * @param items Menu items array
   * @returns Filtered menu items array
   */
  const filterRoutes = (items: AppRouteRecord[]): AppRouteRecord[] => {
    return items
      .filter((item) => {
        // If the current item is hidden, filter it out
        if (item.meta.isHide) {
          return false
        }

        // If there are children, recursively filter them
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterRoutes(item.children)
          // If all children are filtered out, hide the parent menu
          return filteredChildren.length > 0
        }

        // Leaf node and not hidden: keep it
        return true
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterRoutes(item.children) : undefined
      }))
  }

  /**
   * Determine whether the menu item contains visible children
   * @param item Menu item data
   * @returns Whether it contains visible children
   */
  const hasChildren = (item: AppRouteRecord): boolean => {
    if (!item.children || item.children.length === 0) {
      return false
    }
    // Recursively check whether there are visible children
    const filteredChildren = filterRoutes(item.children)
    return filteredChildren.length > 0
  }
</script>

<script lang="ts">
  /**
   * Menu icon component
   * Used to render the icon for a menu item
   */
  const MenuItemIcon = defineComponent({
    name: 'MenuItemIcon',
    props: {
      /** Icon content */
      icon: {
        type: String,
        default: ''
      },
      /** Icon color */
      color: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      return () =>
        h('i', {
          class: 'menu-icon iconfont-sys',
          style: props.color ? { color: props.color } : undefined,
          innerHTML: props.icon
        })
    }
  })
</script>
