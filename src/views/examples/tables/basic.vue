<!-- Basic Table -->
<template>
  <div class="user-page art-full-height">
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <!-- Table -->
      <ArtTable
        rowKey="id"
        :show-table-header="false"
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
</template>

<script setup lang="ts">
  import { useTable } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'

  defineOptions({ name: 'UserMixedUsageExample' })

  const { data, columns, loading, pagination, handleSizeChange, handleCurrentChange } =
    useTable<Api.User.UserListItem>({
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
