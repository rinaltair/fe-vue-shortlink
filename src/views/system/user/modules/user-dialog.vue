<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? 'Add User' : 'Edit User'"
    width="30%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <ElFormItem label="Username" prop="username">
        <ElInput v-model="formData.username" />
      </ElFormItem>
      <ElFormItem label="Phone" prop="phone">
        <ElInput v-model="formData.phone" />
      </ElFormItem>
      <ElFormItem label="Gender" prop="gender">
        <ElSelect v-model="formData.gender">
          <ElOption label="Male" value="Male" />
          <ElOption label="Female" value="Female" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Roles" prop="role">
        <ElSelect v-model="formData.role" multiple>
          <ElOption
            v-for="role in roleList"
            :key="role.roleCode"
            :value="role.roleCode"
            :label="role.roleName"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">Cancel</ElButton>
        <ElButton type="primary" @click="handleSubmit">Submit</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  interface Props {
    visible: boolean
    type: string
    userData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Role list data
  const roleList = ref(ROLE_LIST_DATA)

  // Dialog visibility control
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // Form instance
  const formRef = ref<FormInstance>()

  // Form data
  const formData = reactive({
    username: '',
    phone: '',
    gender: 'Male',
    role: [] as string[]
  })

  // Form validation rules
  const rules: FormRules = {
    username: [
      { required: true, message: 'Please enter username', trigger: 'blur' },
      { min: 2, max: 20, message: 'Length 2 to 20 characters', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: 'Please enter phone', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
    ],
    gender: [{ required: true, message: 'Please select gender', trigger: 'blur' }],
    role: [{ required: true, message: 'Please select role(s)', trigger: 'blur' }]
  }

  // Initialize form data
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      username: isEdit ? row.userName || '' : '',
      phone: isEdit ? row.userPhone || '' : '',
      gender: isEdit ? row.userGender || 'Male' : 'Male',
      role: isEdit ? (Array.isArray(row.userRoles) ? row.userRoles : []) : []
    })
  }

  // Watch dialog state changes
  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  // Submit form
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(
          dialogType.value === 'add' ? 'Added successfully' : 'Updated successfully'
        )
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
