<template>
  <div class="page-content">
    <h3 class="page-title">Tab Operations</h3>

    <!-- Modify Tab Title Section -->
    <ElCard class="module-card" header="Modify Tab Title" shadow="never">
      <div style="display: flex; gap: 10px">
        <ElInput
          v-model="newTabTitle"
          placeholder="Enter new tab title"
          clearable
          style="width: 300px"
        />

        <ElButton type="primary" @click="handleUpdateTabTitle" :disabled="!newTabTitle.trim()">
          Update
        </ElButton>
        <ElButton @click="handleResetTabTitle"> Reset </ElButton>
      </div>
    </ElCard>

    <!-- Get Tab Info Section -->
    <ElCard class="module-card" header="Get Tab Info" shadow="never">
      <div class="mb-4">
        <p class="tab-info">Current tab info: {{ currentTab }}</p>
      </div>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElButton type="success" plain @click="handleGetCurrentTabTitle(routePath)">
            Get current tab info
          </ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <!-- Close Tabs Section -->
    <ElCard class="module-card" header="Close Tabs" shadow="never">
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElButton type="danger" plain @click="handleCloseTab(routePath)">
            Close current tab
          </ElButton>
          <ElButton type="warning" plain @click="handleCloseOthersTab(routePath)">
            Close other tabs
          </ElButton>
          <ElButton type="danger" plain @click="handleCloseAllTab"> Close all tabs </ElButton>
        </ElCol>
      </ElRow>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useWorktabStore } from '@/store/modules/worktab'
  import { WorkTab } from '@/types'
  import { ElMessage } from 'element-plus'
  const worktabStore = useWorktabStore()
  const currentTab = ref<WorkTab | null>(null)
  const newTabTitle = ref('')
  const routePath = '/examples/tabs'

  /**
   * Handle updating the tab title
   * Validate input then call the store method to update the title
   */
  const handleUpdateTabTitle = () => {
    if (newTabTitle.value.trim()) {
      worktabStore.updateTabTitle(routePath, newTabTitle.value.trim())
    }
  }

  /**
   * Handle resetting the tab title
   * Reset the title to default and clear the input
   */
  const handleResetTabTitle = () => {
    worktabStore.resetTabTitle(routePath)
    newTabTitle.value = ''
  }

  /**
   * Get tab info for the specified path
   * @param path - Tab path
   */
  const handleGetCurrentTabTitle = (path: string) => {
    const tab = worktabStore.getTabTitle(path)
    if (tab) {
      currentTab.value = tab
    } else {
      ElMessage.warning('Tab info not found')
    }
  }

  /**
   * Close the tab at the specified path
   * @param path - Path of the tab to close
   */
  const handleCloseTab = (path: string) => {
    worktabStore.removeTab(path)
  }

  /**
   * Close all other tabs except the specified path
   * @param path - Path to keep
   */
  const handleCloseOthersTab = (path: string) => {
    worktabStore.removeOthers(path)
  }

  /**
   * Close all tabs
   */
  const handleCloseAllTab = () => {
    worktabStore.removeAll()
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .page-title {
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 400;
      color: var(--el-text-color-primary);
    }

    .module-card {
      margin-bottom: 30px;
    }

    .tab-info {
      margin: 0 0 10px;
      font-size: 14px;
      color: var(--art-gray-600);
    }
  }
</style>
