<!-- More button -->
<template>
  <div class="btn-more">
    <ElDropdown v-if="hasAnyAuthItem">
      <ArtButtonTable type="more" :iconBgColor="!hasBackground ? 'transparent' : ''" />
      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="item in list" :key="item.key">
            <ElDropdownItem
              v-if="!item.auth || hasAuth(item.auth)"
              :disabled="item.disabled"
              @click="handleClick(item)"
            >
              {{ item.label }}
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from '@/composables/useAuth'

  defineOptions({ name: 'ArtButtonMore' })

  const { hasAuth } = useAuth()

  export interface ButtonMoreItem {
    /** Button identifier, used for click event */
    key: string | number
    /** Button text */
    label: string
    /** Whether disabled */
    disabled?: boolean
    /** Permission identifier */
    auth?: string
  }

  interface Props {
    /** Dropdown item list */
    list: ButtonMoreItem[]
    /** Overall permission control */
    auth?: string
    /** Whether to show background */
    hasBackground?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    hasBackground: true
  })

  // Check if there is any item with permission
  const hasAnyAuthItem = computed(() => {
    return props.list.some((item) => !item.auth || hasAuth(item.auth))
  })

  const emit = defineEmits<{
    (e: 'click', item: ButtonMoreItem): void
  }>()

  const handleClick = (item: ButtonMoreItem) => {
    emit('click', item)
  }
</script>
