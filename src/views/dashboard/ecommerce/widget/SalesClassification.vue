<template>
  <div class="card art-custom-card sales-card" style="height: 26rem">
    <div class="card-header">
      <p class="title">Sales Classification</p>
      <p class="subtitle">By Product Category</p>
    </div>
    <ArtRingChart
      :data="[
        { value: 30, name: 'Electronics' },
        { value: 55, name: 'Apparel & Accessories' },
        { value: 36, name: 'Home Goods' }
      ]"
      :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
      :radius="['70%', '80%']"
      height="16.5rem"
      :showLabel="false"
      :borderRadius="0"
      centerText="¥300,458"
    />
    <div class="icon-text-widget">
      <div class="item">
        <div class="icon">
          <i class="iconfont-sys">&#xe718;</i>
        </div>
        <div class="content">
          <p>¥500,458</p>
          <span>Total Revenue</span>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <i class="iconfont-sys">&#xe70c;</i>
        </div>
        <div class="content">
          <p>¥130,580</p>
          <span>Net Profit</span>
        </div>
      </div>
    </div>
  </div>
</template>
