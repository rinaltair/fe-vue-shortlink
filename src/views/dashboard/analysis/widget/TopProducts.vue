<template>
  <div class="custom-card art-custom-card top-products">
    <div class="custom-card-header">
      <span class="title">Top Products</span>
    </div>
    <div class="custom-card-body">
      <ArtTable
        :data="products"
        style="width: 100%"
        size="large"
        :border="false"
        :stripe="false"
        :header-cell-style="{ background: 'transparent' }"
      >
        <el-table-column prop="name" label="Product Name" width="200" />
        <el-table-column prop="popularity" label="Popularity">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="Sales" width="80">
          <template #default="scope">
            <span
              :style="{
                color: getColor(scope.row.popularity),
                backgroundColor: `rgba(${hexToRgb(getColor(scope.row.popularity))}, 0.08)`,
                border: '1px solid',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px'
              }"
              >{{ scope.row.sales }}</span
            >
          </template>
        </el-table-column>
      </ArtTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/ui'

  const products = computed(() => [
    {
      name: 'Smartphone',
      popularity: 10,
      sales: '100'
    },
    {
      name: 'Laptop',
      popularity: 29,
      sales: '100'
    },
    {
      name: 'Tablet',
      popularity: 65,
      sales: '100'
    },
    {
      name: 'Smartwatch',
      popularity: 32,
      sales: '100'
    },
    {
      name: 'Wireless Earbuds',
      popularity: 78,
      sales: '100'
    },
    {
      name: 'Smart Speaker',
      popularity: 41,
      sales: '100'
    }
  ])

  const getColor = (percentage: number) => {
    if (percentage < 25) return '#00E096'
    if (percentage < 50) return '#0095FF'
    if (percentage < 75) return '#884CFF'
    return '#FE8F0E'
  }
</script>

<style lang="scss" scoped>
  .custom-card {
    height: 330px;
    overflow-y: scroll;

    // Hide scrollbar
    &::-webkit-scrollbar {
      display: none;
    }

    &-body {
      padding: 0 6px;
    }
  }

  @media (width <= 1200px) {
    .custom-card {
      height: auto;
    }
  }
</style>
