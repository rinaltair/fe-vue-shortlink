<template>
  <div class="pricing-container">
    <div class="pricing-header">
      <h1 class="title">Trusted by 53,476+ developers</h1>
      <h2 class="subtitle">Chosen by leading tech companies</h2>
      <div class="free-notice">
        <p class="notice-text">Open-sourced under MIT; this pricing page is for demo only</p>
        <ElTag type="success" size="large" round>Free for commercial use</ElTag>
      </div>
    </div>

    <div class="pricing-cards">
      <ElRow :gutter="20" justify="center">
        <ElCol v-for="plan in pricingPlans" :key="plan.type" :xs="24" :sm="12" :md="6">
          <ElCard class="pricing-card" :class="{ popular: plan.isPopular }" shadow="never">
            <div class="card-header">
              <h3>{{ plan.title }}</h3>
              <p class="description">{{ plan.description }}</p>
              <div class="price">
                <span class="amount">¥{{ plan.price }}</span>
                <span class="period">/one-time payment</span>
              </div>
            </div>

            <div class="features">
              <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
                <ElIcon :class="feature.available ? 'available' : 'unavailable'">
                  <Check v-if="feature.available" />
                  <Close v-else />
                </ElIcon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <div class="card-footer">
              <ElButton type="primary" class="purchase-btn" v-ripple>Buy Now</ElButton>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Check, Close } from '@element-plus/icons-vue'

  defineOptions({ name: 'Pricing' })

  interface Feature {
    text: string
    available: boolean
  }

  interface PricingPlan {
    type: string
    title: string
    description: string
    price: number
    isPopular: boolean
    features: Feature[]
  }

  const pricingPlans = ref<PricingPlan[]>([
    {
      type: 'single',
      title: 'Single-use License',
      description: 'For one end product. End users are not charged.',
      price: 349,
      isPopular: false,
      features: [
        { text: 'Full source code', available: true },
        { text: 'Technical documentation', available: true },
        { text: 'SaaS license', available: false },
        { text: 'Single project usage', available: true },
        { text: '1 year technical support', available: true },
        { text: '1 year free updates', available: true }
      ]
    },
    {
      type: 'multiple',
      title: 'Multi-use License',
      description: 'For unlimited end products. End users are not charged.',
      price: 629,
      isPopular: false,
      features: [
        { text: 'Full source code', available: true },
        { text: 'Technical documentation', available: true },
        { text: 'SaaS license', available: false },
        { text: 'Unlimited projects usage', available: true },
        { text: '1 year technical support', available: true },
        { text: '1 year free updates', available: true }
      ]
    },
    {
      type: 'extended',
      title: 'Extended License',
      description: 'For one end product. End users are charged.',
      price: 2099,
      isPopular: false,
      features: [
        { text: 'Full source code', available: true },
        { text: 'Technical documentation', available: true },
        { text: 'SaaS license', available: true },
        { text: 'Single project usage', available: true },
        { text: '1 year technical support', available: true },
        { text: '1 year free updates', available: true }
      ]
    },
    {
      type: 'unlimited',
      title: 'Unlimited License',
      description: 'For unlimited end products. End users are charged.',
      price: 3499,
      isPopular: false,
      features: [
        { text: 'Full source code', available: true },
        { text: 'Technical documentation', available: true },
        { text: 'SaaS license', available: true },
        { text: 'Unlimited projects usage', available: true },
        { text: '1 year technical support', available: true },
        { text: '1 year free updates', available: true }
      ]
    }
  ])
</script>

<style lang="scss" scoped>
  .pricing-container {
    padding: 6rem 5rem 0;
    background-color: transparent !important;
    border: none !important;

    .pricing-header {
      margin-bottom: 40px;
      text-align: center;

      .title {
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
        font-weight: 500;
      }

      .subtitle {
        margin-bottom: 10px;
        font-size: 1.4rem;
        font-weight: 400;
        color: var(--art-gray-600);
      }

      .free-notice {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        margin-top: 10px;

        .notice-text {
          font-size: 14px;
          font-style: italic;
          color: var(--art-gray-600);
        }
      }
    }

    .pricing-cards {
      margin-top: 80px;

      .el-col {
        margin-bottom: 20px;
      }

      .pricing-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;

        &.popular {
          position: relative;
          border: 2px solid var(--el-color-primary);

          &::after {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 2px 8px;
            font-size: 12px;
            color: var(--el-color-primary);
            content: 'Popular';
            background-color: var(--el-color-primary-light-9);
            border-radius: 12px;
          }
        }

        .card-header {
          margin-bottom: 20px;

          h3 {
            margin-bottom: 10px;
            font-size: 1.3rem;
            color: var(--art-text-gray-900) !important;
          }

          .description {
            display: -webkit-box;
            height: 40px;
            padding-bottom: 20px;
            margin-bottom: 20px;
            overflow: hidden;
            font-size: 14px;
            color: var(--art-text-gray-600);
            text-overflow: ellipsis;
            border-bottom: 1px solid var(--art-border-color);
            -webkit-box-orient: vertical;
          }

          .price {
            margin-top: 30px;

            .amount {
              font-size: 1.8rem;
              font-weight: 600;
            }

            .period {
              margin-left: 10px;
              font-size: 14px;
              color: var(--art-text-gray-600);
            }
          }
        }

        .features {
          flex-grow: 1;
          margin-bottom: 20px;

          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;

            .el-icon {
              margin-right: 10px;

              &.available {
                color: var(--el-color-primary);
              }

              &.unavailable {
                color: var(--el-color-danger);
              }
            }
          }
        }

        .card-footer {
          margin-top: auto;
          text-align: center;

          .purchase-btn {
            width: 100%;
            height: 40px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-notebook) {
    .pricing-container {
      padding: 5rem 2rem 0 !important;

      .pricing-cards {
        margin-top: 0;
      }
    }
  }

  @media only screen and (max-width: $device-phone) {
    .pricing-container {
      .pricing-header {
        .title {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1.5rem;
        }

        .free-notice {
          margin-top: 15px;

          .notice-text {
            font-size: 13px;
          }
        }
      }

      .el-col {
        margin-bottom: 20px;
      }
    }
  }
</style>
