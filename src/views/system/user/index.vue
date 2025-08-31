<!-- User Management -->
<!-- art-full-height auto-calculates remaining page height -->
<!-- art-table-card: system-style card that fills remaining height -->
<!-- For more useTable examples, see Advanced Table in Examples -->
<template>
  <div class="user-page art-full-height">
    <!-- Search bar -->
    <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></UserSearch>

    <ElCard class="art-table-card" shadow="never">
      <!-- Table header -->
      <ArtTableHeader v-model:columns="columnChecks" @refresh="refreshData">
        <template #left>
          <ElButton @click="showDialog('add')" v-ripple>Add User</ElButton>
        </template>
      </ArtTableHeader>

      <!-- Table -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- User dialog -->
      <UserDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { ElMessageBox, ElMessage, ElTag, ElImage } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'

  defineOptions({ name: 'User' })

  type UserListItem = Api.User.UserListItem
  const { getUserList } = UserService

  // Dialog state
  const dialogType = ref<Form.DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<UserListItem>>({})

  // Selected rows
  const selectedRows = ref<UserListItem[]>([])

  // Search form
  const searchForm = ref({
    name: undefined,
    level: 'vip',
    date: undefined,
    daterange: undefined,
    status: undefined
  })

  // User status configuration
  const USER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: 'Online' },
    '2': { type: 'info' as const, text: 'Offline' },
    '3': { type: 'warning' as const, text: 'Abnormal' },
    '4': { type: 'danger' as const, text: 'Deactivated' }
  } as const

  /** Get user status config */
  const getUserStatusConfig = (status: string) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: 'Unknown'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable<UserListItem>({
    // Core config
    core: {
      apiFn: getUserList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      // Exclude params from apiParams
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' }, // Selection column
        { type: 'index', width: 60, label: 'No.' }, // Index
        {
          prop: 'avatar',
          label: 'Username',
          width: 280,
          formatter: (row) => {
            return h('div', { class: 'user', style: 'display: flex; align-items: center' }, [
              h(ElImage, {
                class: 'avatar',
                src: row.avatar,
                previewSrcList: [row.avatar],
                // Insert preview into body to fix preview style within table
                previewTeleported: true
              }),
              h('div', {}, [
                h('p', { class: 'user-name' }, row.userName),
                h('p', { class: 'email' }, row.userEmail)
              ])
            ])
          }
        },
        {
          prop: 'userGender',
          label: 'Gender',
          sortable: true,
          // checked: false, // hidden column
          formatter: (row) => row.userGender
        },
        { prop: 'userPhone', label: 'Phone' },
        {
          prop: 'status',
          label: 'Status',
          formatter: (row) => {
            const statusConfig = getUserStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'createTime',
          label: 'Created At',
          sortable: true
        },
        {
          prop: 'operation',
          label: 'Actions',
          width: 120,
          fixed: 'right', // Fixed column
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    },
    // Data processing
    transform: {
      // Data transformer - replace avatar
      dataTransformer: (records: any) => {
        // Type guard check
        if (!Array.isArray(records)) {
          console.warn('Data transformer: expected array, got:', typeof records)
          return []
        }

        // Replace interface avatars with local avatars
        return records.map((item: any, index: number) => {
          return {
            ...item,
            avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar
          }
        })
      }
    }
  })

  /**
   * Handle search
   * @param params - search params
   */
  const handleSearch = (params: Record<string, any>) => {
    // Convert daterange to startTime and endTime
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    // Assign search params
    Object.assign(searchParams, { ...filtersParams, startTime, endTime })
    getData()
  }

  /**
   * Show user dialog
   */
  const showDialog = (type: Form.DialogType, row?: UserListItem): void => {
    console.log('Open dialog:', { type, row })
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * Delete (deactivate) user
   */
  const deleteUser = (row: UserListItem): void => {
    console.log('Delete user:', row)
    ElMessageBox.confirm(`Are you sure to deactivate this user?`, 'Deactivate User', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'error'
    }).then(() => {
      ElMessage.success('Deactivated successfully')
    })
  }

  /**
   * Handle dialog submit
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = {}
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  /**
   * Handle table row selection change
   */
  const handleSelectionChange = (selection: UserListItem[]): void => {
    selectedRows.value = selection
    console.log('Selected rows:', selectedRows.value)
  }
</script>

<style lang="scss" scoped>
  .user-page {
    :deep(.user) {
      .avatar {
        width: 40px;
        height: 40px;
        margin-left: 0;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
