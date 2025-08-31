<template>
  <ArtDataListCard
    :maxCount="4"
    :list="dataList"
    title="Recent Activity"
    subtitle="Order Processing Status"
    :showMoreButton="true"
    @more="handleMore"
  />
</template>

<script setup lang="ts">
  const dataList = [
    {
      title: 'New Order #38291',
      status: 'Pending',
      time: '5 minutes',
      class: 'bg-primary',
      icon: '&#xe6f2;'
    },
    {
      title: 'Refund Request #12845',
      status: 'Processing',
      time: '10 minutes',
      class: 'bg-secondary',
      icon: '&#xe806;'
    },
    {
      title: 'Customer Complaint Handling',
      status: 'Pending',
      time: '15 minutes',
      class: 'bg-warning',
      icon: '&#xe6fb;'
    },
    {
      title: 'Low Stock Alert',
      status: 'Urgent',
      time: '20 minutes',
      class: 'bg-danger',
      icon: '&#xe813;'
    },
    {
      title: 'Order #29384 Shipped',
      status: 'Completed',
      time: '20 minutes',
      class: 'bg-success',
      icon: '&#xe70c;'
    }
  ]

  const handleMore = () => {}
</script>
