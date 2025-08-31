<template>
  <div class="cards">
    <h1 class="page-title">Stats Cards (Text)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <ArtStatsCard
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :iconSize="card.iconSize"
          :iconBgRadius="8"
          iconColor="#fff"
          :iconBgColor="card.iconBgColor"
          :showArrow="card.showArrow"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Stats Cards (Count Up)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <ArtStatsCard
          :icon="card.icon"
          :count="card.count"
          :description="card.description"
          :iconSize="card.iconSize"
          :decimals="0"
          :iconBgColor="card.iconBgColor"
          :showArrow="card.showArrow"
          separator=","
          iconColor="#fff"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Stats Cards (Custom Style)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
        <ArtStatsCard
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :iconColor="card.iconColor"
          :textColor="card.textColor"
          :backgroundColor="card.backgroundColor"
          :showArrow="card.showArrow"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Progress Cards</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
        <ArtProgressCard :percentage="card.percentage" :title="card.title" :color="card.color" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Progress Cards (with Icons)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
        <ArtProgressCard
          :percentage="card.percentage"
          :title="card.title"
          :color="card.color"
          :icon="card.icon"
          :iconColor="card.iconColor"
          :iconBgColor="card.iconBgColor"
          :iconSize="card.iconSize"
          :iconBgRadius="8"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Chart Cards (Mini)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtLineChartCard
          :isMiniChart="true"
          :value="2545"
          label="New Users"
          date="Last 7 days"
          :percentage="1.2"
          :height="9.5"
          :chartData="[120, 132, 101, 134, 90, 230, 210]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtBarChartCard
          :isMiniChart="true"
          :value="15480"
          label="Page Views"
          date="Last 14 days"
          :percentage="-4.15"
          :height="9.5"
          :barWidth="'45%'"
          :chartData="[120, 100, 150, 140, 90, 120, 130]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtLineChartCard
          :isMiniChart="true"
          :value="2545"
          label="Followers"
          date="Last 30 days"
          :percentage="1.2"
          :height="9.5"
          :showAreaColor="true"
          :chartData="[150, 180, 160, 200, 180, 220, 240]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtDonutChartCard
          :value="36358"
          title="Followers"
          :percentage="18"
          percentageLabel="vs last year"
          :data="[50, 40]"
          :height="9.5"
          currentValue="2022"
          previousValue="2021"
          :radius="['50%', '70%']"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Chart Cards (Large)</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtLineChartCard
          :value="2545"
          label="New Users"
          :percentage="1.2"
          :height="11"
          :chartData="[120, 132, 101, 134, 90, 230, 210]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtBarChartCard
          :value="15480"
          label="Page Views"
          :percentage="-4.15"
          :height="11"
          :chartData="[120, 100, 150, 140, 90, 120, 130, 110]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtLineChartCard
          :value="2545"
          label="Followers"
          :percentage="1.2"
          :height="11"
          :showAreaColor="true"
          :chartData="[150, 180, 160, 200, 180, 220, 240]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ArtDonutChartCard
          :value="36358"
          title="Followers"
          :percentage="-18"
          percentageLabel="vs 2021"
          :data="[70, 30]"
          :height="11"
          currentValue="Dec"
          previousValue="Nov"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Data List Cards</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :lg="8">
        <ArtDataListCard :list="dataList" title="To-do List" subtitle="Today’s pending tasks" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :lg="8">
        <ArtDataListCard
          :maxCount="4"
          :list="dataList"
          title="Recent Activity"
          subtitle="Latest activity list"
          :showMoreButton="true"
          @more="handleMore"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :lg="8">
        <ArtTimelineListCard
          :list="timelineData"
          title="Recent Transactions"
          subtitle="Dec 20, 2024"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">Image Cards</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in imageCards" :key="card.id">
        <ArtImageCard
          :imageUrl="card.imageUrl"
          :title="card.title"
          :category="card.category"
          :readTime="card.readTime"
          :views="card.views"
          :comments="card.comments"
          :date="card.date"
          @click="handleImageCardClick(card)"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import cover1 from '@imgs/cover/img1.webp'
  import cover2 from '@imgs/cover/img2.webp'
  import cover3 from '@imgs/cover/img3.webp'
  import cover4 from '@imgs/cover/img4.webp'

  const statsCards = [
    {
      id: 1,
      title: 'Products Sold',
      count: 1235,
      description: 'Shoes, Jeans, Party Wear, Watches',
      icon: '&#xe812;',
      iconColor: 'rgb(var(--art-primary))',
      iconSize: 20,
      iconBgColor: 'rgb(var(--art-info))',
      textColor: 'rgb(var(--art-primary))',
      backgroundColor: 'rgb(var(--art-bg-primary))',
      showArrow: false
    },
    {
      id: 2,
      title: 'Active Users',
      count: 5000,
      description: 'DAU exceeds 5,000+',
      icon: '&#xe724;',
      iconColor: 'rgb(var(--art-warning))',
      iconSize: 20,
      iconBgColor: 'rgb(var(--art-success))',
      textColor: 'rgb(var(--art-warning))',
      backgroundColor: 'rgb(var(--art-bg-warning))',
      showArrow: false
    },
    {
      id: 3,
      title: 'Total Revenue',
      count: 35000,
      description: 'Monthly revenue over ¥350,000+',
      icon: '&#xe70e;',
      iconColor: 'rgb(var(--art-secondary))',
      iconSize: 20,
      iconBgColor: 'rgb(var(--art-secondary))',
      textColor: 'rgb(var(--art-secondary))',
      backgroundColor: 'rgb(var(--art-bg-secondary))',
      showArrow: false
    },
    {
      id: 4,
      title: 'Customer Reviews',
      count: 4800,
      description: 'Average rating 4.8/5',
      icon: '&#xe82d;',
      iconColor: 'rgb(var(--art-error))',
      iconSize: 20,
      iconBgColor: 'rgb(var(--art-error))',
      textColor: 'rgb(var(--art-error))',
      backgroundColor: 'rgb(var(--art-bg-error))',
      showArrow: false
    }
  ]

  const progressCards = [
    {
      id: 1,
      title: 'Completion',
      percentage: 75,
      color: 'rgb(var(--art-success))',
      icon: '&#xe812;',
      iconColor: 'rgb(var(--art-success))',
      iconBgColor: 'rgb(var(--art-bg-success))',
      iconSize: 20
    },
    {
      id: 2,
      title: 'Project Progress',
      percentage: 65,
      color: 'rgb(var(--art-primary))',
      icon: '&#xe724;',
      iconColor: 'rgb(var(--art-primary))',
      iconBgColor: 'rgb(var(--art-bg-primary))',
      iconSize: 20
    },
    {
      id: 3,
      title: 'Learning Progress',
      percentage: 45,
      color: 'rgb(var(--art-error))',
      icon: '&#xe724;',
      iconColor: 'rgb(var(--art-error))',
      iconBgColor: 'rgb(var(--art-bg-error))',
      iconSize: 20
    },
    {
      id: 4,
      title: 'Task Progress',
      percentage: 90,
      color: 'rgb(var(--art-secondary))',
      icon: '&#xe724;',
      iconColor: 'rgb(var(--art-secondary))',
      iconBgColor: 'rgb(var(--art-bg-secondary))',
      iconSize: 20
    }
  ]

  const imageCards = [
    {
      id: 1,
      imageUrl: cover1,
      title: 'AI Innovations in Healthcare: Applications & Outlook',
      category: 'Social',
      readTime: '2 min',
      views: 9125,
      comments: 3,
      date: 'Mon, Dec 19'
    },
    {
      id: 2,
      imageUrl: cover2,
      title: 'Big Data Analytics: Real-world Decision Support',
      category: 'Tech',
      readTime: '3 min',
      views: 7234,
      comments: 5,
      date: 'Tue, Dec 20'
    },
    {
      id: 3,
      imageUrl: cover3,
      title: 'Blockchain in Supply Chain Management',
      category: 'Science & Tech',
      readTime: '4 min',
      views: 5678,
      comments: 8,
      date: 'Wed, Dec 21'
    },
    {
      id: 4,
      imageUrl: cover4,
      title: 'Cloud Computing: Trends & Outlook',
      category: 'Cloud',
      readTime: '5 min',
      views: 4321,
      comments: 6,
      date: 'Thu, Dec 22'
    }
  ]

  const dataList = [
    {
      title: 'Trip to Singapore',
      status: 'In Progress',
      time: '5 min',
      class: 'bg-primary',
      icon: '&#xe6f2;'
    },
    {
      title: 'Archive Data',
      status: 'In Progress',
      time: '10 min',
      class: 'bg-secondary',
      icon: '&#xe806;'
    },
    {
      title: 'Client Meeting',
      status: 'Pending',
      time: '15 min',
      class: 'bg-warning',
      icon: '&#xe6fb;'
    },
    {
      title: 'Filter Task Team',
      status: 'In Progress',
      time: '20 min',
      class: 'bg-danger',
      icon: '&#xe813;'
    },
    {
      title: 'Send Envelope to Wang',
      status: 'Completed',
      time: '20 min',
      class: 'bg-success',
      icon: '&#xe70c;'
    }
  ]

  const timelineData = [
    {
      time: '09:30 AM',
      status: 'rgb(73, 190, 255)',
      content: 'Received $385.90 payment from John Doe'
    },
    {
      time: '10:00 AM',
      status: 'rgb(54, 158, 255)',
      content: 'New sale recorded',
      code: 'ML-3467'
    },
    {
      time: '12:00 PM',
      status: 'rgb(103, 232, 207)',
      content: 'Paid $64.95 to Michael'
    },
    {
      time: '02:30 PM',
      status: 'rgb(255, 193, 7)',
      content: 'System maintenance notice',
      code: 'MT-2023'
    },
    {
      time: '03:45 PM',
      status: 'rgb(255, 105, 105)',
      content: 'Urgent order cancellation alert',
      code: 'OR-9876'
    },
    {
      time: '05:00 PM',
      status: 'rgb(103, 232, 207)',
      content: 'Completed daily sales report'
    }
  ]

  const handleMore = () => {}

  const handleImageCardClick = (card: any) => {
    console.log(card)
  }
</script>

<style lang="scss" scoped>
  .cards {
    padding: 20px 0;

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
