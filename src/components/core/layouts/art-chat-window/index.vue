<template>
  <div class="layout-chat">
    <ElDrawer v-model="isDrawerVisible" :size="isMobile ? '100%' : '480px'" :with-header="false">
      <div class="header">
        <div class="header-left">
          <span class="name">Art Bot</span>
          <div class="status">
            <div class="dot" :class="{ online: isOnline, offline: !isOnline }"></div>
            <span class="status-text">{{ isOnline ? 'Online' : 'Offline' }}</span>
          </div>
        </div>
        <div class="header-right">
          <ElIcon class="icon-close" :size="20" @click="closeChat">
            <Close />
          </ElIcon>
        </div>
      </div>
      <div class="chat-container">
        <!-- Chat messages area -->
        <div class="chat-messages" ref="messageContainer">
          <template v-for="(message, index) in messages" :key="index">
            <div :class="['message-item', message.isMe ? 'message-right' : 'message-left']">
              <ElAvatar :size="32" :src="message.avatar" class="message-avatar" />
              <div class="message-content">
                <div class="message-info">
                  <span class="sender-name">{{ message.sender }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
          </template>
        </div>

        <!-- Chat input area -->
        <div class="chat-input">
          <ElInput
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="Enter message"
            resize="none"
            @keyup.enter.prevent="sendMessage"
          >
            <template #append>
              <div class="input-actions">
                <ElButton :icon="Paperclip" circle plain />
                <ElButton :icon="Picture" circle plain />
                <ElButton type="primary" @click="sendMessage" v-ripple>Send</ElButton>
              </div>
            </template>
          </ElInput>
          <div class="chat-input-actions">
            <div class="left">
              <i class="iconfont-sys">&#xe634;</i>
              <i class="iconfont-sys">&#xe809;</i>
            </div>
            <ElButton type="primary" @click="sendMessage" v-ripple>Send</ElButton>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import { Picture, Paperclip } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import meAvatar from '@/assets/img/avatar/avatar5.webp'
  import aiAvatar from '@/assets/img/avatar/avatar10.webp'

  defineOptions({ name: 'ArtChatWindow' })

  // Type definitions
  interface ChatMessage {
    id: number
    sender: string
    content: string
    time: string
    isMe: boolean
    avatar: string
  }

  // Constants
  const MOBILE_BREAKPOINT = 500
  const SCROLL_DELAY = 100
  const BOT_NAME = 'Art Bot'
  const USER_NAME = 'Ricky'

  // Responsive layout
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < MOBILE_BREAKPOINT)

  // Component state
  const isDrawerVisible = ref(false)
  const isOnline = ref(true)

  // Message state
  const messageText = ref('')
  const messageId = ref(10)
  const messageContainer = ref<HTMLElement | null>(null)

  // Initialize chat messages data
  const initializeMessages = (): ChatMessage[] => [
    {
      id: 1,
      sender: BOT_NAME,
      content: 'Hello! I am your AI assistant. How can I help you today?',
      time: '10:00',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 2,
      sender: USER_NAME,
      content: 'I want to learn how to use the system.',
      time: '10:01',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 3,
      sender: BOT_NAME,
      content:
        'Sure, let me introduce the main features. First, you can access different modules from the left menu...',
      time: '10:02',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 4,
      sender: USER_NAME,
      content: 'Sounds great. Can you elaborate on the data analysis part?',
      time: '10:05',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 5,
      sender: BOT_NAME,
      content:
        'Absolutely. The data analysis module helps you monitor key metrics in real time and generate detailed reports...',
      time: '10:06',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 6,
      sender: USER_NAME,
      content: 'Great! How do I get started?',
      time: '10:08',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 7,
      sender: BOT_NAME,
      content:
        'You can start by creating a project, then add relevant data sources. The system will analyze them automatically.',
      time: '10:09',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 8,
      sender: USER_NAME,
      content: 'Got it, thanks for your help!',
      time: '10:10',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 9,
      sender: BOT_NAME,
      content: 'You are welcome. Feel free to contact me anytime.',
      time: '10:11',
      isMe: false,
      avatar: aiAvatar
    }
  ]

  const messages = ref<ChatMessage[]>(initializeMessages())

  // Utility functions
  const formatCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const scrollToBottom = (): void => {
    nextTick(() => {
      setTimeout(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
      }, SCROLL_DELAY)
    })
  }

  // Message handlers
  const sendMessage = (): void => {
    const text = messageText.value.trim()
    if (!text) return

    const newMessage: ChatMessage = {
      id: messageId.value++,
      sender: USER_NAME,
      content: text,
      time: formatCurrentTime(),
      isMe: true,
      avatar: meAvatar
    }

    messages.value.push(newMessage)
    messageText.value = ''
    scrollToBottom()
  }

  // Chat window controls
  const openChat = (): void => {
    isDrawerVisible.value = true
    scrollToBottom()
  }

  const closeChat = (): void => {
    isDrawerVisible.value = false
  }

  // Lifecycle
  onMounted(() => {
    scrollToBottom()
    mittBus.on('openChat', openChat)
  })

  onUnmounted(() => {
    mittBus.off('openChat', openChat)
  })
</script>

<style lang="scss">
  .layout-chat {
    .el-overlay {
      background-color: rgb(0 0 0 / 20%) !important;
    }
  }
</style>

<style lang="scss" scoped>
  @use './style';
</style>
