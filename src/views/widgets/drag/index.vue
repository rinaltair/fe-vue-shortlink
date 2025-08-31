<!-- https://vue-draggable-plus.pages.dev/ -->
<template>
  <div class="page-content">
    <ElRow>
      <ElCard shadow="never" style="width: 300px; margin-right: 20px">
        <template #header>
          <span class="card-header">Basic Example</span>
        </template>
        <template #default>
          <VueDraggable ref="el" v-model="userList">
            <div class="demo1-item" v-for="item in userList" :key="item.name">
              {{ item.name }}
            </div>
          </VueDraggable>
        </template>
      </ElCard>

      <ElCard shadow="never" style="width: 300px">
        <template #header>
          <span class="card-header">Transition Animations</span>
        </template>
        <template #default>
          <VueDraggable v-model="userList" target=".sort-target" :scroll="true">
            <TransitionGroup type="transition" tag="ul" name="fade" class="sort-target">
              <li v-for="item in userList" :key="item.name" class="demo1-item">
                {{ item.name }}
              </li>
            </TransitionGroup>
          </VueDraggable>
        </template>
      </ElCard>
    </ElRow>

    <ElCard shadow="never">
      <template #header>
        <span class="card-header">Table Drag Sort</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" v-model="userList" :animation="150">
          <ArtTable :data="userList">
            <ElTableColumn label="Name" prop="name" />
            <ElTableColumn label="Role" prop="role" />
          </ArtTable>
        </VueDraggable>
      </template>
    </ElCard>

    <ElCard shadow="never">
      <template #header>
        <span class="card-header">Drag Sort with Handle</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" handle=".handle" v-model="userList" :animation="150">
          <ArtTable :data="userList">
            <ElTableColumn label="Name" prop="name" />
            <ElTableColumn label="Role" prop="role" />
            <ElTableColumn label="Actions" width="100">
              <ElButton size="default" class="handle"> Move </ElButton>
            </ElTableColumn>
          </ArtTable>
        </VueDraggable>
      </template>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { VueDraggable } from 'vue-draggable-plus'

  const userList = ref([
    { name: 'Alice', role: 'Designer' },
    { name: 'Bob', role: 'Developer' },
    { name: 'Carol', role: 'Product Manager' },
    { name: 'Dave', role: 'QA Engineer' }
  ])
</script>

<style lang="scss" scoped>
  .page-content {
    .demo1-item {
      padding: 10px;
      margin-bottom: 10px;
      cursor: move;
      background-color: rgba(var(--art-gray-200-rgb), 0.8);
      border-radius: 4px;
    }

    .el-card {
      margin-bottom: 30px;

      .card-header {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }

  .fade-leave-active {
    position: absolute;
  }
</style>
