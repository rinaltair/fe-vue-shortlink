<template>
  <div class="art-full-height">
    <div class="tree-container">
      <div class="left-sidebar">
        <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
          <b>Left-right layout example:</b>
          <p style="margin-top: 20px">For example: categories, tree structures, etc.</p>
        </ElCard>
      </div>

      <div class="right-content art-full-height">
        <UserSearch v-model="defaultFilter" />

        <ElCard class="art-table-card" shadow="never">
          <ArtTableHeader v-model:columns="columnChecks" @refresh="refreshData">
            <template #left>
              <ElButton v-ripple>Add User</ElButton>
            </template>
          </ArtTableHeader>

          <ArtTable
            rowKey="id"
            :loading="loading"
            :data="data"
            :columns="columns"
            :pagination="pagination"
            @pagination:size-change="handleSizeChange"
            @pagination:current-change="handleCurrentChange"
          >
          </ArtTable>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'
  import { ElButton, ElCard } from 'element-plus'
  import UserSearch from '@/views/system/user/modules/user-search.vue'

  defineOptions({ name: 'TreeTable' })

  // Initial search form values
  const defaultFilter = ref({
    name: undefined
  })

  const {
    data,
    columns,
    columnChecks,
    loading,
    pagination,
    refreshData,
    handleSizeChange,
    handleCurrentChange
  } = useTable<Api.User.UserListItem>({
    core: {
      apiFn: UserService.getUserList,
      apiParams: {
        current: 1,
        size: 20,
        name: '',
        phone: '',
        address: undefined
      },
      columnsFactory: () => [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'nickName',
          label: 'Nickname'
        },
        {
          prop: 'userGender',
          label: 'Gender',
          sortable: true,
          formatter: (row) => row.userGender || 'Unknown'
        },
        {
          prop: 'userPhone',
          label: 'Phone Number'
        },
        {
          prop: 'userEmail',
          label: 'Email'
        }
      ]
    }
  })
</script>

<style lang="scss" scoped>
  .tree-container {
    box-sizing: border-box;
    display: flex;
    gap: 16px;
    height: 100%;

    .left-sidebar {
      flex-shrink: 0;
      width: 230px;
      height: 100%;
    }

    .right-content {
      flex-grow: 1;
      min-width: 0;
      height: 100%;
    }

    .art-table-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

  @media screen and (max-width: $device-ipad) {
    .tree-container {
      display: block;
      gap: 0;
      height: auto;

      .left-sidebar {
        width: 100%;
        height: auto;
        margin-bottom: 20px;
      }
    }
  }
</style>
