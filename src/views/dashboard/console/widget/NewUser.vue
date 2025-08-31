<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">New Users</h4>
        <p class="subtitle">This Month<span class="text-success">+20%</span></p>
      </div>
      <el-radio-group v-model="radio2">
        <el-radio-button value="This Month" label="This Month"></el-radio-button>
        <el-radio-button value="Last Month" label="Last Month"></el-radio-button>
        <el-radio-button value="This Year" label="This Year"></el-radio-button>
      </el-radio-group>
    </div>
    <ArtTable
      class="table"
      :data="tableData"
      style="width: 100%"
      size="large"
      :border="false"
      :stripe="false"
      :header-cell-style="{ background: 'transparent' }"
    >
      <template #default>
        <el-table-column label="Avatar" prop="avatar" width="150px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img class="avatar" :src="scope.row.avatar" alt="avatar" />
              <span class="user-name">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Region" prop="province" />
        <el-table-column label="Gender" prop="avatar">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.sex === 1 ? 'Male' : 'Female' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Progress" width="240">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.pro"
              :color="scope.row.color"
              :stroke-width="4"
              :aria-label="`${scope.row.username} completion: ${scope.row.pro}%`"
            />
          </template>
        </el-table-column>
      </template>
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue-demi'
  import avatar1 from '@/assets/img/avatar/avatar1.webp'
  import avatar2 from '@/assets/img/avatar/avatar2.webp'
  import avatar3 from '@/assets/img/avatar/avatar3.webp'
  import avatar4 from '@/assets/img/avatar/avatar4.webp'
  import avatar5 from '@/assets/img/avatar/avatar5.webp'
  import avatar6 from '@/assets/img/avatar/avatar6.webp'

  const radio2 = ref('This Month')

  const tableData = reactive([
    {
      username: 'Zhong Xiaoyu',
      province: 'Beijing',
      sex: 0,
      age: 22,
      percentage: 60,
      pro: 0,
      color: 'rgb(var(--art-primary)) !important',
      avatar: avatar1
    },
    {
      username: 'He Xiaohe',
      province: 'Shenzhen',
      sex: 1,
      age: 21,
      percentage: 20,
      pro: 0,
      color: 'rgb(var(--art-secondary)) !important',
      avatar: avatar2
    },
    {
      username: 'Soso Shen',
      province: 'Shanghai',
      sex: 1,
      age: 23,
      percentage: 60,
      pro: 0,
      color: 'rgb(var(--art-warning)) !important',
      avatar: avatar3
    },
    {
      username: 'Daydream Grass',
      province: 'Changsha',
      sex: 0,
      age: 28,
      percentage: 50,
      pro: 0,
      color: 'rgb(var(--art-info)) !important',
      avatar: avatar4
    },
    {
      username: 'Cone',
      province: 'Zhejiang',
      sex: 1,
      age: 26,
      percentage: 70,
      pro: 0,
      color: 'rgb(var(--art-error)) !important',
      avatar: avatar5
    },
    {
      username: 'Cold Moon',
      province: 'Hubei',
      sex: 1,
      age: 25,
      percentage: 90,
      pro: 0,
      color: 'rgb(var(--art-success)) !important',
      avatar: avatar6
    }
  ])

  onMounted(() => {
    addAnimation()
  })

  const addAnimation = () => {
    setTimeout(() => {
      for (let i = 0; i < tableData.length; i++) {
        let item = tableData[i]
        tableData[i].pro = item.percentage
      }
    }, 100)
  }
</script>

<style lang="scss">
  .card {
    // Progress animation
    .el-progress-bar__inner {
      transition: all 1s !important;
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      color: var(--el-color-primary) !important;
      background: transparent !important;
    }
  }
</style>

<style lang="scss" scoped>
  .card {
    width: 100%;
    height: 510px;
    overflow: hidden;

    .card-header {
      padding-left: 25px !important;
    }

    :deep(.el-table__body tr:last-child td) {
      border-bottom: none !important;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 6px;
    }

    .user-name {
      margin-left: 10px;
    }
  }
</style>
