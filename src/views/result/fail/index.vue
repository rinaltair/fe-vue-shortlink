<template>
  <ArtResultPage
    type="fail"
    title="Submission Failed"
    message="Please review and correct the following, then resubmit."
    iconCode="&#xe665;"
  >
    <template #content>
      <p>The submission contains these issues:</p>
      <p><i class="icon iconfont-sys">&#xe71a;</i>Your account is frozen</p>
      <p><i class="icon iconfont-sys">&#xe71a;</i>Your account is not eligible to apply</p>
    </template>
    <template #buttons>
      <el-button type="primary" v-ripple>Back to Edit</el-button>
      <el-button v-ripple>View</el-button>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultFail' })
</script>
