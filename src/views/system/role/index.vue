<template>
  <div class="page-content">
    <ElForm>
      <ElRow :gutter="12">
        <ElCol :xs="24" :sm="12" :lg="6">
          <ElFormItem>
            <ElInput placeholder="Please enter role name" v-model="form.roleName"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12" :lg="6">
          <ElFormItem>
            <ElButton v-ripple>Search</ElButton>
            <ElButton @click="showDialog('add')" v-ripple>Add Role</ElButton>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <ArtTable :data="roleList">
      <template #default>
        <ElTableColumn label="Role Name" prop="roleName" />
        <ElTableColumn label="Role Code" prop="roleCode" />
        <ElTableColumn label="Description" prop="des" />
        <ElTableColumn label="Enabled" prop="enable">
          <template #default="scope">
            <ElTag :type="scope.row.enable ? 'primary' : 'info'">
              {{ scope.row.enable ? 'Enabled' : 'Disabled' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Created At" prop="date">
          <template #default="scope">
            {{ formatDate(scope.row.date) }}
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="Actions" width="100px">
          <template #default="scope">
            <ElRow>
              <!-- Tip: You can add an auth property in list items to control button permissions. The value is the permission mark. -->
              <ArtButtonMore
                :list="[
                  { key: 'permission', label: 'Menu Permissions' },
                  { key: 'edit', label: 'Edit Role' },
                  { key: 'delete', label: 'Delete Role' }
                ]"
                @click="buttonMoreClick($event, scope.row)"
              />
            </ElRow>
          </template>
        </ElTableColumn>
      </template>
    </ArtTable>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Add Role' : 'Edit Role'"
      width="30%"
      align-center
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
        <ElFormItem label="Role Name" prop="roleName">
          <ElInput v-model="form.roleName" />
        </ElFormItem>
        <ElFormItem label="Role Code" prop="roleCode">
          <ElInput v-model="form.roleCode" />
        </ElFormItem>
        <ElFormItem label="Description" prop="roleStatus">
          <ElInput v-model="form.des" type="textarea" :rows="3" />
        </ElFormItem>
        <ElFormItem label="Enabled">
          <ElSwitch v-model="form.enable" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogVisible = false">Cancel</ElButton>
          <ElButton type="primary" @click="handleSubmit(formRef)">Submit</ElButton>
        </div>
      </template>
    </ElDialog>

    <ElDialog
      v-model="permissionDialog"
      title="Menu Permissions"
      width="520px"
      align-center
      class="el-dialog-border"
    >
      <ElScrollbar height="70vh">
        <ElTree
          ref="treeRef"
          :data="processedMenuList"
          show-checkbox
          node-key="name"
          :default-expand-all="isExpandAll"
          :default-checked-keys="[1, 2, 3]"
          :props="defaultProps"
          @check="handleTreeCheck"
        >
          <template #default="{ data }">
            <div style="display: flex; align-items: center">
              <span v-if="data.isAuth">
                {{ data.label }}
              </span>
              <span v-else>{{ defaultProps.label(data) }}</span>
            </div>
          </template>
        </ElTree>
      </ElScrollbar>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="toggleExpandAll">{{
            isExpandAll ? 'Collapse All' : 'Expand All'
          }}</ElButton>
          <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{
            isSelectAll ? 'Unselect All' : 'Select All'
          }}</ElButton>
          <ElButton type="primary" @click="savePermission">Save</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { Role, ROLE_LIST_DATA } from '@/mock/temp/formData'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'

  defineOptions({ name: 'Role' })

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const { menuList } = storeToRefs(useMenuStore())
  const treeRef = ref()
  const isExpandAll = ref(true)
  const isSelectAll = ref(false)

  // Process menu data: convert authList to child nodes
  const processedMenuList = computed(() => {
    const processNode = (node: any) => {
      const processed = { ...node }

      // If node has authList, convert to child nodes
      if (node.meta && node.meta.authList && node.meta.authList.length) {
        const authNodes = node.meta.authList.map((auth: any) => ({
          id: `${node.id}_${auth.authMark}`,
          name: `${node.name}_${auth.authMark}`,
          label: auth.title,
          authMark: auth.authMark,
          isAuth: true,
          checked: auth.checked || false
        }))

        processed.children = processed.children ? [...processed.children, ...authNodes] : authNodes
      }

      // Recursively process children
      if (processed.children) {
        processed.children = processed.children.map(processNode)
      }

      return processed
    }

    return menuList.value.map(processNode)
  })

  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: 'Please enter role name', trigger: 'blur' },
      { min: 2, max: 20, message: 'Length 2 to 20 characters', trigger: 'blur' }
    ],
    des: [{ required: true, message: 'Please enter role description', trigger: 'blur' }]
  })

  const form = reactive<Role>({
    roleName: '',
    roleCode: '',
    des: '',
    date: '',
    enable: true
  })

  const roleList = ref<Role[]>([])

  onMounted(() => {
    getTableData()
  })

  const getTableData = () => {
    roleList.value = ROLE_LIST_DATA
  }

  const dialogType = ref('add')

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.roleName = row.roleName
      form.roleCode = row.roleCode
      form.des = row.des
      form.date = row.date
      form.enable = row.enable
    } else {
      form.roleName = ''
      form.roleCode = ''
      form.des = ''
      form.date = ''
      form.enable = true
    }
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: any) => {
    if (item.key === 'permission') {
      showPermissionDialog()
    } else if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      deleteRole()
    }
  }

  const showPermissionDialog = () => {
    permissionDialog.value = true
  }

  const defaultProps = {
    children: 'children',
    label: (data: any) => formatMenuTitle(data.meta?.title) || ''
  }

  const deleteRole = () => {
    ElMessageBox.confirm('Are you sure to delete this role?', 'Delete Confirmation', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'error'
    }).then(() => {
      ElMessage.success('Deleted successfully')
    })
  }

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((valid) => {
      if (valid) {
        const message = dialogType.value === 'add' ? 'Added successfully' : 'Updated successfully'
        ElMessage.success(message)
        dialogVisible.value = false
        formEl.resetFields()
      }
    })
  }

  const savePermission = () => {
    ElMessage.success('Permissions saved successfully')
    permissionDialog.value = false
  }

  const toggleExpandAll = () => {
    const tree = treeRef.value
    if (!tree) return

    // Use store.nodesMap to control expanded state of all nodes
    const nodes = tree.store.nodesMap
    for (const node in nodes) {
      nodes[node].expanded = !isExpandAll.value
    }

    isExpandAll.value = !isExpandAll.value
  }

  const toggleSelectAll = () => {
    const tree = treeRef.value
    if (!tree) return

    if (!isSelectAll.value) {
      // Select all: get all node keys and set as checked
      const allKeys = getAllNodeKeys(processedMenuList.value)
      tree.setCheckedKeys(allKeys)
    } else {
      // Unselect all: clear all checks
      tree.setCheckedKeys([])
    }

    isSelectAll.value = !isSelectAll.value
  }

  const getAllNodeKeys = (nodes: any[]): string[] => {
    const keys: string[] = []
    const traverse = (nodeList: any[]) => {
      nodeList.forEach((node) => {
        if (node.name) {
          keys.push(node.name)
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return keys
  }

  const handleTreeCheck = () => {
    const tree = treeRef.value
    if (!tree) return

    // Use tree.getCheckedKeys() to get selected nodes
    const checkedKeys = tree.getCheckedKeys()
    const allKeys = getAllNodeKeys(processedMenuList.value)

    // Determine select-all: selected count equals total node count
    isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0
  }

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/\//g, '-')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
