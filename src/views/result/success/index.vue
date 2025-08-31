<template>
  <ArtResultPage
    type="success"
    title="Submission Successful"
    message="This result page summarizes the outcome of a sequence of tasks. For simple actions, use a global Message. The gray area can display supplemental information."
    iconCode="&#xe617;"
  >
    <template #content>
      <p>Your application has been submitted and is awaiting review.</p>
    </template>
    <template #buttons>
      <el-button type="primary" v-ripple>Back to Edit</el-button>
      <el-button v-ripple>View</el-button>
      <el-button v-ripple>Print</el-button>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultSuccess' })
</script>
