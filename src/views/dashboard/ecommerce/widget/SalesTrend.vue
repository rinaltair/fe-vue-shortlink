<template>
  <div class="card art-custom-card" style="height: 26rem">
    <div class="card-header">
      <p class="title">Sales Trend</p>
      <p class="subtitle">Monthly Comparison</p>
    </div>
    <ArtDualBarCompareChart
      :positiveData="[50, 80, 120, 90, 60]"
      :negativeData="[30, 60, 90, 70, 40]"
      :xAxisData="['Jan', 'Feb', 'Mar', 'Apr', 'May']"
      height="19rem"
    />
  </div>
</template>
