<template>
  <ArtTimelineListCard
    :list="timelineData"
    title="Recent Transactions"
    subtitle="Today's Order Activity"
  />
</template>

<script setup lang="ts">
  const timelineData = [
    {
      time: '09:30 AM',
      status: 'rgb(73, 190, 255)',
      content: 'Received order #38291 payment ¥385.90'
    },
    {
      time: '10:00 AM',
      status: 'rgb(54, 158, 255)',
      content: 'New product listed',
      code: 'SKU-3467'
    },
    {
      time: '12:00 PM',
      status: 'rgb(103, 232, 207)',
      content: 'Paid supplier ¥6495.00'
    },
    {
      time: '02:30 PM',
      status: 'rgb(255, 193, 7)',
      content: 'Promotion started',
      code: 'PROMO-2023'
    },
    {
      time: '03:45 PM',
      status: 'rgb(255, 105, 105)',
      content: 'Order cancellation alert',
      code: 'ORD-9876'
    },
    {
      time: '05:00 PM',
      status: 'rgb(103, 232, 207)',
      content: 'Completed daily sales report'
    }
  ]
</script>
