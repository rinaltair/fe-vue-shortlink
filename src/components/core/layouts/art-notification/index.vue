<!-- Notification component -->
<template>
  <div
    class="notice"
    v-show="visible"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    @click.stop=""
  >
    <div class="header">
      <span class="text">{{ $t('notice.title') }}</span>
      <span class="btn">{{ $t('notice.btnRead') }}</span>
    </div>

    <ul class="bar">
      <li
        v-for="(item, index) in barList"
        :key="index"
        :class="{ active: barActiveIndex === index }"
        @click="changeBar(index)"
      >
        {{ item.name }} ({{ item.num }})
      </li>
    </ul>

    <div class="content">
      <div class="scroll">
        <!-- Notifications -->
        <ul class="notice-list" v-show="barActiveIndex === 0">
          <li v-for="(item, index) in noticeList" :key="index">
            <div
              class="icon"
              :style="{ background: getNoticeStyle(item.type).backgroundColor + '!important' }"
            >
              <i
                class="iconfont-sys"
                :style="{ color: getNoticeStyle(item.type).iconColor + '!important' }"
                v-html="getNoticeStyle(item.type).icon"
              >
              </i>
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- Messages -->
        <ul class="user-list" v-show="barActiveIndex === 1">
          <li v-for="(item, index) in msgList" :key="index">
            <div class="avatar">
              <img :src="item.avatar" />
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- Todo -->
        <ul class="base" v-show="barActiveIndex === 2">
          <li v-for="(item, index) in pendingList" :key="index">
            <h4>{{ item.title }}</h4>
            <p>{{ item.time }}</p>
          </li>
        </ul>

        <!-- Empty state -->
        <div class="empty-tips" v-show="currentTabIsEmpty">
          <i class="iconfont-sys">&#xe8d7;</i>
          <p>{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p>
        </div>
      </div>

      <div class="btn-wrapper">
        <el-button class="view-all" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </el-button>
      </div>
    </div>

    <div style="height: 100px"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppConfig from '@/config'

  // Import avatars
  import avatar1 from '@/assets/img/avatar/avatar1.webp'
  import avatar2 from '@/assets/img/avatar/avatar2.webp'
  import avatar3 from '@/assets/img/avatar/avatar3.webp'
  import avatar4 from '@/assets/img/avatar/avatar4.webp'
  import avatar5 from '@/assets/img/avatar/avatar5.webp'
  import avatar6 from '@/assets/img/avatar/avatar6.webp'

  defineOptions({ name: 'ArtNotification' })

  interface NoticeItem {
    /** Title */
    title: string
    /** Time */
    time: string
    /** Type */
    type: NoticeType
  }

  interface MessageItem {
    /** Title */
    title: string
    /** Time */
    time: string
    /** Avatar */
    avatar: string
  }

  interface PendingItem {
    /** Title */
    title: string
    /** Time */
    time: string
  }

  interface BarItem {
    /** Name */
    name: ComputedRef<string>
    /** Count */
    num: number
  }

  interface NoticeStyle {
    /** Icon */
    icon: string
    /** Icon color */
    iconColor: string
    /** Background color */
    backgroundColor: string
  }

  type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice'

  const { t } = useI18n()

  const props = defineProps<{
    value: boolean
  }>()

  const show = ref(false)
  const visible = ref(false)
  const barActiveIndex = ref(0)

  const useNotificationData = () => {
    // Notification data
    const noticeList = ref<NoticeItem[]>([
      {
        title: 'New i18n added',
        time: '2024-6-13 0:10',
        type: 'notice'
      },
      {
        title: 'Lengyue sent you a message',
        time: '2024-4-21 8:05',
        type: 'message'
      },
      {
        title: 'New follower',
        time: '2020-3-17 21:12',
        type: 'collection'
      },
      {
        title: 'New documentation added',
        time: '2024-02-14 0:20',
        type: 'notice'
      },
      {
        title: 'You have a new email',
        time: '2024-1-20 0:15',
        type: 'email'
      },
      {
        title: 'Menu uses local mock data',
        time: '2024-1-17 22:06',
        type: 'notice'
      }
    ])

    // Message data
    const msgList = ref<MessageItem[]>([
      {
        title: 'Chi followed you',
        time: '2021-2-26 23:50',
        avatar: avatar1
      },
      {
        title: 'Tang Bukou followed you',
        time: '2021-2-21 8:05',
        avatar: avatar2
      },
      {
        title: 'Zhong Xiaoyu followed you',
        time: '2020-1-17 21:12',
        avatar: avatar3
      },
      {
        title: 'He Xiaohua followed you',
        time: '2021-01-14 0:20',
        avatar: avatar4
      },
      {
        title: 'Xu Xuanyu followed you',
        time: '2020-12-20 0:15',
        avatar: avatar5
      },
      {
        title: 'Leng Yue Daidai followed you',
        time: '2020-12-17 22:06',
        avatar: avatar6
      }
    ])

    // Todo data
    const pendingList = ref<PendingItem[]>([])

    // Tab bar data
    const barList = computed<BarItem[]>(() => [
      {
        name: computed(() => t('notice.bar[0]')),
        num: noticeList.value.length
      },
      {
        name: computed(() => t('notice.bar[1]')),
        num: msgList.value.length
      },
      {
        name: computed(() => t('notice.bar[2]')),
        num: pendingList.value.length
      }
    ])

    return {
      noticeList,
      msgList,
      pendingList,
      barList
    }
  }

  // Style management
  const useNotificationStyles = () => {
    const noticeStyleMap: Record<NoticeType, NoticeStyle> = {
      email: {
        icon: '&#xe72e;',
        iconColor: 'rgb(var(--art-warning))',
        backgroundColor: 'rgb(var(--art-bg-warning))'
      },
      message: {
        icon: '&#xe747;',
        iconColor: 'rgb(var(--art-success))',
        backgroundColor: 'rgb(var(--art-bg-success))'
      },
      collection: {
        icon: '&#xe714;',
        iconColor: 'rgb(var(--art-danger))',
        backgroundColor: 'rgb(var(--art-bg-danger))'
      },
      user: {
        icon: '&#xe608;',
        iconColor: 'rgb(var(--art-info))',
        backgroundColor: 'rgb(var(--art-bg-info))'
      },
      notice: {
        icon: '&#xe6c2;',
        iconColor: 'rgb(var(--art-primary))',
        backgroundColor: 'rgb(var(--art-bg-primary))'
      }
    }

    const getRandomColor = (): string => {
      const index = Math.floor(Math.random() * AppConfig.systemMainColor.length)
      return AppConfig.systemMainColor[index]
    }

    const getNoticeStyle = (type: NoticeType): NoticeStyle => {
      const defaultStyle: NoticeStyle = {
        icon: '&#xe747;',
        iconColor: '#FFFFFF',
        backgroundColor: getRandomColor()
      }

      return noticeStyleMap[type] || defaultStyle
    }

    return {
      getNoticeStyle
    }
  }

  // Animation management
  const useNotificationAnimation = () => {
    const showNotice = (open: boolean) => {
      if (open) {
        visible.value = open
        setTimeout(() => {
          show.value = open
        }, 5)
      } else {
        show.value = open
        setTimeout(() => {
          visible.value = open
        }, 350)
      }
    }

    return {
      showNotice
    }
  }

  // Tab management
  const useTabManagement = (
    noticeList: Ref<NoticeItem[]>,
    msgList: Ref<MessageItem[]>,
    pendingList: Ref<PendingItem[]>,
    businessHandlers: {
      handleNoticeAll: () => void
      handleMsgAll: () => void
      handlePendingAll: () => void
    }
  ) => {
    const changeBar = (index: number) => {
      barActiveIndex.value = index
    }

    // Check whether current tab is empty
    const currentTabIsEmpty = computed(() => {
      const tabDataMap = [noticeList.value, msgList.value, pendingList.value]

      const currentData = tabDataMap[barActiveIndex.value]
      return currentData && currentData.length === 0
    })

    const handleViewAll = () => {
      // Handler map for "view all"
      const viewAllHandlers: Record<number, () => void> = {
        0: businessHandlers.handleNoticeAll,
        1: businessHandlers.handleMsgAll,
        2: businessHandlers.handlePendingAll
      }

      const handler = viewAllHandlers[barActiveIndex.value]
      handler?.()
    }

    return {
      changeBar,
      currentTabIsEmpty,
      handleViewAll
    }
  }

  // Business logic handlers
  const useBusinessLogic = () => {
    const handleNoticeAll = () => {
      // Handle viewing all notifications
      console.log('View all notifications')
    }

    const handleMsgAll = () => {
      // Handle viewing all messages
      console.log('View all messages')
    }

    const handlePendingAll = () => {
      // Handle viewing all todos
      console.log('View all todos')
    }

    return {
      handleNoticeAll,
      handleMsgAll,
      handlePendingAll
    }
  }

  // Compose all logic
  const { noticeList, msgList, pendingList, barList } = useNotificationData()
  const { getNoticeStyle } = useNotificationStyles()
  const { showNotice } = useNotificationAnimation()
  const { handleNoticeAll, handleMsgAll, handlePendingAll } = useBusinessLogic()
  const { changeBar, currentTabIsEmpty, handleViewAll } = useTabManagement(
    noticeList,
    msgList,
    pendingList,
    { handleNoticeAll, handleMsgAll, handlePendingAll }
  )

  // Watch property changes
  watch(
    () => props.value,
    (newValue) => {
      showNotice(newValue)
    }
  )
</script>

<style lang="scss" scoped>
  @use './style';
</style>
