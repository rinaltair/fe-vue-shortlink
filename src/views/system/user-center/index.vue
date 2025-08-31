<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.webp" />
          <img class="avatar" src="@imgs/user/avatar.webp" />
          <h2 class="name">{{ userInfo.userName }}</h2>
          <p class="des">Art Design Pro is a beautiful admin template.</p>

          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>jdkjjfnndf@mall.com</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>Interaction Expert</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe736;</i>
              <span>Shenzhen, Guangdong</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe811;</i>
              <span>ByteDance — Platform Dept — UED</span>
            </div>
          </div>

          <div class="lables">
            <h3>Tags</h3>
            <div>
              <div v-for="item in lableList" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- <el-carousel class="gallery" height="160px"
          :interval="5000"
          indicator-position="none"
        >
          <el-carousel-item class="item" v-for="item in galleryList" :key="item">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel> -->
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">Basic Settings</h1>

          <ElForm
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <ElRow>
              <ElFormItem label="Full Name" prop="realName">
                <el-input v-model="form.realName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="Gender" prop="sex" class="right-input">
                <ElSelect v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                  <ElOption
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="Nickname" prop="nikeName">
                <ElInput v-model="form.nikeName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="Email" prop="email" class="right-input">
                <ElInput v-model="form.email" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="Mobile" prop="mobile">
                <ElInput v-model="form.mobile" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="Address" prop="address" class="right-input">
                <ElInput v-model="form.address" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElFormItem label="About Me" prop="des" :style="{ height: '130px' }">
              <ElInput type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
            </ElFormItem>

            <div class="el-form-item-right">
              <ElButton type="primary" style="width: 90px" v-ripple @click="edit">
                {{ isEdit ? 'Save' : 'Edit' }}
              </ElButton>
            </div>
          </ElForm>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">Change Password</h1>

          <ElForm :model="pwdForm" class="form" label-width="86px" label-position="top">
            <ElFormItem label="Current Password" prop="password">
              <ElInput
                v-model="pwdForm.password"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <ElFormItem label="New Password" prop="newPassword">
              <ElInput
                v-model="pwdForm.newPassword"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <ElFormItem label="Confirm New Password" prop="confirmPassword">
              <ElInput
                v-model="pwdForm.confirmPassword"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <div class="el-form-item-right">
              <ElButton type="primary" style="width: 90px" v-ripple @click="editPwd">
                {{ isEditPwd ? 'Save' : 'Edit' }}
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { ElForm, FormInstance, FormRules } from 'element-plus'

  defineOptions({ name: 'UserCenter' })

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  const form = reactive({
    realName: 'John Snow',
    nikeName: 'Pikachu',
    email: '59301283@mall.com',
    mobile: '18888888888',
    address: '101-201, Xixiang St., Bao’an District, Shenzhen',
    sex: '2',
    des: 'Art Design Pro is a beautiful admin template.'
  })

  const pwdForm = reactive({
    password: '123456',
    newPassword: '123456',
    confirmPassword: '123456'
  })

  const ruleFormRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: 'Please enter a nickname', trigger: 'blur' },
      { min: 2, max: 50, message: 'Length 2 to 30 characters', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: 'Please enter a nickname', trigger: 'blur' },
      { min: 2, max: 50, message: 'Length 2 to 30 characters', trigger: 'blur' }
    ],
    email: [{ required: true, message: 'Please enter email', trigger: 'blur' }],
    mobile: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
    address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
    sex: [{ type: 'array', required: true, message: 'Please select gender', trigger: 'blur' }]
  })

  const options = [
    {
      value: '1',
      label: 'Male'
    },
    {
      value: '2',
      label: 'Female'
    }
  ]

  const lableList: Array<string> = [
    'Design-focused',
    'Creative',
    'Spicy~',
    'Long legs',
    'Sichuan girl',
    'Inclusive'
  ]

  onMounted(() => {
    getDate()
  })

  const getDate = () => {
    const d = new Date()
    const h = d.getHours()
    let text = ''

    if (h >= 6 && h < 9) {
      text = 'Good morning'
    } else if (h >= 9 && h < 11) {
      text = 'Good morning'
    } else if (h >= 11 && h < 13) {
      text = 'Good noon'
    } else if (h >= 13 && h < 18) {
      text = 'Good afternoon'
    } else if (h >= 18 && h < 24) {
      text = 'Good evening'
    } else if (h >= 0 && h < 6) {
      text = "It's late, get some rest"
    }

    date.value = text
  }

  const edit = () => {
    isEdit.value = !isEdit.value
  }

  const editPwd = () => {
    isEditPwd.value = !isEditPwd.value
  }
</script>

<style lang="scss">
  .user {
    .icon {
      width: 1.4em;
      height: 1.4em;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentcolor;
    }
  }
</style>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: 600px;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;
            z-index: 10;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            object-fit: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 6px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                background: var(--art-main-bg-color);
                border: 1px solid var(--art-border-color);
                border-radius: 2px;
              }
            }
          }
        }

        .gallery {
          margin-top: 25px;
          border-radius: 10px;

          .item {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;
        border-radius: $box-radius;

        .info {
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>
