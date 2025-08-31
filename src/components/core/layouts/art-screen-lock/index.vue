<!-- Screen Lock -->
<template>
  <div class="layout-lock-screen">
    <!-- DevTools warning overlay -->
    <div v-if="showDevToolsWarning" class="dev-tools-warning">
      <div class="warning-content">
        <div class="warning-icon">🔒</div>
        <h1 class="warning-title">System Locked</h1>
        <p class="warning-text">
          Developer tools detected as open<br />
          For security, please close DevTools to continue
        </p>
        <div class="warning-subtitle">Security Lock Activated</div>
      </div>
    </div>

    <!-- Lock dialog -->
    <div v-if="!isLock">
      <ElDialog v-model="visible" :width="370" :show-close="false" @open="handleDialogOpen">
        <div class="lock-content">
          <img class="cover" src="@imgs/user/avatar.webp" alt="User Avatar" />
          <div class="username">{{ userInfo.userName }}</div>
          <ElForm ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleLock">
            <ElFormItem prop="password">
              <ElInput
                v-model="formData.password"
                type="password"
                :placeholder="$t('lockScreen.lock.inputPlaceholder')"
                :show-password="true"
                ref="lockInputRef"
                @keyup.enter="handleLock"
              >
                <template #suffix>
                  <ElIcon class="cursor-pointer" @click="handleLock">
                    <Lock />
                  </ElIcon>
                </template>
              </ElInput>
            </ElFormItem>
            <ElButton type="primary" class="lock-btn" @click="handleLock" v-ripple>
              {{ $t('lockScreen.lock.btnText') }}
            </ElButton>
          </ElForm>
        </div>
      </ElDialog>
    </div>

    <!-- Unlock view -->
    <div v-else class="unlock-content">
      <div class="box">
        <img class="cover" src="@imgs/user/avatar.webp" alt="User Avatar" />
        <div class="username">{{ userInfo.userName }}</div>
        <ElForm
          ref="unlockFormRef"
          :model="unlockForm"
          :rules="rules"
          @submit.prevent="handleUnlock"
        >
          <ElFormItem prop="password">
            <ElInput
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t('lockScreen.unlock.inputPlaceholder')"
              :show-password="true"
              ref="unlockInputRef"
            >
              <template #suffix>
                <ElIcon class="cursor-pointer" @click="handleUnlock">
                  <Unlock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <ElButton type="primary" class="unlock-btn" @click="handleUnlock" v-ripple>
            {{ $t('lockScreen.unlock.btnText') }}
          </ElButton>
          <ElButton text class="login-btn" @click="toLogin">
            {{ $t('lockScreen.unlock.backBtnText') }}
          </ElButton>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Lock, Unlock } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import CryptoJS from 'crypto-js'
  import { useUserStore } from '@/store/modules/user'
  import { mittBus } from '@/utils/sys'

  // i18n
  const { t } = useI18n()

  // Env vars
  const ENCRYPT_KEY = import.meta.env.VITE_LOCK_ENCRYPT_KEY

  // Store
  const userStore = useUserStore()
  const { info: userInfo, lockPassword, isLock } = storeToRefs(userStore)

  // Reactive state
  const visible = ref<boolean>(false)
  const lockInputRef = ref<any>(null)
  const unlockInputRef = ref<any>(null)
  const showDevToolsWarning = ref<boolean>(false)

  // Forms
  const formRef = ref<FormInstance>()
  const unlockFormRef = ref<FormInstance>()

  const formData = reactive({
    password: ''
  })

  const unlockForm = reactive({
    password: ''
  })

  // Form validation rules
  const rules = computed<FormRules>(() => ({
    password: [
      {
        required: true,
        message: t('lockScreen.lock.inputPlaceholder'),
        trigger: 'blur'
      }
    ]
  }))

  // Detect mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }

  // Add functions to disable console/devtools
  const disableDevTools = () => {
    // Disable context menu
    const handleContextMenu = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('contextmenu', handleContextMenu, true)

    // Disable devtools-related shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLock.value) return

      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+Shift+I/J/C/K (devtools)
      if (e.ctrlKey && e.shiftKey) {
        const key = e.key.toLowerCase()
        if (['i', 'j', 'c', 'k'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }

      // Disable Ctrl+U (view source)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+S (save page)
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+A (select all)
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+P (print)
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+F (find)
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Alt+Tab (switch window)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+Tab (switch tab)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+W (close tab)
      if (e.ctrlKey && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+R and F5 (refresh)
      if ((e.ctrlKey && e.key.toLowerCase() === 'r') || e.key === 'F5') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Disable Ctrl+Shift+R (hard reload)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('selectstart', handleSelectStart, true)

    // Disable drag
    const handleDragStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('dragstart', handleDragStart, true)

    // Listen for devtools open (desktop only)
    let devtools = { open: false }
    const threshold = 160
    let devToolsInterval: ReturnType<typeof setInterval> | null = null

    const checkDevTools = () => {
      if (!isLock.value || isMobile()) return

      const isDevToolsOpen =
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold

      if (isDevToolsOpen && !devtools.open) {
        devtools.open = true
        showDevToolsWarning.value = true
      } else if (!isDevToolsOpen && devtools.open) {
        devtools.open = false
        showDevToolsWarning.value = false
      }
    }

    // Enable devtools detection on desktop only
    if (!isMobile()) {
      devToolsInterval = setInterval(checkDevTools, 500)
    }

    // Return cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('selectstart', handleSelectStart, true)
      document.removeEventListener('dragstart', handleDragStart, true)
      if (devToolsInterval) {
        clearInterval(devToolsInterval)
      }
    }
  }

  // Utils
  const verifyPassword = (inputPassword: string, storedPassword: string): boolean => {
    try {
      const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, ENCRYPT_KEY).toString(
        CryptoJS.enc.Utf8
      )
      return inputPassword === decryptedPassword
    } catch (error) {
      console.error('Password decryption failed:', error)
      return false
    }
  }

  // Event handlers
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === '¬') {
      event.preventDefault()
      visible.value = true
    }
  }

  const handleDialogOpen = () => {
    setTimeout(() => {
      lockInputRef.value?.input?.focus()
    }, 100)
  }

  const handleLock = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid, fields) => {
      if (valid) {
        const encryptedPassword = CryptoJS.AES.encrypt(formData.password, ENCRYPT_KEY).toString()
        userStore.setLockStatus(true)
        userStore.setLockPassword(encryptedPassword)
        visible.value = false
        formData.password = ''
      } else {
        console.error('Form validation failed:', fields)
      }
    })
  }

  const handleUnlock = async () => {
    if (!unlockFormRef.value) return

    await unlockFormRef.value.validate((valid, fields) => {
      if (valid) {
        const isValid = verifyPassword(unlockForm.password, lockPassword.value)

        if (isValid) {
          try {
            userStore.setLockStatus(false)
            userStore.setLockPassword('')
            unlockForm.password = ''
            visible.value = false
            showDevToolsWarning.value = false
          } catch (error) {
            console.error('Failed to update store:', error)
          }
        } else {
          ElMessage.error(t('lockScreen.pwdError'))
        }
      } else {
        console.error('Form validation failed:', fields)
      }
    })
  }

  const toLogin = () => {
    userStore.logOut()
  }

  const openLockScreen = () => {
    visible.value = true
  }

  // Watch lock state
  watch(isLock, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'auto'
      showDevToolsWarning.value = false
    }
  })

  // Storage cleanup
  let cleanupDevTools: (() => void) | null = null

  // Lifecycle hooks
  onMounted(() => {
    mittBus.on('openLockScreen', openLockScreen)
    document.addEventListener('keydown', handleKeydown)

    if (isLock.value) {
      visible.value = true
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    }

    // Init devtools-disable features
    cleanupDevTools = disableDevTools()
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
    // Cleanup devtools-disable listeners
    if (cleanupDevTools) {
      cleanupDevTools()
      cleanupDevTools = null
    }
  })
</script>

<style scoped lang="scss">
  .layout-lock-screen {
    :deep(.el-dialog) {
      border-radius: 10px;
    }

    // Devtools warning style
    .dev-tools-warning {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      background: linear-gradient(135deg, #1e1e1e 0%, #000 100%);
      animation: fadeIn 0.3s ease-in-out;

      .warning-content {
        padding: 20px;
        text-align: center;
        user-select: none;

        .warning-icon {
          margin-bottom: 30px;
          font-size: 48px;
        }

        .warning-title {
          margin: 0 0 20px;
          font-size: 28px;
          font-weight: 600;
          color: #ff6b6b;
        }

        .warning-text {
          max-width: 500px;
          margin: 0;
          font-size: 18px;
          line-height: 1.6;
          color: #ccc;
        }

        .warning-subtitle {
          margin-top: 30px;
          font-size: 14px;
          color: #888;
        }
      }
    }

    .lock-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .cover {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }

      .username {
        margin: 15px 0;
        margin-top: 30px;
        font-size: 16px;
        font-weight: 500;
      }

      .el-form {
        width: 90%;
      }

      .el-input {
        width: 100%;
        margin-top: 35px;
      }

      .lock-btn {
        width: 100%;
      }
    }

    .unlock-content {
      position: fixed;
      inset: 0;
      z-index: 2500;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #fff;
      background-image: url('@imgs/lock/lock_screen_1.webp');
      background-size: cover;
      transition: transform 0.3s ease-in-out;

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 320px;
        padding: 30px;
        background: rgb(255 255 255 / 90%);
        border-radius: 10px;

        .cover {
          width: 64px;
          height: 64px;
          margin-top: 20px;
          border-radius: 50%;
        }

        .username {
          margin: 15px 0;
          margin-top: 30px;
          font-size: 16px;
          font-weight: 500;
          color: #333 !important;
        }

        .el-form {
          width: 100%;
          padding: 0 10px !important;
        }

        .el-input {
          margin-top: 20px;
          color: #333;
        }

        .unlock-btn {
          width: 100%;
        }

        .login-btn {
          display: block;
          margin: 10px auto;
          color: #333 !important;

          &:hover {
            color: var(--main-color) !important;
            background-color: transparent !important;
          }
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
