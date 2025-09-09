<template>
  <div class="login">
    <LoginLeftView></LoginLeftView>

    <div class="right-wrap">
      <div class="top-right-wrap">
        <div class="btn theme-btn" @click="themeAnimation">
          <i class="iconfont-sys">
            {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
          </i>
        </div>
      </div>
      <div class="header">
        <ArtLogo class="icon" />
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <p class="sub-title">{{ $t('login.subTitle') }}</p>
          <ElForm
            ref="formRef"
            :model="formData"
            :rules="rules"
            @keyup.enter="handleSubmit"
            style="margin-top: 25px"
          >
            <ElFormItem prop="email">
              <ElInput :placeholder="$t('login.placeholder[0]')" v-model.trim="formData.email" />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                :placeholder="$t('login.placeholder[1]')"
                v-model.trim="formData.password"
                type="password"
                radius="8px"
                autocomplete="off"
                show-password
              />
            </ElFormItem>
            <div class="drag-verify">
              <div class="drag-verify-content" :class="{ error: !isPassing && isClickPass }">
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  :text="$t('login.sliderText')"
                  textColor="var(--art-gray-800)"
                  :successText="$t('login.sliderSuccessText')"
                  :progressBarBg="getCssVar('--el-color-primary')"
                  background="var(--art-gray-200)"
                  handlerBg="var(--art-main-bg-color)"
                />
              </div>
              <p class="error-text" :class="{ 'show-error-text': !isPassing && isClickPass }">{{
                $t('login.placeholder[2]')
              }}</p>
            </div>

            <div class="forget-password">
              <ElCheckbox v-model="formData.rememberPassword">{{
                $t('login.rememberPwd')
              }}</ElCheckbox>
              <RouterLink :to="RoutesAlias.ForgetPassword">{{ $t('login.forgetPwd') }}</RouterLink>
            </div>

            <div style="margin-top: 30px">
              <ElButton
                class="login-btn"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-ripple
              >
                {{ $t('login.btnText') }}
              </ElButton>
            </div>

            <div class="footer">
              <p>
                {{ $t('login.noAccount') }}
                <RouterLink :to="RoutesAlias.Register">{{ $t('login.register') }}</RouterLink>
              </p>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { RoutesAlias } from '@/router/routesAlias'
  import { ElNotification, ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { getCssVar } from '@/utils/ui'
  import { useI18n } from 'vue-i18n'
  import { HttpError } from '@/utils/http/error'
  import { themeAnimation } from '@/utils/theme/animation'
  import { UserService } from '@/api/usersApi'

  defineOptions({ name: 'Login' })

  const { t } = useI18n()
  import { useSettingStore } from '@/store/modules/setting'
  import type { FormInstance, FormRules } from 'element-plus'

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  const dragVerify = ref()

  const userStore = useUserStore()
  const router = useRouter()
  const isPassing = ref(false)
  const isClickPass = ref(false)

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    email: '',
    password: '',
    rememberPassword: true
  })

  const rules = computed<FormRules>(() => ({
    email: [
      { required: true, message: t('login.placeholder[0]'), trigger: 'blur' },
      { type: 'email', message: t('login.rule[0]'), trigger: ['blur', 'change'] }
    ],
    password: [{ required: true, message: t('login.placeholder[1]'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  // Login
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // Form validation
      const valid = await formRef.value.validate()
      if (!valid) return

      // Drag-to-verify
      if (!isPassing.value) {
        isClickPass.value = true
        return
      }

      loading.value = true

      // Login request
      const { email, password } = formData

      const { token } = await UserService.login({
        email: email,
        password
      })

      // Validate token
      if (!token) {
        throw new Error('Login failed - no token received')
      }

      // Store token and user info
      userStore.setToken(token)
      const userInfo = await UserService.getUserInfo()
      userStore.setUserInfo(userInfo)
      userStore.setLoginStatus(true)

      // Handle successful login
      showLoginSuccessNotice()
      router.push('/')
    } catch (error) {
      // Handle HttpError
      if (error instanceof HttpError) {
        // console.log(error.code)
      } else {
        // Handle non-HttpError
        ElMessage.error('Login failed, please try again later')
        console.error('[Login] Unexpected error:', error)
      }
    } finally {
      loading.value = false
      resetDragVerify()
    }
  }

  // Reset drag-to-verify
  const resetDragVerify = () => {
    dragVerify.value.reset()
  }

  // Show login success notification
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 150)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
