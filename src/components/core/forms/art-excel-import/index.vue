<!-- Import Excel file -->
<template>
  <div class="excel-uploader">
    <ElUpload
      :auto-upload="false"
      accept=".xlsx, .xls"
      :show-file-list="false"
      @change="handleFileChange"
    >
      <ElButton type="primary" v-ripple>
        <slot>Import Excel</slot>
      </ElButton>
    </ElUpload>
  </div>
</template>

<script setup lang="ts">
  import * as XLSX from 'xlsx'
  import type { UploadFile } from 'element-plus'

  defineOptions({ name: 'ArtExcelImport' })

  // Excel import utility
  async function importExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const results = XLSX.utils.sheet_to_json(worksheet)
          resolve(results)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  // Define emits
  const emit = defineEmits<{
    'import-success': [data: any[]]
    'import-error': [error: Error]
  }>()

  // Handle file import
  const handleFileChange = async (uploadFile: UploadFile) => {
    try {
      if (!uploadFile.raw) return
      const results = await importExcel(uploadFile.raw)
      emit('import-success', results)
    } catch (error) {
      emit('import-error', error as Error)
    }
  }
</script>

<style scoped>
  .excel-uploader {
    display: inline-block;
  }
</style>
