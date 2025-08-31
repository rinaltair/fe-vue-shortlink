<template>
  <div class="page-content">
    <ArtExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
      <template #import-text> Upload Excel </template>
    </ArtExcelImport>

    <ArtExcelExport
      style="margin-left: 10px"
      :data="tableData"
      filename="users-1"
      sheetName="Users"
      type="success"
      :headers="headers"
      auto-index
      :columns="columnConfig"
      @export-success="handleExportSuccess"
      @export-error="handleExportError"
      @export-progress="handleProgress"
    >
      Export Excel
    </ArtExcelExport>

    <ElButton type="danger" @click="handleClear" v-ripple>Clear Data</ElButton>

    <ArtTable :data="tableData" style="margin-top: 10px">
      <ElTableColumn
        v-for="key in Object.keys(headers)"
        :key="key"
        :prop="key"
        :label="headers[key as keyof typeof headers]"
      />
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  interface TableData {
    name: string
    age: number
    city: string
  }

  const handleImportSuccess = (data: any[]) => {
    // Convert imported data to the correct format
    const formattedData = data.map((item) => ({
      name: item['Name'],
      age: Number(item['Age']),
      city: item['City']
    }))
    tableData.value = formattedData

    // tableData.value = data
  }

  const handleImportError = (error: Error) => {
    // Handle import error
    console.error('Import failed:', error)
  }

  // Typed ref for demo data
  const tableData = ref<TableData[]>([
    { name: 'Liam', age: 20, city: 'Shanghai' },
    { name: 'Emma', age: 25, city: 'Beijing' },
    { name: 'Noah', age: 30, city: 'Guangzhou' },
    { name: 'Olivia', age: 35, city: 'Shenzhen' },
    { name: 'Ava', age: 28, city: 'Hangzhou' },
    { name: 'Ethan', age: 32, city: 'Chengdu' },
    { name: 'Mia', age: 27, city: 'Wuhan' },
    { name: 'Lucas', age: 40, city: 'Nanjing' },
    { name: 'Sophia', age: 22, city: 'Chongqing' },
    { name: 'James', age: 33, city: 'Xi’an' }
  ])

  // Custom header mapping
  const headers = {
    name: 'Name',
    age: 'Age',
    city: 'City'
  }

  const columnConfig = {
    name: {
      title: 'Name',
      width: 20,
      formatter: (value: any) => value || 'Unknown'
    },
    age: {
      title: 'Age',
      width: 10,
      formatter: (value: any) => `${value} yrs`
    },
    city: {
      title: 'City',
      width: 12,
      formatter: (value: any) => value
    }
  }

  const handleExportSuccess = () => {
    console.log('Export succeeded')
  }

  const handleExportError = (error: Error) => {
    ElMessage.error(`Export failed: ${error.message}`)
  }

  const handleProgress = (progress: number) => {
    console.log('Export progress:', progress)
  }

  const handleClear = () => {
    tableData.value = []
  }
</script>
