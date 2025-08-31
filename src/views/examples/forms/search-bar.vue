<!-- Table Search Bar Example -->
<template>
  <div class="search-bar">
    <h2 class="title">Basic Example (collapsed by default)</h2>
    <ArtSearchBar
      ref="searchBarBasicRef"
      v-model="formDataBasic"
      :items="formItemsBasic"
      @reset="handleBasicReset"
      @search="handleBasicSearch"
    >
    </ArtSearchBar>

    <h2 class="title m-15">Full Example (expanded by default)</h2>
    <ArtSearchBar
      ref="searchBarAdvancedRef"
      v-model="formDataAdvanced"
      :items="formItemsAdvanced"
      :rules="rulesAdvanced"
      :defaultExpanded="true"
      :labelWidth="labelWidthAdvanced"
      :labelPosition="labelPositionAdvanced"
      :span="spanAdvanced"
      :gutter="gutterAdvanced"
      @reset="handleAdvancedReset"
      @search="handleAdvancedSearch"
    >
      <template #slots>
        <ElInput
          v-model="formDataAdvanced.slots"
          placeholder="I am a component rendered by a slot"
        />
      </template>
    </ArtSearchBar>

    <div class="code">
      <pre><code>{{ formDataAdvanced }}</code></pre>
    </div>

    <div class="button-group">
      <el-button @click="getLevelOptions"> Fetch user level data </el-button>
      <el-button @click="advancedValidate"> Validate form </el-button>
      <el-button @click="advancedReset"> Reset </el-button>
      <el-button v-if="showUserName" @click="updateUserName"> Modify username </el-button>
      <el-button v-if="showUserName" @click="deleteUserName"> Delete username </el-button>
      <el-button @click="labelWidthAdvanced = 120"> Change label width </el-button>
      <el-button @click="spanAdvanced = 8"> Set components per row </el-button>
      <el-button @click="gutterAdvanced = 50"> Change gutter </el-button>
      <el-button @click="labelPositionAdvanced = 'left'"> Label align left </el-button>
      <el-button @click="labelPositionAdvanced = 'right'"> Label align right </el-button>
      <el-button @click="labelPositionAdvanced = 'top'"> Label align top </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArtIconSelector from '@/components/core/base/art-icon-selector/index.vue'
  import { SearchFormItem } from '@/components/core/forms/art-search-bar/index.vue'
  import { IconTypeEnum } from '@/enums/appEnum'
  import { ElMessage } from 'element-plus'

  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const emit = defineEmits<Emits>()

  // Form data bindings
  const searchBarBasicRef = ref()
  const searchBarAdvancedRef = ref()

  // Basic example form data
  const formDataBasic = ref({
    name: undefined,
    phone: undefined,
    level: undefined,
    address: undefined,
    date: undefined,
    daterange: undefined,
    status: undefined
  })

  // Full example form data
  const formDataAdvanced = ref({
    name: undefined,
    phone: undefined,
    level: undefined,
    address: undefined,
    slots: undefined,
    date: undefined,
    daterange: undefined,
    cascader: undefined,
    checkboxgroup: undefined,
    userGender: undefined,
    iconSelector: undefined,
    status: undefined,
    systemName: undefined
  })

  // Validation rules for the full example
  const rulesAdvanced = {
    name: [{ required: true, message: 'Please enter a username', trigger: 'blur' }],
    phone: [
      { required: true, message: 'Please enter a phone number', trigger: 'blur' },
      { min: 11, max: 11, message: 'Please enter an 11-digit phone number', trigger: 'blur' },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: 'Please enter a valid phone number',
        trigger: 'blur'
      }
    ],
    level: [{ required: true, message: 'Please select a level', trigger: 'change' }],
    address: [{ required: true, message: 'Please enter an address', trigger: 'blur' }]
  }

  const labelWidthAdvanced = ref(100)
  const labelPositionAdvanced = ref<'right' | 'left' | 'top'>('right')
  const spanAdvanced = ref(6)
  const gutterAdvanced = ref(12)

  // Dynamic options
  const levelOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // Shared option data
  const LEVEL_OPTIONS = [
    { label: 'Regular User', value: 'normal' },
    { label: 'VIP User', value: 'vip' },
    { label: 'Premium VIP', value: 'svip' },
    { label: 'Enterprise User', value: 'enterprise', disabled: true }
  ]

  const GENDER_OPTIONS = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' }
  ]

  const DATE_SHORTCUTS = [
    { text: 'Today', value: new Date() },
    { text: 'Yesterday', value: () => new Date(Date.now() - 86400000) },
    { text: 'One week ago', value: () => new Date(Date.now() - 604800000) }
  ]

  // Simulate API for user levels
  function fetchLevelOptions(): Promise<typeof levelOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(LEVEL_OPTIONS)
      }, 500)
    })
  }

  // Fetch user level data
  async function getLevelOptions() {
    levelOptions.value = await fetchLevelOptions()
    if (levelOptions.value.length) {
      ElMessage.success('Successfully fetched data')
    }
  }

  // Factory function to create form items
  const createFormItem = (config: any) => config

  // Basic form items config
  const baseFormItems = {
    username: createFormItem({
      label: 'Username',
      key: 'name',
      type: 'input',
      placeholder: 'Please enter a username',
      clearable: true
    }),
    phone: createFormItem({
      label: 'Phone Number',
      key: 'phone',
      type: 'input',
      props: { placeholder: 'Please enter a phone number', maxlength: '11' }
    }),
    level: createFormItem({
      label: 'User Level',
      key: 'level',
      type: 'select',
      props: {
        placeholder: 'Please select a level',
        options: LEVEL_OPTIONS
      }
    }),
    address: createFormItem({
      label: 'Address',
      key: 'address',
      type: 'input',
      placeholder: 'Please enter an address'
    }),
    date: createFormItem({
      label: 'Date',
      key: 'date',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Please select a date',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: DATE_SHORTCUTS
      }
    }),
    gender: createFormItem({
      label: 'Gender',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: GENDER_OPTIONS
      }
    })
  }

  // Form configuration
  const formItemsBasic = computed(() => [
    baseFormItems.username,
    {
      label: 'Password',
      key: 'password',
      type: 'input',
      props: {
        type: 'password',
        placeholder: 'Please enter a password',
        clearable: true
      }
    },
    baseFormItems.phone,
    baseFormItems.level,
    baseFormItems.address,
    baseFormItems.date,
    baseFormItems.gender
  ])

  const userItem = ref<SearchFormItem>({
    label: 'Username',
    key: 'name',
    type: 'input',
    props: {
      placeholder: 'Please enter a username',
      clearable: true
    }
  })

  // Control whether the username field is shown
  const showUserName = ref(true)

  // Cascader data
  const cascaderOptions = [
    {
      value: 'guide',
      label: 'Guide',
      children: [
        {
          value: 'disciplines',
          label: 'Specifications',
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
          label: 'Basic Components',
          children: [
            { value: 'button', label: 'Button' },
            { value: 'form', label: 'Form' },
            { value: 'table', label: 'Table' }
          ]
        }
      ]
    }
  ]

  // Tree-select data
  const treeSelectData = [
    {
      value: '1',
      label: 'Level 1',
      children: [
        {
          value: '1-1',
          label: 'Level 2 (1-1)',
          children: [{ value: '1-1-1', label: 'Level 3 (1-1-1)' }]
        }
      ]
    },
    {
      value: '2',
      label: 'Level 1 (2)',
      children: [
        {
          value: '2-1',
          label: 'Level 2 (2-1)',
          children: [{ value: '2-1-1', label: 'Level 3 (2-1-1)' }]
        },
        {
          value: '2-2',
          label: 'Level 2 (2-2)',
          children: [{ value: '2-2-1', label: 'Level 3 (2-2-1)' }]
        }
      ]
    }
  ]

  // Checkbox options
  const checkboxOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
    { label: 'Option 5 (disabled)', value: 'option5', disabled: true }
  ]

  // Full example form configuration
  const formItemsAdvanced = computed(() => [
    ...(showUserName.value ? [userItem.value] : []),
    {
      ...baseFormItems.phone
    },
    {
      ...baseFormItems.level,
      props: { placeholder: 'Please select a level', options: levelOptions.value }
    },
    baseFormItems.address,
    baseFormItems.date,
    // Datetime
    {
      label: 'Datetime',
      key: 'datetime',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Please select a date/time',
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
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
    // Datetime range
    {
      label: 'Datetime Range',
      key: 'datetimerange',
      type: 'datetime',
      props: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        rangeSeparator: 'to',
        startPlaceholder: 'Start datetime',
        endPlaceholder: 'End datetime'
      }
    },
    // Time select
    {
      label: 'Time Select',
      key: 'timeselect',
      type: 'timeselect',
      props: {
        placeholder: 'Please select a time',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },
    // Time picker
    {
      label: 'Time Picker',
      key: 'timepicker',
      type: 'timepicker',
      props: {
        style: { width: '100%' },
        placeholder: 'Please select a time',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },
    // Cascader
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
        options: cascaderOptions
      }
    },
    // Tree select
    {
      label: 'Tree Select',
      key: 'treeSelect',
      type: 'treeselect',
      props: {
        showCheckbox: true,
        multiple: true,
        clearable: true,
        data: treeSelectData
      }
    },
    { label: 'Slot', key: 'slots', type: 'input', placeholder: 'Please enter an email' },
    {
      label: 'Rendered Component',
      key: 'iconSelector',
      type: () => h(ArtIconSelector, { iconType: IconTypeEnum.UNICODE, width: '100%' }),
      props: { placeholder: 'Please enter remarks', type: 'textarea', rows: 4 }
    },
    {
      label: 'Custom Component',
      key: 'customComponent',
      type: () =>
        h(
          'div',
          {
            style:
              'color: var(--art-gray-600); border: 1px solid var(--art-border-dashed-color); padding: 0px 15px; border-radius: 6px'
          },
          'I am a custom component'
        ),
      props: {
        placeholder: 'Please enter remarks',
        type: 'textarea',
        rows: 4,
        style: { width: '100%' }
      }
    },
    {
      label: 'Checkbox Group',
      key: 'checkboxgroup',
      type: 'checkboxgroup',
      span: 12,
      props: {
        options: checkboxOptions
      }
    },
    {
      ...baseFormItems.gender
    },

    {
      label: 'Enabled',
      key: 'isEnabled',
      type: 'switch',
      props: {
        placeholder: 'Please choose whether enabled'
      }
    },
    {
      label: 'Age',
      key: 'age',
      type: 'number',
      slots: {
        suffix: () => h('span', { style: 'color: #909399; font-size: 12px' }, 'yrs')
      }
    },
    {
      label: 'Website URL',
      key: 'website',
      type: 'input',
      placeholder: 'Please enter a website name',
      slots: {
        prepend: () => h('span', 'https://'),
        append: () => h('span', '.com')
      }
    },
    {
      label: 'Event Demo',
      key: 'event',
      type: 'input',
      props: {
        placeholder: 'Type to trigger events; see console',
        clearable: true,
        prefixIcon: 'Search',
        // prefix: () => h('span', {}, '123'),
        // Events must start with `on` and then use camelCase to match Element Plus event names
        onInput(val: string) {
          console.log('Input event', val)
        },
        onClear() {
          console.log('Clear event')
        }
      }
    },

    {
      label: 'Multiline Input',
      key: 'remark',
      type: 'input',
      props: {
        placeholder: 'Please enter remarks',
        type: 'textarea',
        rows: 2
      }
    },
    {
      label: 'Rating',
      key: 'rate',
      type: 'rate',
      props: {
        size: 'large',
        placeholder: 'Please select a rating'
      }
    },
    {
      label: 'Disabled',
      key: 'diaabled',
      type: 'input',
      placeholder: 'I am disabled',
      disabled: true // disabled
    },
    {
      label: 'Slider',
      key: 'slider',
      type: 'slider'
      // props: {
      //   step: 10,
      //   showStops: true
      // }
    },

    {
      label: 'Hidden',
      key: 'email',
      type: 'input',
      hidden: true
    },
    // Hide conditionally
    {
      label: 'Hide Conditionally',
      key: 'systemName',
      type: 'input',
      hidden: formDataAdvanced.value.systemName === 'mac',
      placeholder: 'Type mac to hide component'
    },
    {
      label: 'Grid Layout',
      key: 'sg1',
      type: 'input',
      span: 12,
      placeholder: 'Example: span=12 takes half width; span=24 takes full width'
    }
  ])

  // Unified form handlers
  const createFormHandler = (ref: any, formData: any, type: string) => ({
    reset: () => {
      console.log(`Reset ${type} form`)
      emit('reset')
    },
    search: async () => {
      await ref.value.validate()
      emit('search', formData.value)
      console.log(`${type} form data`, formData.value)
    },
    validate: () => ref.value.validate()
  })

  // Basic form handler
  const basicFormHandler = computed(() =>
    createFormHandler(searchBarBasicRef, formDataBasic, 'Basic')
  )

  // Advanced form handler
  const advancedFormHandler = computed(() =>
    createFormHandler(searchBarAdvancedRef, formDataAdvanced, 'Advanced')
  )

  // Event handlers
  const handleBasicReset = () => basicFormHandler.value.reset()
  const handleBasicSearch = () => basicFormHandler.value.search()
  const handleAdvancedReset = () => advancedFormHandler.value.reset()
  const handleAdvancedSearch = () => advancedFormHandler.value.search()
  const advancedValidate = () => advancedFormHandler.value.validate()
  const advancedReset = () => searchBarAdvancedRef.value.reset()

  const updateUserName = () => {
    userItem.value = {
      ...userItem.value,
      label: 'Nickname',
      props: {
        placeholder: 'Please enter a nickname'
      }
    }
  }

  const deleteUserName = () => {
    showUserName.value = false
    formDataAdvanced.value.name = undefined
  }
</script>

<style scoped lang="scss">
  .search-bar {
    padding-bottom: 20px;

    .title {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 500;

      &.m-15 {
        margin-top: 15px;
      }
    }

    .code {
      padding: 15px;
      margin-top: 15px;
      font-size: 14px;
      background-color: var(--art-main-bg-color);
      border: 1px solid var(--art-border-color);
      border-radius: var(--el-border-radius-base);
    }

    .button-group {
      margin-top: 15px;
    }
  }
</style>
