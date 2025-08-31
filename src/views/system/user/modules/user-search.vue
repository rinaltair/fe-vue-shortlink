<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
    <template #email>
      <ElInput v-model="formData.email" placeholder="This input is rendered via slot" />
    </template>
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, h } from 'vue'
  import ArtIconSelector from '@/components/core/base/art-icon-selector/index.vue'
  import { IconTypeEnum } from '@/enums/appEnum'

  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Two-way binding for form data
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // Validation rules
  const rules = {
    // name: [{ required: true, message: 'Please enter username', trigger: 'blur' }]
  }

  // Dynamic options
  const levelOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // Mock API to fetch user levels
  function fetchLevelOptions(): Promise<typeof levelOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: 'Normal', value: 'normal' },
          { label: 'VIP', value: 'vip' },
          { label: 'SVIP', value: 'svip' },
          { label: 'Enterprise', value: 'enterprise', disabled: true }
        ])
      }, 1000)
    })
  }

  onMounted(async () => {
    levelOptions.value = await fetchLevelOptions()
  })

  // Form configuration
  const formItems = computed(() => [
    {
      label: 'Username',
      key: 'name',
      type: 'input',
      placeholder: 'Please enter username',
      clearable: true
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'input',
      props: { placeholder: 'Please enter phone number', maxlength: '11' }
    },
    {
      label: 'User Level',
      key: 'level',
      type: 'select',
      props: { placeholder: 'Please select level', options: levelOptions.value }
    },
    { label: 'Address', key: 'address', type: 'input', placeholder: 'Please enter address' },
    {
      label: 'Date',
      key: 'date',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Please select date',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: 'Today', value: new Date() },
          { text: 'Yesterday', value: () => new Date(Date.now() - 86400000) },
          { text: 'A week ago', value: () => new Date(Date.now() - 604800000) }
        ]
      }
    },
    {
      label: 'Date Range',
      key: 'daterange',
      type: 'datetime',
      props: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: 'to',
        startPlaceholder: 'Start date',
        endPlaceholder: 'End date'
      }
    },
    {
      label: 'Cascader',
      key: 'cascader',
      type: 'cascader',
      props: {
        placeholder: 'Please select',
        clearable: true,
        style: { width: '100%' },
        collapseTags: true,
        maxCollapseTags: 1,
        props: { multiple: true },
        options: [
          {
            value: 'guide',
            label: 'Guide',
            children: [
              {
                value: 'disciplines',
                label: 'Specification',
                children: [
                  { value: 'consistency', label: 'Consistency' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'efficiency', label: 'Efficiency' },
                  { value: 'controllability', label: 'Controllability' }
                ]
              }
            ]
          },
          {
            value: 'components',
            label: 'Components',
            children: [
              {
                value: 'basic',
                label: 'Basic',
                children: [
                  { value: 'button', label: 'Button' },
                  { value: 'form', label: 'Form' },
                  { value: 'table', label: 'Table' }
                ]
              }
            ]
          }
        ]
      }
    },
    { label: 'Slot', key: 'email', type: 'input', placeholder: 'Please enter email' },
    {
      label: 'Rendered Component',
      key: 'iconSelector',
      type: () => h(ArtIconSelector, { iconType: IconTypeEnum.UNICODE, width: '100%' }),
      props: { placeholder: 'Please enter remarks', type: 'textarea', rows: 4 }
    },
    {
      label: 'Grid Example',
      key: 'checkboxgroup',
      type: 'checkboxgroup',
      span: 12,
      props: {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
          { label: 'Option 4', value: 'option4' },
          { label: 'Option 5 (disabled)', value: 'option5', disabled: true }
        ]
      }
    },
    {
      label: 'Gender',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: [
          { label: 'Male', value: '1' },
          { label: 'Female', value: '2' }
        ]
      }
    }
  ])

  // Events
  function handleReset() {
    console.log('Reset form')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('Form data', formData.value)
  }
</script>
