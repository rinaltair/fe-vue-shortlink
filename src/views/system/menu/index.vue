<template>
  <div class="menu-page art-full-height">
    <!-- Search bar -->
    <ArtSearchBar
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    ></ArtSearchBar>

    <ElCard class="art-table-card" shadow="never">
      <!-- Table header -->
      <ArtTableHeader :showZebra="false" v-model:columns="columnChecks" @refresh="handleRefresh">
        <template #left>
          <!-- Button auth: backend-controlled via directive -->
          <ElButton v-auth="'add'" @click="showModel('menu', null, true)" v-ripple>
            Add Menu
          </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? 'Collapse' : 'Expand' }}
          </ElButton>
          <!-- Button auth: frontend-controlled via hasAuth() -->
          <ElButton v-if="hasAuth('add')" @click="showModel('menu', null, true)" v-ripple>
            Add Menu
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="path"
        :loading="loading"
        :columns="columns"
        :data="filteredTableData"
        :stripe="false"
      />

      <ElDialog :title="dialogTitle" v-model="dialogVisible" width="700px" align-center>
        <ElForm ref="formRef" :model="form" :rules="rules" label-width="85px">
          <ElFormItem label="Menu Type">
            <ElRadioGroup v-model="labelPosition" :disabled="disableMenuType">
              <ElRadioButton value="menu" label="menu">Menu</ElRadioButton>
              <ElRadioButton value="button" label="button">Permission</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>

          <template v-if="labelPosition === 'menu'">
            <ElRow :gutter="20">
              <ElCol :span="12">
                <ElFormItem label="Menu Name" prop="name">
                  <ElInput v-model="form.name" placeholder="Menu Name"></ElInput>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="Route Path" prop="path">
                  <ElInput v-model="form.path" placeholder="Route Path"></ElInput>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow :gutter="20">
              <ElCol :span="12">
                <ElFormItem label="Permission Mark" prop="label">
                  <ElInput v-model="form.label" placeholder="Permission Mark"></ElInput>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="Icon" prop="icon">
                  <ArtIconSelector v-model="form.icon" :iconType="iconType" width="100%" />
                </ElFormItem>
              </ElCol>
            </ElRow>

            <ElRow :gutter="20">
              <ElCol :span="12">
                <ElFormItem label="Order" prop="sort" style="width: 100%">
                  <ElInputNumber
                    v-model="form.sort"
                    style="width: 100%"
                    @change="handleChange"
                    :min="1"
                    controls-position="right"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="External Link" prop="link">
                  <ElInput
                    v-model="form.link"
                    placeholder="External/embedded URL (https://example.com)"
                  ></ElInput>
                </ElFormItem>
              </ElCol>
            </ElRow>

            <ElRow :gutter="20">
              <ElCol :span="5">
                <ElFormItem label="Enabled" prop="isEnable">
                  <ElSwitch v-model="form.isEnable"></ElSwitch>
                </ElFormItem>
              </ElCol>
              <ElCol :span="5">
                <ElFormItem label="Cache Page" prop="keepAlive">
                  <ElSwitch v-model="form.keepAlive"></ElSwitch>
                </ElFormItem>
              </ElCol>
              <ElCol :span="5">
                <ElFormItem label="Visible" prop="isHide">
                  <ElSwitch v-model="form.isHide"></ElSwitch>
                </ElFormItem>
              </ElCol>
              <ElCol :span="5">
                <ElFormItem label="Embedded" prop="isMenu">
                  <ElSwitch v-model="form.isIframe"></ElSwitch>
                </ElFormItem>
              </ElCol>
            </ElRow>
          </template>

          <template v-if="labelPosition === 'button'">
            <ElRow :gutter="20">
              <ElCol :span="12">
                <ElFormItem label="Permission Name" prop="authName">
                  <ElInput v-model="form.authName" placeholder="Permission Name"></ElInput>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem label="Permission Mark" prop="authLabel">
                  <ElInput v-model="form.authLabel" placeholder="Permission Mark"></ElInput>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow :gutter="20">
              <ElCol :span="12">
                <ElFormItem label="Permission Order" prop="authSort" style="width: 100%">
                  <ElInputNumber
                    v-model="form.authSort"
                    style="width: 100%"
                    @change="handleChange"
                    :min="1"
                    controls-position="right"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
          </template>
        </ElForm>

        <template #footer>
          <span class="dialog-footer">
            <ElButton @click="dialogVisible = false">Cancel</ElButton>
            <ElButton type="primary" @click="submitForm()">Confirm</ElButton>
          </span>
        </template>
      </ElDialog>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { IconTypeEnum } from '@/enums/appEnum'
  import { formatMenuTitle } from '@/router/utils/utils'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTableColumns } from '@/composables/useTableColumns'
  import { ElPopover, ElButton } from 'element-plus'
  import { AppRouteRecord } from '@/types/router'
  import { useAuth } from '@/composables/useAuth'

  defineOptions({ name: 'Menus' })

  const { hasAuth } = useAuth()

  const { menuList } = storeToRefs(useMenuStore())

  const loading = ref(false)

  // Initial search state
  const initialSearchState = {
    name: '',
    route: ''
  }

  // Reactive form data
  const formFilters = reactive({ ...initialSearchState })

  // Applied filters state
  const appliedFilters = reactive({ ...initialSearchState })

  // Reset form
  const handleReset = () => {
    Object.assign(formFilters, { ...initialSearchState })
    Object.assign(appliedFilters, { ...initialSearchState })
    getTableData()
  }

  // Handle search
  const handleSearch = () => {
    // Apply current filter inputs to search
    Object.assign(appliedFilters, { ...formFilters })
    getTableData()
  }

  // Form items
  const formItems = computed(() => [
    {
      label: 'Menu Name',
      key: 'name',
      type: 'input',
      props: {
        clearable: true
      }
    },
    {
      label: 'Route',
      key: 'route',
      type: 'input',
      props: {
        clearable: true
      }
    }
  ])

  // Build menu type tag
  const buildMenuTypeTag = (row: AppRouteRecord) => {
    if (row.children && row.children.length > 0) {
      return 'info'
    } else if (row.meta?.link && row.meta?.isIframe) {
      return 'success'
    } else if (row.path) {
      return 'primary'
    } else if (row.meta?.link) {
      return 'warning'
    }
  }

  // Build menu type text
  const buildMenuTypeText = (row: AppRouteRecord) => {
    if (row.children && row.children.length > 0) {
      return 'Directory'
    } else if (row.meta?.link && row.meta?.isIframe) {
      return 'Embedded'
    } else if (row.path) {
      return 'Menu'
    } else if (row.meta?.link) {
      return 'External'
    }
  }

  // Dynamic columns
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'meta.title',
      label: 'Menu Name',
      minWidth: 120,
      formatter: (row: AppRouteRecord) => {
        return formatMenuTitle(row.meta?.title)
      }
    },
    {
      prop: 'type',
      label: 'Menu Type',
      formatter: (row: AppRouteRecord) => {
        return h(ElTag, { type: buildMenuTypeTag(row) }, () => buildMenuTypeText(row))
      }
    },
    {
      prop: 'path',
      label: 'Route',
      formatter: (row: AppRouteRecord) => {
        return row.meta?.link || row.path || ''
      }
    },
    {
      prop: 'meta.authList',
      label: 'Actions',
      formatter: (row: AppRouteRecord) => {
        return h(
          'div',
          {},
          row.meta.authList?.map((item: { title: string; authMark: string }, index: number) => {
            return h(
              ElPopover,
              {
                placement: 'top-start',
                title: 'Actions',
                width: 200,
                trigger: 'click',
                key: index
              },
              {
                default: () =>
                  h('div', { style: 'margin: 0; text-align: right' }, [
                    h(
                      ElButton,
                      {
                        size: 'small',
                        type: 'primary',
                        onClick: () => showModel('button', item)
                      },
                      { default: () => 'Edit' }
                    ),
                    h(
                      ElButton,
                      {
                        size: 'small',
                        type: 'danger',
                        onClick: () => deleteAuth()
                      },
                      { default: () => 'Delete' }
                    )
                  ]),
                reference: () => h(ElButton, { class: 'small-btn' }, { default: () => item.title })
              }
            )
          })
        )
      }
    },
    {
      prop: 'date',
      label: 'Edited Time',
      formatter: () => '2022-3-12 12:00:00'
    },
    {
      prop: 'status',
      label: 'Hidden',
      formatter: (row) => {
        return h(ElTag, { type: row.meta.isHide ? 'danger' : 'info' }, () =>
          row.meta.isHide ? 'Yes' : 'No'
        )
      }
    },
    {
      prop: 'operation',
      label: 'Operations',
      width: 180,
      formatter: (row: AppRouteRecord) => {
        return h('div', [
          // Two sets of permission checks for demo; remove one set in real projects
          // Frontend-mode permission marks
          hasAuth('B_CODE1') &&
            h(ArtButtonTable, {
              type: 'add',
              onClick: () => showModel('menu')
            }),
          hasAuth('B_CODE2') &&
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => showDialog('edit', row)
            }),
          hasAuth('B_CODE3') &&
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => deleteMenu()
            }),
          // Backend-mode permission marks
          hasAuth('add') &&
            h(ArtButtonTable, {
              type: 'add',
              onClick: () => showModel('menu')
            }),
          hasAuth('edit') &&
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => showDialog('edit', row)
            }),
          hasAuth('delete') &&
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => deleteMenu()
            })
        ])
      }
    }
  ])

  const handleRefresh = () => {
    getTableData()
  }

  const dialogVisible = ref(false)
  const form = reactive({
    // Menu
    name: '',
    path: '',
    label: '',
    icon: '',
    isEnable: true,
    sort: 1,
    isMenu: true,
    keepAlive: true,
    isHide: true,
    link: '',
    isIframe: false,
    // Permission (edit this section)
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  })
  const iconType = ref(IconTypeEnum.UNICODE)

  const labelPosition = ref('menu')
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: 'Please enter menu name', trigger: 'blur' },
      { min: 2, max: 20, message: 'Length 2 to 20 characters', trigger: 'blur' }
    ],
    path: [{ required: true, message: 'Please enter route path', trigger: 'blur' }],
    label: [{ required: true, message: 'Please enter permission mark', trigger: 'blur' }],
    // Edit this section
    authName: [{ required: true, message: 'Please enter permission name', trigger: 'blur' }],
    authLabel: [{ required: true, message: 'Please enter permission mark', trigger: 'blur' }]
  })

  const tableData = ref<AppRouteRecord[]>([])

  onMounted(() => {
    getTableData()
  })

  const getTableData = () => {
    loading.value = true
    setTimeout(() => {
      tableData.value = menuList.value
      loading.value = false
    }, 500)
  }

  // Filtered table data
  const filteredTableData = computed(() => {
    // Deep clone to avoid modifying original data
    const deepClone = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj
      if (obj instanceof Date) return new Date(obj)
      if (Array.isArray(obj)) return obj.map((item) => deepClone(item))

      const cloned: any = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = deepClone(obj[key])
        }
      }
      return cloned
    }

    // Recursive search function
    const searchMenu = (items: AppRouteRecord[]): AppRouteRecord[] => {
      const results: AppRouteRecord[] = []

      for (const item of items) {
        // Get search keywords (lowercased and trimmed)
        const searchName = appliedFilters.name?.toLowerCase().trim() || ''
        const searchRoute = appliedFilters.route?.toLowerCase().trim() || ''

        // Get menu title and path safely
        const menuTitle = formatMenuTitle(item.meta?.title || '').toLowerCase()
        const menuPath = (item.path || '').toLowerCase()

        // Fuzzy match using includes
        const nameMatch = !searchName || menuTitle.includes(searchName)
        const routeMatch = !searchRoute || menuPath.includes(searchRoute)

        // Recurse on children if present
        if (item.children && item.children.length > 0) {
          const matchedChildren = searchMenu(item.children)
          // If children matched, retain current node with filtered children
          if (matchedChildren.length > 0) {
            const clonedItem = deepClone(item)
            clonedItem.children = matchedChildren
            results.push(clonedItem)
            continue
          }
        }

        // If current item matches, return it
        if (nameMatch && routeMatch) {
          results.push(deepClone(item))
        }
      }

      return results
    }

    return searchMenu(tableData.value)
  })

  const isEdit = ref(false)
  const formRef = ref<FormInstance>()
  const dialogTitle = computed(() => {
    const type = labelPosition.value === 'menu' ? 'Menu' : 'Permission'
    return isEdit.value ? `Edit ${type}` : `Create ${type}`
  })

  const showDialog = (type: string, row: AppRouteRecord) => {
    showModel('menu', row, true)
  }

  const handleChange = () => {}

  const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          ElMessage.success(`${isEdit.value ? 'Edited' : 'Added'} successfully`)
          dialogVisible.value = false
        } catch {
          ElMessage.error(`${isEdit.value ? 'Edit' : 'Add'} failed`)
        }
      }
    })
  }

  const showModel = (type: string, row?: any, lock: boolean = false) => {
    dialogVisible.value = true
    labelPosition.value = type
    isEdit.value = false
    lockMenuType.value = lock
    resetForm()

    if (row) {
      isEdit.value = true
      nextTick(() => {
        // Populate form data
        if (type === 'menu') {
          // Populate menu data
          form.name = formatMenuTitle(row.meta.title)
          form.path = row.path
          form.label = row.name
          form.icon = row.meta.icon
          form.sort = row.meta.sort || 1
          form.isMenu = row.meta.isMenu
          form.keepAlive = row.meta.keepAlive
          form.isHide = row.meta.isHide || true
          form.isEnable = row.meta.isEnable || true
          form.link = row.meta.link
          form.isIframe = row.meta.isIframe || false
        } else {
          // Populate permission button data
          form.authName = row.title
          form.authLabel = row.authMark
          form.authIcon = row.icon || ''
          form.authSort = row.sort || 1
        }
      })
    }
  }

  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      // Menu
      name: '',
      path: '',
      label: '',
      icon: '',
      sort: 1,
      isMenu: true,
      keepAlive: true,
      isHide: true,
      link: '',
      isIframe: false,
      // Permission
      authName: '',
      authLabel: '',
      authIcon: '',
      authSort: 1
    })
  }

  const deleteMenu = async () => {
    try {
      await ElMessageBox.confirm(
        'Are you sure to delete this menu? This action cannot be undone',
        'Prompt',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )

      ElMessage.success('Deleted successfully')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('Delete failed')
      }
    }
  }

  const deleteAuth = async () => {
    try {
      await ElMessageBox.confirm(
        'Are you sure to delete this permission? This action cannot be undone',
        'Prompt',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )

      ElMessage.success('Deleted successfully')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('Delete failed')
      }
    }
  }

  // Computed: lock control for menu type
  const disableMenuType = computed(() => {
    // Lock to permission when editing permission
    if (isEdit.value && labelPosition.value === 'button') return true
    // Lock to menu when editing menu
    if (isEdit.value && labelPosition.value === 'menu') return true
    // Lock to menu when clicking top Add Menu button
    if (!isEdit.value && labelPosition.value === 'menu' && lockMenuType.value) return true
    return false
  })

  // Control flag
  const lockMenuType = ref(false)

  const isExpanded = ref(false)
  const tableRef = ref()

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      if (tableRef.value && filteredTableData.value) {
        // Recursively toggle expand/collapse for all rows
        const processRows = (rows: AppRouteRecord[]) => {
          rows.forEach((row) => {
            if (row.children && row.children.length > 0) {
              tableRef.value.elTableRef.toggleRowExpansion(row, isExpanded.value)
              processRows(row.children)
            }
          })
        }
        processRows(filteredTableData.value)
      }
    })
  }
</script>

<style lang="scss" scoped>
  .menu-page {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }

    :deep(.small-btn) {
      height: 30px !important;
      padding: 0 10px !important;
      font-size: 12px !important;
    }
  }
</style>
