<template>
  <div class="page-content">
    <ElButton @contextmenu.prevent="showMenu"> Right-click to open menu </ElButton>

    <!-- Context menu component -->
    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="180"
      :submenu-width="140"
      :border-radius="10"
      @select="handleSelect"
      @show="onMenuShow"
      @hide="onMenuHide"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import ArtMenuRight from '@/components/core/others/art-menu-right/index.vue'
  import type { MenuItemType } from '@/components/core/others/art-menu-right/index.vue'
  import { ElMessage } from 'element-plus'

  const menuRef = ref<InstanceType<typeof ArtMenuRight>>()
  const lastAction = ref('')

  // Context menu items
  const menuItems = computed((): MenuItemType[] => [
    {
      key: 'copy',
      label: 'Copy',
      icon: '&#xe7b2;'
    },
    {
      key: 'paste',
      label: 'Paste',
      icon: '&#xe70b;'
    },
    {
      key: 'cut',
      label: 'Cut',
      icon: '&#xe7b8;',
      showLine: true
    },
    {
      key: 'export',
      label: 'Export',
      icon: '&#xe78b;',
      children: [
        {
          key: 'exportExcel',
          label: 'Export Excel',
          icon: '&#xe604;'
        },
        {
          key: 'exportPdf',
          label: 'Export PDF',
          icon: '&#xe89e;'
        }
      ]
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: '&#xe706;',
      children: [
        {
          key: 'rename',
          label: 'Rename',
          icon: '&#xe607;'
        },
        {
          key: 'duplicate',
          label: 'Duplicate',
          icon: '&#xe608;'
        }
      ]
    },
    {
      key: 'share',
      label: 'Share',
      icon: '&#xe73b;',
      showLine: true
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: '&#xe850;'
    },
    {
      key: 'disabled',
      label: 'Disabled',
      icon: '&#xe619;',
      disabled: true
    }
  ])

  const handleSelect = (item: MenuItemType) => {
    lastAction.value = `${item.label} (${item.key})`
    ElMessage.success(`Executed action: ${item.label}`)
    console.log('Selected menu item:', item)
  }

  const showMenu = (e: MouseEvent) => {
    console.log('Context menu event', e)
    // Ensure default behavior is prevented
    e.preventDefault()
    e.stopPropagation()

    // Defer to next tick to ensure event handling completes
    nextTick(() => {
      menuRef.value?.show(e)
    })
  }

  const onMenuShow = () => {
    console.log('Menu shown')
  }

  const onMenuHide = () => {
    console.log('Menu hidden')
  }
</script>
