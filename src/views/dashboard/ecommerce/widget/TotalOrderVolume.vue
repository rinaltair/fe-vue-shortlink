<template>
  <div class="card art-custom-card" style="height: 13.3rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px">205,216</p>
      <p class="subtitle">Total Orders</p>
    </div>
    <ArtRingChart
      :data="[
        { value: 30, name: 'Completed' },
        { value: 25, name: 'Processing' },
        { value: 45, name: 'To Ship' }
      ]"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['56%', '76%']"
      height="7rem"
      :showLabel="false"
      :borderRadius="0"
    />
  </div>
</template>
