<template>
  <div class="banners">
    <h1 class="page-title">Basics & Custom Button + Background</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner
          title="Data Center Status"
          subtitle="Visits up 23% YoY. All services stable; monitoring normal."
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner
          title="Welcome to Art Design Pro"
          subtitle="A modern admin system built on Vue 3 + TypeScript + Element Plus."
          titleColor="#333"
          subtitleColor="#666"
          backgroundColor="#D4F1F7"
          :buttonConfig="{
            show: true,
            text: 'Start Exploring',
            color: 'rgb(var(--art-success))',
            textColor: '#fff',
            radius: '6px'
          }"
          @buttonClick="handleBannerClick"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Custom Image & Slot Content</h1>

    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner
          title="Explore the Stars"
          subtitle="Join our astronomy event and discover the cosmos."
          backgroundColor="#FF8AAB"
          :buttonConfig="{
            show: true,
            text: 'Join Now',
            color: '#FF5A89',
            textColor: '#fff'
          }"
          :imageConfig="{
            src: icon3
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner
          backgroundColor="#70B1FF"
          :imageConfig="{
            src: icon5
          }"
        >
          <template #title>
            <h2 style="margin: 0; font-size: 1.6rem; color: #fff !important"
              >Smart Component System</h2
            >
          </template>

          <template #subtitle>
            <div style="margin-top: 12px">
              <p style="position: relative; z-index: 10; font-style: italic"
                >Flexible configuration, powerful extensibility, slot-friendly content</p
              >
            </div>
          </template>

          <template #button>
            <div style="margin-top: 12px">
              <el-button type="primary" color="#04A1FF"> View Docs </el-button>
            </div>
          </template>
        </ArtBasicBanner>
      </ElCol>
    </ElRow>

    <h1 class="page-title">Abstract Config (Preset Mode)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner v-bind="PresetBanners.marketing" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12">
        <ArtBasicBanner v-bind="PresetBanners.info" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Card Banners</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" :lg="6">
        <ArtCardBanner
          title="System Operational"
          description="All core services are stable; response times are normal."
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6">
        <ArtCardBanner
          :image="icon2"
          title="Important Notifications"
          description="You have 3 pending important messages. Please review."
          :button="{
            show: true,
            text: 'View Details',
            color: 'rgb(var(--art-warning))',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6">
        <ArtCardBanner
          :image="icon3"
          title="Data Analysis Report"
          description="This week’s business analysis is ready. Check key metrics."
          :button="{
            show: true,
            text: 'Download Report',
            color: 'rgb(var(--art-error))',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6">
        <ArtCardBanner
          :image="icon4"
          title="Version Update Reminder"
          description="Art Design Pro v2.1.0 released with optimizations and new features."
          :button="{
            show: true,
            text: 'Update Now',
            color: 'rgb(var(--art-primary))',
            textColor: '#fff'
          }"
          :cancelButton="{
            show: true,
            text: 'Remind Me Later',
            color: '#eee',
            textColor: '#333'
          }"
          @click="handleConfirm"
          @cancel="handleCancel"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import icon2 from '@imgs/3d/icon2.webp'
  import icon3 from '@imgs/3d/icon3.webp'
  import icon4 from '@imgs/3d/icon4.webp'
  import icon5 from '@imgs/3d/icon7.webp'
  import { ElRow } from 'element-plus'

  const handleBannerClick = () => {
    console.log('banner clicked')
  }

  const handleConfirm = () => {
    console.log('confirm clicked')
  }

  const handleCancel = () => {
    console.log('cancel clicked')
  }

  const PresetBanners = {
    marketing: {
      title: 'Limited-time Offer',
      subtitle: '48-hour flash sale on selected items — up to 30% OFF, while supplies last!',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      backgroundColor: 'rgb(var(--art-success), 0.1)',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: 'Shop Now',
        color: 'rgb(var(--art-success), 0.9)',
        textColor: '#fff'
      }
    },
    info: {
      title: 'Service Expiration Reminder',
      subtitle: 'Your premium service expires in 7 days. Please renew to keep full features.',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      backgroundColor: 'rgb(var(--art-primary), 0.1)',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: 'Renew Now',
        color: 'rgb(var(--art-secondary), 0.9)',
        textColor: '#fff'
      }
    }
  } as const
</script>

<style lang="scss" scoped>
  .banners {
    padding-top: 20px;

    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
