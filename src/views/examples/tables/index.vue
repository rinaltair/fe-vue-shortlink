<!-- Advanced table capabilities demo -->
<!-- In real projects, enable only the features you need. See the minimal example below for guidance. -->
<template>
  <div class="advanced-table-demo">
    <!-- Feature Intro Card -->
    <ElCard class="intro-card" shadow="never">
      <template #header>
        <div class="intro-header">
          <h3>🚀 Advanced Table Capabilities</h3>
          <div class="intro-badges">
            <ElTag type="success" effect="light">Smart Caching</ElTag>
            <ElTag type="primary" effect="light">Debounced Search</ElTag>
            <ElTag type="warning" effect="light">Multiple Refresh Modes</ElTag>
            <ElTag type="info" effect="light">Error Handling</ElTag>
          </div>
        </div>
      </template>
      <div class="intro-content">
        <p class="intro-text">
          Integrates search, refresh, fullscreen, size control, column show/hide, drag sorting,
          table style controls, and the built-in useTable composable. Provides powerful composable
          APIs for data fetching, smart caching (LRU), and multiple refresh strategies to boost
          development efficiency.
        </p>

        <!-- Debug Panel -->
        <div class="debug-panel" v-if="showDebugPanel">
          <ElCollapse v-model="debugActiveNames">
            <ElCollapseItem name="cache" title="📊 Cache Stats & Demo">
              <div class="debug-info">
                <div class="stat-item">
                  <span class="label">Cache status:</span>
                  <ElTag type="success">Enabled</ElTag>
                </div>
                <div class="stat-item">
                  <span class="label">Cache entries:</span>
                  <span class="value">{{ cacheInfo.total }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Cache size:</span>
                  <span class="value">{{ cacheInfo.size }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Hit info:</span>
                  <span class="value">{{ cacheInfo.hitRate }}</span>
                </div>

                <div class="debug-actions">
                  <ElButton size="small" @click="handleClearCache">Clear cache</ElButton>
                  <ElButton size="small" @click="handleCleanExpiredCache"
                    >Clean expired cache</ElButton
                  >
                  <ElButton size="small" @click="handleTestCache">Test cache</ElButton>
                  <ElButton size="small" @click="forceRefreshCacheInfo"
                    >Refresh cache info</ElButton
                  >
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="logs" title="📋 Cache Logs">
              <div class="debug-info">
                <div class="logs-container">
                  <div v-if="cacheDebugLogs.length === 0" class="empty-logs">
                    <ElEmpty description="No cache logs" :image-size="60" />
                  </div>
                  <div v-else class="log-list">
                    <div
                      v-for="(log, index) in cacheDebugLogs"
                      :key="index"
                      class="log-item"
                      :class="{
                        'log-success': log.includes('✅'),
                        'log-cache': log.includes('🎯'),
                        'log-error': log.includes('❌')
                      }"
                    >
                      {{ log }}
                    </div>
                  </div>
                </div>
                <div class="debug-actions">
                  <ElButton size="small" @click="cacheDebugLogs = []">Clear logs</ElButton>
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="request" title="🔄 Request Status">
              <div class="debug-info">
                <div class="stat-item">
                  <span class="label">Loading status:</span>
                  <ElTag :type="loading ? 'warning' : 'success'">
                    {{ loading ? 'Loading' : 'Idle' }}
                  </ElTag>
                </div>
                <div class="stat-item">
                  <span class="label">Data status:</span>
                  <ElTag :type="hasData ? 'success' : 'info'">
                    {{ hasData ? `${data.length} items` : 'No data' }}
                  </ElTag>
                </div>
                <div class="stat-item">
                  <span class="label">Error status:</span>
                  <ElTag :type="error ? 'danger' : 'success'">
                    {{ error ? 'Error' : 'OK' }}
                  </ElTag>
                </div>
                <div class="stat-item request-params">
                  <span class="label">Current request params:</span>
                  <ElText tag="pre" class="params-display">{{
                    JSON.stringify(requestParams, null, 2)
                  }}</ElText>
                </div>
                <div class="debug-actions">
                  <ElButton size="small" @click="handleCancelRequest">Cancel request</ElButton>
                  <ElButton size="small" @click="handleClearData">Clear data</ElButton>
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>

        <!-- Feature toggles -->
        <div class="feature-toggles">
          <ElSwitch v-model="showDebugPanel" active-text="Debug Panel" />
          <ElText type="info" size="small">
            💡 Caching is enabled; use the debug panel to view details.
          </ElText>
        </div>
      </div>
    </ElCard>

    <!-- Search Area -->
    <ArtSearchBar
      ref="searchBarRef"
      v-model="searchFormState"
      :items="searchItems"
      :rules="rules"
      :is-expand="false"
      :show-expand="true"
      :show-reset-button="true"
      :show-search-button="true"
      :disabled-search-button="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- Table Area -->
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <template #header>
        <div class="table-header-wrapper">
          <h4>User Data Table</h4>
          <div class="table-info">
            <ElTag v-if="error" type="danger">{{ error.message }}</ElTag>
            <ElTag v-else-if="loading" type="warning">Loading...</ElTag>
            <ElTag v-else type="success">{{ data.length }} items</ElTag>
          </div>
        </div>
      </template>

      <!-- Table toolbar -->
      <!-- fullClass sets the fullscreen area. Use this prop to control it. -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        @refresh="handleRefresh"
        layout="refresh,size,fullscreen,columns,settings"
        fullClass="art-table-card"
      >
        <template #left>
          <ElButton type="primary" @click="handleAdd" v-ripple>
            <ElIcon>
              <Plus />
            </ElIcon>
            Add User
          </ElButton>

          <!-- Export / Import -->
          <ArtExcelExport
            :data="data as any"
            :columns="exportColumns as any"
            filename="User Data"
            :auto-index="true"
            button-text="Export"
            @export-success="handleExportSuccess"
          />
          <ArtExcelImport
            @import-success="handleImportSuccess"
            @import-error="handleImportError"
            style="margin: 0 12px"
          />

          <ElButton @click="handleClearData" plain v-ripple> Clear Data </ElButton>

          <ElButton @click="handleBatchDelete" :disabled="selectedRows.length === 0" v-ripple>
            <ElIcon>
              <Delete />
            </ElIcon>
            Batch Delete ({{ selectedRows.length }})
          </ElButton>
          <!-- Dynamic column config demo -->
          <ElDropdown @command="handleColumnCommand" style="margin-left: 10px">
            <ElButton type="primary" plain>
              Update table columns
              <ElIcon class="el-icon--right">
                <ArrowDown />
              </ElIcon>
            </ElButton>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="addColumn">Add column (Remark)</ElDropdownItem>
                <ElDropdownItem command="toggleColumn"
                  >Toggle visibility (Phone Number)</ElDropdownItem
                >
                <ElDropdownItem command="removeColumn">Remove column (Status)</ElDropdownItem>
                <ElDropdownItem command="reorderColumns"
                  >Swap columns (Gender, Phone)</ElDropdownItem
                >
                <ElDropdownItem command="updateColumn">Update column (Phone Number)</ElDropdownItem>
                <ElDropdownItem command="batchUpdate">Batch update (Gender, Phone)</ElDropdownItem>
                <ElDropdownItem command="resetColumns" divided
                  >Reset all column config</ElDropdownItem
                >
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="data"
        :columns="columns"
        :height="computedTableHeight"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @header-click="handleHeaderClick"
        @sort-change="handleSortChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <!-- User info column -->
        <template #avatar="{ row }">
          <div class="user-info">
            <ElAvatar :src="row.avatar" :size="40" />
            <div class="user-details">
              <p class="user-name">{{ row.userName }}</p>
              <p class="user-email">{{ row.userEmail }}</p>
            </div>
          </div>
        </template>

        <!-- Custom user info header -->
        <template #avatar-header="{ column }">
          <div style="display: flex; gap: 5px; align-items: center">
            <span>{{ column.label }}</span>
            <ElTooltip content="Includes avatar, name, and email" placement="top">
              <ElIcon class="help-icon">
                <QuestionFilled />
              </ElIcon>
            </ElTooltip>
          </div>
        </template>

        <!-- Status column -->
        <template #status="{ row }">
          <ElTag :type="getUserStatusConfig(row.status).type" effect="light">
            {{ getUserStatusConfig(row.status).text }}
          </ElTag>
        </template>

        <!-- Rating column -->
        <template #score="{ row }">
          <ElRate v-model="row.score" disabled size="small" />
        </template>

        <!-- Actions column -->
        <template #operation="{ row }">
          <div class="operation-buttons">
            <ArtButtonTable type="view" :row="row" @click="handleView(row)" />
            <ArtButtonTable type="add" :row="row" @click="handleAdd()" />
            <ArtButtonTable type="edit" :row="row" @click="handleEdit(row)" />
            <ArtButtonTable type="delete" :row="row" @click="handleDelete(row)" />
          </div>
        </template>

        <!-- Custom phone header -->
        <template #userPhone-header="{ column }">
          <ElPopover placement="bottom" :width="200" trigger="hover">
            <template #reference>
              <div class="custom-header">
                <span>{{ column.label }}</span>
                <ElIcon>
                  <Search />
                </ElIcon>
              </div>
            </template>
            <ElInput
              v-model="phoneSearch"
              placeholder="Search phone number"
              size="small"
              @input="handlePhoneSearch"
            >
              <template #prefix>
                <ElIcon>
                  <Search />
                </ElIcon>
              </template>
            </ElInput>
          </ElPopover>
        </template>
      </ArtTable>
    </ElCard>

    <!-- Advanced Features Demo -->
    <ElCard class="advanced-features-card" shadow="never">
      <template #header>
        <h4>🚀 Advanced Features</h4>
      </template>
      <div class="feature-demo-section">
        <!-- Event listener demo -->
        <div class="demo-group">
          <h5>📊 Event Listener Demo</h5>
          <div class="demo-buttons">
            <ElButton @click="toggleEventDemo" :type="eventDemoEnabled ? 'success' : 'primary'">
              {{ eventDemoEnabled ? 'Turn off' : 'Turn on' }} event listeners
            </ElButton>
            <ElButton @click="clearEventLogs" v-if="eventDemoEnabled">Clear logs</ElButton>
          </div>
          <div v-if="eventDemoEnabled && eventLogs.length > 0" class="event-logs">
            <div class="log-header">
              <span>Recent event logs:</span>
              <ElTag size="small">{{ eventLogs.length }} items</ElTag>
            </div>
            <div class="log-list">
              <div v-for="(log, index) in eventLogs.slice(0, 20)" :key="index" class="log-item">
                <ElTag :type="getEventType(log.type)" size="small">{{ log.type }}</ElTag>
                <span class="log-message">{{ log.message }}</span>
                <span class="log-time">{{ log.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table config demo -->
        <div class="demo-group">
          <h5>⚙️ Table Config Demo</h5>
          <div class="demo-buttons">
            <ElSwitch
              v-model="tableConfig.fixedHeight"
              active-text="Fixed height (500px)"
              inactive-text="Auto height"
              style="margin-left: 10px"
            />
          </div>
        </div>

        <!-- Custom functions demo -->
        <div class="demo-group">
          <h5>🎯 Custom Functions</h5>
          <div class="demo-buttons">
            <ElButton @click="handleScrollToTop">Scroll to top</ElButton>
            <ElButton @click="handleScrollToPosition">Scroll to position</ElButton>
            <ElButton @click="handleToggleSelection">Toggle select all</ElButton>
            <ElButton @click="handleGetTableInfo">Get table info</ElButton>
          </div>
        </div>
      </div>
    </ElCard>

    <!-- Cache refresh strategies demo -->
    <ElCard class="refresh-demo-card" shadow="never">
      <template #header>
        <h4>🔄 [Cache] Refresh Strategies</h4>
      </template>
      <div class="refresh-buttons">
        <ElButton @click="refreshData" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          Full refresh
        </ElButton>
        <ElButton @click="refreshSoft" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          Soft refresh
        </ElButton>
        <ElButton @click="refreshCreate" v-ripple>
          <ElIcon>
            <Plus />
          </ElIcon>
          Refresh after create
        </ElButton>
        <ElButton @click="refreshUpdate" v-ripple>
          <ElIcon>
            <Edit />
          </ElIcon>
          Refresh after edit
        </ElButton>
        <ElButton @click="refreshRemove" v-ripple>
          <ElIcon>
            <Delete />
          </ElIcon>
          Refresh after delete
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Delete, Edit, Search, Refresh, QuestionFilled } from '@element-plus/icons-vue'
  import { useTable, CacheInvalidationStrategy } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { getColumnKey } from '@/composables/useTableColumns'

  defineOptions({ name: 'AdvancedTableDemo' })

  type UserListItem = Api.User.UserListItem

  const { getUserList } = UserService

  // Selected rows
  const selectedRows = ref<UserListItem[]>([])

  // Table instance ref
  const tableRef = ref()

  // Debug panel state
  const showDebugPanel = ref(false)
  const debugActiveNames = ref(['cache', 'request', 'logs'])

  // Cache debug state
  const cacheDebugLogs = ref<string[]>([])
  const requestParams = ref<any>({
    current: 1,
    size: 20,
    name: '',
    phone: '',
    status: '',
    department: '',
    daterange: undefined
  })

  // Cache key info
  const cacheKeys = ref<string[]>([])

  // Phone number search
  const phoneSearch = ref('')

  // Event demo
  const eventDemoEnabled = ref(false)
  const eventLogs = ref<Array<{ type: string; message: string; time: string }>>([])

  // Table config demo
  const tableConfig = ref({
    height: '100%',
    fixedHeight: false // Added: toggle for fixed height
  })

  // Compute table height
  const computedTableHeight = computed(() => {
    return tableConfig.value.fixedHeight ? '500px' : ''
  })

  // Search form ref
  const searchBarRef = ref()

  // Validation rules
  const rules = {
    name: [{ required: true, message: 'Please enter a username', trigger: 'blur' }],
    phone: [
      { required: true, message: 'Please enter a phone number', trigger: 'blur' },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: 'Please enter a valid phone number',
        trigger: 'blur'
      }
    ]
  }

  // Initial search form values
  const searchFormState = ref({
    name: '',
    phone: '',
    status: '1',
    department: '',
    daterange: ['2025-01-01', '2025-02-10']
  })

  // Search form state
  // const searchFormState = ref({ ...defaultFilter.value })

  // User status config
  const USER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: 'Online' },
    '2': { type: 'info' as const, text: 'Offline' },
    '3': { type: 'warning' as const, text: 'Abnormal' },
    '4': { type: 'danger' as const, text: 'Deactivated' }
  } as const

  // Search form config
  // Date picker has multiple types. See src/components/core/forms/art-search-bar/widget/art-search-date/README.md
  const searchItems = computed(() => [
    {
      key: 'name',
      label: 'Username',
      type: 'input',
      props: {
        placeholder: 'Please enter a username'
      }
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'input',
      props: {
        placeholder: 'Please enter a phone number',
        maxlength: '11'
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Online', value: '1' },
        { label: 'Offline', value: '2' },
        { label: 'Abnormal', value: '3' },
        { label: 'Deactivated', value: '4' }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product', value: 'Product' },
        { label: 'Operations', value: 'Operations' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Design', value: 'Design' }
      ]
    },
    {
      key: 'daterange',
      label: 'Date Range',
      type: 'daterange',
      props: {
        type: 'daterange',
        startPlaceholder: 'Start date',
        endPlaceholder: 'End date',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])

  // Export column config
  const exportColumns = computed(() => ({
    userName: { title: 'Username', width: 15 },
    userEmail: { title: 'Email', width: 20 },
    userPhone: { title: 'Phone Number', width: 15 },
    userGender: { title: 'Gender', width: 10 },
    department: { title: 'Department', width: 15 },
    status: {
      title: 'Status',
      width: 10,
      formatter: (value: string) => getUserStatusConfig(value).text
    }
  }))

  // Get user status config
  const getUserStatusConfig = (status: string) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: 'Unknown'
      }
    )
  }

  // Simulate network request
  // const simulateNetworkRequest = (): Promise<void> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 500)
  //   })
  // }

  // Load data after simulated network request
  // onMounted(async () => {
  //   // Wait for the simulated network request to finish
  //   await simulateNetworkRequest()
  //   await fetchData({ name: 'ricky', phone: 19388828388 })
  // })

  // Using useTable hook
  const {
    // fetchData, // Manual fetch method for when immediate is false (e.g., wait for other requests)

    // Data
    data, // table data
    loading, // loading state
    error, // error state
    hasData, // whether has data

    // Pagination
    pagination, // pagination info
    handleSizeChange, // page size change
    handleCurrentChange, // current page change

    // Search
    searchParams, // search params
    resetSearchParams, // reset search params

    // Data operations
    getData, // fetch data
    getDataDebounced, // fetch data (debounced)
    clearData, // clear data

    // Column config
    columns, // table columns
    columnChecks, // column visibility & drag config

    // Refresh strategies
    refreshData, // Full refresh: clear all cache and refetch (manual refresh)
    refreshSoft, // Soft refresh: clear current search cache, keep pagination (timed refresh)
    refreshCreate, // After create: go to first page and clear pagination cache
    refreshUpdate, // After update: keep page, clear current search cache
    refreshRemove, // After delete: smartly adjust page to avoid empty page

    // Cache control
    cacheInfo, // cache stats
    clearCache, // clear cache selectively for business scenarios
    // Four strategies supported
    // clearCache(CacheInvalidationStrategy.CLEAR_ALL, 'Manual refresh')
    // clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, 'Search')
    // clearCache(CacheInvalidationStrategy.CLEAR_PAGINATION, 'Create')
    // clearCache(CacheInvalidationStrategy.KEEP_ALL, 'Keep cache')
    clearExpiredCache, // clear expired cache

    // Request control
    cancelRequest, // cancel current request

    // Dynamic columns API
    addColumn, // add column
    removeColumn, // remove column
    updateColumn, // update column
    toggleColumn, // toggle column visibility
    resetColumns, // reset columns
    batchUpdateColumns, // batch update columns
    reorderColumns, // reorder columns
    getColumnConfig, // get column config
    getAllColumns // get all columns
  } = useTable<UserListItem>({
    // Core config
    core: {
      apiFn: (params) => {
        // Add debug info before API call
        const requestKey = JSON.stringify(params)
        console.log('🚀 API request params:', params)
        addCacheLog(`🚀 API request: current=${params.current}, size=${params.size}`)
        addCacheLog(`🔑 Request key: ${requestKey.substring(0, 100)}...`)

        // Record cache key (assumed to be cached)
        updateCacheKeys(requestKey)

        return getUserList(params)
      },
      apiParams: {
        current: 1,
        size: 20,
        // pageNum: 1, // Custom pagination mapping, default is current
        // pageSize: 20, // Custom pagination mapping, default is size
        ...searchFormState.value
      },
      // Exclude these apiParams
      excludeParams: ['daterange'],
      // Custom pagination key mapping, also set field names in apiParams
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      immediate: true, // load data immediately
      columnsFactory: () => [
        // {
        //   type: 'expand',
        //   label: 'Expand',
        //   width: 80,
        //   formatter: (row) =>
        //     h('div', { style: 'padding: 10px 30px' }, [
        //       h('p', {}, 'User ID: ' + row.id),
        //       h('p', {}, 'Username: ' + row.userName),
        //       h('p', {}, 'Phone: ' + row.userPhone),
        //       h('p', {}, 'Email: ' + row.userEmail),
        //       h('p', {}, 'Gender: ' + row.userGender),
        //       h('p', {}, 'Status: ' + row.status),
        //       h('p', {}, 'Created At: ' + row.createTime)
        //     ])
        // },
        { type: 'selection', width: 50 },
        // { type: 'index', width: 60, label: 'Index' }, // local index column
        { type: 'globalIndex', width: 60, label: 'Index' }, // global index column
        {
          prop: 'avatar',
          label: 'User Info',
          minWidth: 200,
          useSlot: true,
          useHeaderSlot: true,
          sortable: false
          // checked: false, // hidden column
        },
        {
          prop: 'userGender',
          label: 'Gender',
          sortable: true,
          formatter: (row) => row.userGender || 'Unknown'
        },
        {
          prop: 'userPhone',
          label: 'Phone Number',
          useHeaderSlot: true,
          sortable: true
        },
        {
          prop: 'department',
          label: 'Department',
          sortable: true
        },
        {
          prop: 'score',
          label: 'Rating',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'status',
          label: 'Status',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'operation',
          label: 'Actions',
          width: 190,
          useSlot: true,
          fixed: 'right'
        }
      ]
    },

    // Data transform
    transform: {
      dataTransformer: (records: any) => {
        if (!Array.isArray(records)) return []

        return records.map((item: any, index: number) => ({
          ...item,
          avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar,
          department: ['Engineering', 'Product', 'Operations', 'Marketing', 'Design'][
            Math.floor(Math.random() * 5)
          ],
          score: Math.floor(Math.random() * 5) + 1,
          status: ['1', '2', '3', '4'][Math.floor(Math.random() * 4)]
        }))
      }
      // Custom response adapter for special backend formats
      // responseAdapter: (data: any) => {
      //   const { list, total, pageNum, pageSize } = data
      //   return {
      //     records: list,
      //     total: total,
      //     current: pageNum,
      //     size: pageSize
      //   }
      // }
    },

    // Performance
    performance: {
      enableCache: true, // enable cache
      cacheTime: 5 * 60 * 1000, // 5 minutes
      debounceTime: 300,
      maxCacheSize: 100
    },

    // Lifecycle hooks
    hooks: {
      onSuccess: (data, response) => {
        console.log('📊 Response details:', response)
        addCacheLog(`✅ Request success: ${data.length} items`)
        addCacheLog(
          `📝 Response: total=${response.total}, current=${response.current}, size=${response.size}`
        )
      },
      onError: (error) => {
        console.error('❌ Data load failed:', error)
        addCacheLog(`❌ Request failed: ${error.message}`)
        ElMessage.error(error.message)
      },
      onCacheHit: (data, response) => {
        console.log('🎯 Cache hit:', data.length, 'items')
        console.log('🔑 Cache source:', response)
        addCacheLog(
          `🎯 Cache hit: ${data.length} items (current=${response.current}, size=${response.size})`
        )
        ElMessage.info('Data from cache')
      },
      resetFormCallback: () => {
        console.log('🔄 Form reset')
        addCacheLog('🔄 Form reset')
      }
    },

    // Debug config
    debug: {
      enableLog: true,
      logLevel: 'info'
    }
  })

  // Event handlers
  const handleSelectionChange = (selection: UserListItem[]) => {
    selectedRows.value = selection
    console.log('Selection changed:', selection)
  }

  const handleRowClick = (row: UserListItem) => {
    console.log('Row click:', row)
    logEvent('Row Click', `Clicked user: ${row.userName}`)
  }

  const handleHeaderClick = (column: any) => {
    console.log('Header click:', column)
    logEvent('Header Click', `Clicked ${column.label} header`)
  }

  const handleSortChange = (sortInfo: any) => {
    console.log('Sort:', sortInfo)
    console.log('Sort field:', sortInfo.prop)
    console.log('Sort order:', sortInfo.order)
    logEvent('Sort Change', `Field: ${sortInfo.prop}, Order: ${sortInfo.order}`)
  }

  // Event logging
  const logEvent = (type: string, message: string) => {
    if (!eventDemoEnabled.value) return

    const time = new Date().toLocaleTimeString()
    eventLogs.value.unshift({ type, message, time })

    // Limit log length
    if (eventLogs.value.length > 20) {
      eventLogs.value = eventLogs.value.slice(0, 20)
    }
  }

  // Get event tag type
  const getEventType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      'Row Click': 'primary',
      'Row Double Click': 'success',
      'Row Contextmenu': 'warning',
      'Cell Click': 'info',
      'Cell Double Click': 'success',
      'Header Click': 'primary',
      'Selection Change': 'warning',
      'Sort Change': 'success'
    }
    return typeMap[type] || 'info'
  }

  // Demo feature methods
  const toggleEventDemo = () => {
    eventDemoEnabled.value = !eventDemoEnabled.value
    if (eventDemoEnabled.value) {
      ElMessage.success('Event listeners enabled. Interact with the table to see logs.')
    } else {
      ElMessage.info('Event listeners disabled')
    }
  }

  const clearEventLogs = () => {
    eventLogs.value = []
    ElMessage.info('Event logs cleared')
  }

  const handleScrollToTop = () => {
    tableRef.value?.scrollToTop()
  }

  const handleScrollToPosition = () => {
    tableRef.value?.elTableRef.setScrollTop(200)
  }

  const handleToggleSelection = () => {
    if (selectedRows.value.length === 0) {
      tableRef.value?.elTableRef.toggleAllSelection()
      ElMessage.info('All selected')
    } else {
      tableRef.value?.elTableRef.clearSelection()
      ElMessage.info('Selection cleared')
    }
  }

  const handleGetTableInfo = () => {
    const info = {
      dataCount: data.value.length,
      selectedCount: selectedRows.value.length,
      columnCount: columns?.value?.length ?? 0,
      currentPage: pagination.current,
      pageSize: pagination.size,
      total: pagination.total
    }

    console.log('Table info:', info)
    ElMessage.info(`Table info logged to console. Currently ${info.dataCount} items`)
  }

  const handleSearch = async () => {
    await searchBarRef.value.validate()

    console.log('Search params:', searchFormState.value)
    const { daterange, ...filtersParams } = searchFormState.value
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    // Assign search params
    Object.assign(searchParams, { ...filtersParams, startTime, endTime })
    getData()
  }

  const handleReset = () => {
    addCacheLog('🔄 Reset search')
    // Reset search form state
    // searchFormState.value = { ...defaultFilter.value }
    resetSearchParams()
  }

  const handlePhoneSearch = (value: string) => {
    searchFormState.value.phone = value
    searchParams.phone = value
    requestParams.value = { ...searchParams, phone: value }
    addCacheLog(`📱 Phone search: ${value}`)
    getDataDebounced()
  }

  const handleRefresh = () => {
    addCacheLog('🔄 Manual refresh')
    refreshData()
  }

  // CRUD operations
  const handleAdd = () => {
    ElMessage.success('User added successfully')
    refreshCreate()
  }

  const handleEdit = (row: UserListItem) => {
    ElMessage.success(`Edited user ${row.userName} successfully`)
    setTimeout(() => {
      refreshUpdate()
    }, 1000)
  }

  const handleDelete = async (row: UserListItem) => {
    try {
      await ElMessageBox.confirm(`Are you sure to delete user ${row.userName}?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })

      ElMessage.success('Deleted successfully')
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('Deletion cancelled')
    }
  }

  const handleView = (row: UserListItem) => {
    ElMessage.info(`View user ${row.userName}`)
  }

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(`Delete ${selectedRows.value.length} selected users?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })

      ElMessage.success(`Batch deleted ${selectedRows.value.length} users successfully`)
      selectedRows.value = []
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('Deletion cancelled')
    }
  }

  // Export / Import
  const handleExportSuccess = (filename: string, count: number) => {
    ElMessage.success(`Exported ${count} items successfully`)
  }

  const handleImportSuccess = (data: any[]) => {
    ElMessage.success(`Imported ${data.length} items successfully`)
    refreshCreate()
  }

  const handleImportError = (error: Error) => {
    ElMessage.error(`Import failed: ${error.message}`)
  }

  // Debug actions
  const handleClearCache = () => {
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, 'Manual clear')
    cacheKeys.value = [] // clear cache key list
    addCacheLog('🗑️ Cleared all cache manually')
    ElMessage.success('Cache cleared')
  }

  const handleCleanExpiredCache = () => {
    const count = clearExpiredCache()
    addCacheLog(`🧹 Cleaned ${count} expired cache entries`)
    ElMessage.info(`Cleaned ${count} expired cache entries`)
  }

  const handleCancelRequest = () => {
    cancelRequest()
    addCacheLog('❌ Cancel current request')
    ElMessage.info('Request cancelled')
  }

  const handleClearData = () => {
    clearData()
    addCacheLog('🗑️ Cleared all data')
    ElMessage.info('Data cleared')
  }

  const handleTestCache = () => {
    // Simulate fast page switching to test cache
    const testPages = [1, 2, 3, 2, 1] // test page sequence

    ElMessage.info('Starting cache test...')
    addCacheLog('🧪 Starting cache test')

    let index = 0
    const testInterval = setInterval(() => {
      if (index >= testPages.length) {
        clearInterval(testInterval)
        addCacheLog('✅ Cache test completed')
        ElMessage.success('Cache test complete! Observe cache stats')
        return
      }

      const page = testPages[index]
      addCacheLog(`📄 Switching to page ${page} for test`)
      // Update request params
      requestParams.value = { ...requestParams.value, current: page }

      // Switch to test page
      handleCurrentChange(page)
      index++
    }, 1000)
  }

  // Add cache debug log
  const addCacheLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    cacheDebugLogs.value.unshift(`[${timestamp}] ${message}`)
    if (cacheDebugLogs.value.length > 20) {
      cacheDebugLogs.value = cacheDebugLogs.value.slice(0, 20)
    }
  }

  // Update cache key list
  const updateCacheKeys = (key: string, operation: 'add' | 'remove' = 'add') => {
    if (operation === 'add' && !cacheKeys.value.includes(key)) {
      cacheKeys.value.push(key)
      addCacheLog(`🔑 Added cache key: ${getCacheKeySummary(key)}`)
    } else if (operation === 'remove') {
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
        addCacheLog(`🗑️ Removed cache key: ${getCacheKeySummary(key)}`)
      }
    }
  }

  // Get cache key summary
  const getCacheKeySummary = (key: string) => {
    try {
      const params = JSON.parse(key)
      return `Page: ${params.current || 1}, Size: ${params.size || 20}${params.name ? ', Name: ' + params.name : ''}${params.status ? ', Status: ' + params.status : ''}`
    } catch {
      return 'Invalid cache key'
    }
  }

  // Force refresh cache info
  const forceRefreshCacheInfo = () => {
    // Simulate updating cache key info
    const currentStats = cacheInfo.value
    addCacheLog(`🔄 Cache info refreshed: ${currentStats.total} entries`)

    // Reset cache key list since we cannot access cache contents directly
    if (currentStats.total === 0) {
      cacheKeys.value = []
    }

    // Trigger recompute of cache stats
    nextTick(() => {
      console.log('Current cache stats:', cacheInfo.value)
    })
  }

  // Watch pagination and search state changes
  watch(
    () => [pagination.current, pagination.size, searchFormState.value],
    ([current, size, search]) => {
      requestParams.value = {
        ...(search as any),
        current,
        size
      }
    },
    { deep: true, immediate: true }
  )

  /**
   * Handle dynamic column configuration commands
   */
  const handleColumnCommand = (command: string): void => {
    switch (command) {
      case 'addColumn': {
        // Add "Remark" column
        addColumn?.({
          prop: 'remark',
          label: 'Remark',
          width: 150,
          formatter: () => h('span', { style: 'color: #999' }, 'No remarks')
        })
        ElMessage.success('Added "Remark" column')
        break
      }

      case 'toggleColumn': {
        // Toggle phone column visibility
        if (getColumnConfig?.('userPhone')) {
          toggleColumn?.('userPhone')
        }
        break
      }

      case 'removeColumn': {
        // Remove column
        removeColumn?.('status')
        break
      }

      case 'reorderColumns': {
        // Swap gender and phone column positions
        const allCols = getAllColumns?.()
        if (allCols) {
          const genderIndex = allCols.findIndex((col) => getColumnKey(col) === 'userGender')
          const phoneIndex = allCols.findIndex((col) => getColumnKey(col) === 'userPhone')

          if (genderIndex !== -1 && phoneIndex !== -1) {
            reorderColumns?.(genderIndex, phoneIndex)
            ElMessage.success('Swapped Gender and Phone column positions')
          }
        }
        break
      }

      case 'updateColumn': {
        // Update phone column title
        updateColumn?.('userPhone', {
          label: 'Contact Number',
          width: 140
        })
        ElMessage.success('Phone column title updated to "Contact Number"')
        break
      }

      case 'batchUpdate': {
        // Batch update
        batchUpdateColumns?.([
          { prop: 'userGender', updates: { width: 200, label: 'Gender-update', sortable: false } },
          {
            prop: 'userPhone',
            updates: { width: 200, label: 'Phone Number-update', sortable: false }
          }
        ])
        break
      }

      case 'resetColumns': {
        // Reset all columns
        resetColumns?.()
        ElMessage.success('Reset all column configuration')
        break
      }

      default:
        console.warn('Unknown column configuration command:', command)
    }
  }
</script>

<style lang="scss" scoped>
  .advanced-table-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;

    .intro-card {
      .intro-header {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        justify-content: space-between;

        h3 {
          margin: 0;
        }

        .intro-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }

      .intro-content {
        .intro-text {
          margin: 0 0 16px;
          line-height: 1.6;
          color: var(--el-text-color-regular);
        }

        .debug-panel {
          margin: 16px 0;

          .debug-info {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .stat-item {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .label {
                font-weight: 500;
                color: var(--el-text-color-regular);
              }

              .value {
                font-weight: 600;
                color: var(--el-color-primary);
              }
            }

            .debug-actions {
              display: flex;
              gap: 8px;
              margin-top: 8px;
            }
          }
        }

        .feature-toggles {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 16px;
        }
      }
    }

    .art-table-card {
      flex: 1;

      .table-header-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h4 {
          margin: 0;
        }

        .table-info {
          display: flex;
          gap: 8px;
        }
      }

      .user-info {
        display: flex;
        gap: 12px;
        align-items: center;

        .el-avatar {
          flex-shrink: 0;
          width: 40px !important;
          height: 40px !important;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }

        .user-details {
          flex: 1;
          min-width: 0;

          .user-name {
            margin: 0;
            overflow: hidden;
            font-weight: 500;
            color: var(--el-text-color-primary);
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .user-email {
            margin: 4px 0 0;
            overflow: hidden;
            font-size: 12px;
            color: var(--el-text-color-regular);
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .operation-buttons {
        display: flex;
      }

      .custom-header {
        display: inline-block;
        gap: 4px;
        align-items: center;
        color: var(--el-color-primary);
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary-light-3);
        }
      }
    }

    .advanced-features-card {
      .feature-demo-section {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .demo-group {
          padding: 16px;
          background: var(--el-bg-color-page);
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 8px;

          h5 {
            margin: 0 0 16px;
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .demo-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }
          }

          .config-toggles {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 12px;

            .el-switch {
              --el-switch-on-color: var(--el-color-primary);
            }
          }

          .event-logs {
            padding: 12px;
            margin-top: 12px;
            background: var(--el-bg-color-page);
            border: 1px solid var(--el-border-color-light);
            border-radius: 6px;

            .log-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
              font-weight: 500;
              color: var(--el-text-color-regular);
            }

            .log-list {
              display: flex;
              flex-direction: column;
              gap: 4px;
              max-height: 200px;
              overflow-y: auto;

              .log-item {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 6px 8px;
                font-size: 12px;
                background: var(--el-bg-color);
                border-left: 3px solid var(--el-border-color);
                border-radius: 4px;

                .log-message {
                  flex: 1;
                  color: var(--el-text-color-regular);
                }

                .log-time {
                  font-size: 11px;
                  color: var(--el-text-color-placeholder);
                }
              }
            }
          }

          .performance-info {
            margin-top: 12px;

            .el-alert {
              --el-alert-padding: 12px;
            }
          }
        }
      }
    }

    .refresh-demo-card {
      .refresh-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }

  // Responsive design
  @media (width <=768px) {
    .advanced-table-demo {
      .intro-card .intro-header {
        flex-direction: column;
        align-items: flex-start;

        .intro-badges {
          width: 100%;
        }
      }

      .refresh-demo-card .refresh-buttons {
        flex-direction: column;
      }
    }
  }

  .request-params {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .params-display {
      max-height: 200px;
      padding: 8px;
      overflow-y: auto;
      font-size: 12px;
      background: var(--el-bg-color-page);
      border: 1px solid var(--el-border-color-light);
      border-radius: 6px;
    }
  }

  .logs-container {
    max-height: 200px;
    overflow-y: auto;

    .empty-logs {
      padding: 20px;
      text-align: center;
    }

    .log-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .log-item {
        padding: 6px 8px;
        font-size: 12px;
        line-height: 1.4;
        background: var(--el-bg-color-page);
        border-left: 3px solid var(--el-border-color);
        border-radius: 4px;

        &.log-success {
          background: rgb(103 194 58 / 10%);
          border-left-color: var(--el-color-success);
        }

        &.log-cache {
          background: rgb(64 158 255 / 10%);
          border-left-color: var(--el-color-primary);
        }

        &.log-error {
          background: rgb(245 108 108 / 10%);
          border-left-color: var(--el-color-danger);
        }
      }
    }
  }
</style>
