<template>
  <div class="page-content">
    <!-- Calendar body -->
    <ElCalendar v-model="currentDate">
      <template #date-cell="{ data }">
        <div
          class="calendar-cell"
          :class="{ 'is-selected': data.isSelected }"
          @click="handleCellClick(data.day)"
        >
          <!-- Date display -->
          <p class="calendar-date">{{ formatDate(data.day) }}</p>

          <!-- Event list -->
          <div class="calendar-events">
            <div
              v-for="event in getEvents(data.day)"
              :key="`${event.date}-${event.content}`"
              class="calendar-event"
              @click.stop="handleEventClick(event)"
            >
              <div class="event-tag" :class="[`${event.type || 'bg-primary'}`]">
                {{ event.content }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ElCalendar>

    <!-- Event edit dialog -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm :model="eventForm" label-width="80px">
        <ElFormItem label="Event Title" required>
          <ElInput v-model="eventForm.content" placeholder="Please enter event title" />
        </ElFormItem>
        <ElFormItem label="Event Color">
          <ElRadioGroup v-model="eventForm.type">
            <ElRadio v-for="type in eventTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="Start Date" required>
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.date"
            type="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem label="End Date">
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.endDate"
            type="date"
            placeholder="Select end date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :min-date="eventForm.date"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton v-if="isEditing" type="danger" @click="handleDeleteEvent"> Delete </ElButton>
          <ElButton type="primary" @click="handleSaveEvent">
            {{ isEditing ? 'Update' : 'Add' }}
          </ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  // Types
  interface CalendarEvent {
    date: string
    endDate?: string
    content: string
    type?: 'bg-primary' | 'bg-success' | 'bg-warning' | 'bg-danger'
  }

  // Constants
  const eventTypes = [
    { label: 'Primary', value: 'bg-primary' },
    { label: 'Success', value: 'bg-success' },
    { label: 'Warning', value: 'bg-warning' },
    { label: 'Danger', value: 'bg-danger' }
  ] as const

  // State
  const currentDate = ref(new Date('2025-02-07'))
  const events = ref<CalendarEvent[]>([
    { date: '2025-02-01', content: 'Product Requirement Review', type: 'bg-primary' },
    {
      date: '2025-02-03',
      endDate: '2025-02-05',
      content: 'Project Weekly Meeting (multi-day)',
      type: 'bg-primary'
    },
    { date: '2025-02-10', content: 'Yoga Class', type: 'bg-success' },
    { date: '2025-02-15', content: 'Team Building', type: 'bg-primary' },
    { date: '2025-02-20', content: 'Gym Training', type: 'bg-success' },
    { date: '2025-02-20', content: 'Code Review', type: 'bg-danger' },
    { date: '2025-02-20', content: 'Team Lunch', type: 'bg-primary' },
    { date: '2025-02-20', content: 'Project Progress Report', type: 'bg-warning' },
    { date: '2025-02-28', content: 'Monthly Summary Meeting', type: 'bg-warning' }
  ])

  // Dialog state
  const dialogVisible = ref(false)
  const dialogTitle = ref('Add Event')
  const editingEventIndex = ref<number>(-1)
  const eventForm = ref<CalendarEvent>({
    date: '',
    endDate: '',
    content: '',
    type: 'bg-primary'
  })

  // Computed
  const isEditing = computed(() => editingEventIndex.value >= 0)

  // Utils
  const formatDate = (date: string) => date.split('-')[2]

  const getEvents = (day: string) => {
    return events.value.filter((event) => {
      const eventDate = new Date(event.date)
      const currentDate = new Date(day)
      const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date)

      return currentDate >= eventDate && currentDate <= endDate
    })
  }

  const resetForm = () => {
    eventForm.value = {
      date: '',
      endDate: '',
      content: '',
      type: 'bg-primary'
    }
    editingEventIndex.value = -1
  }

  // Handlers
  const handleCellClick = (day: string) => {
    dialogTitle.value = 'Add Event'
    eventForm.value = {
      date: day,
      content: '',
      type: 'bg-primary'
    }
    editingEventIndex.value = -1
    dialogVisible.value = true
  }

  const handleEventClick = (event: CalendarEvent) => {
    dialogTitle.value = 'Edit Event'
    eventForm.value = { ...event }
    editingEventIndex.value = events.value.findIndex(
      (e) => e.date === event.date && e.content === event.content
    )
    dialogVisible.value = true
  }

  const handleSaveEvent = () => {
    if (!eventForm.value.content || !eventForm.value.date) {
      return
    }

    if (isEditing.value) {
      events.value[editingEventIndex.value] = { ...eventForm.value }
    } else {
      events.value.push({ ...eventForm.value })
    }

    dialogVisible.value = false
    resetForm()
  }

  const handleDeleteEvent = () => {
    if (isEditing.value) {
      events.value.splice(editingEventIndex.value, 1)
      dialogVisible.value = false
      resetForm()
    }
  }
</script>

<style scoped lang="scss">
  .page-content {
    height: 100%;

    :deep(.el-calendar) {
      height: 100%;

      .el-calendar__body {
        height: calc(100% - 70px);
      }

      .el-calendar-table {
        height: 100%;

        .is-selected {
          // Background color for selected date
          background-color: var(--el-color-warning-light-9) !important;
        }

        .el-calendar-day {
          height: 100%;

          &:hover {
            background-color: transparent !important;
          }
        }
      }
    }
  }

  .calendar-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 120px;
    max-height: 120px;
    padding: 4px;
    overflow: hidden;
    cursor: pointer;

    .calendar-date {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 14px;
    }

    .calendar-events {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      max-height: 85px;
      padding-right: 4px;
      margin-top: 24px;
      overflow-y: auto;
    }

    .event-tag {
      min-width: 100px;
      padding: 6px 12px;
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 4px;

      &:hover {
        opacity: 0.8;
      }

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 4px;
        height: 100%;
        content: '';
      }

      &.event-continues::after {
        position: absolute;
        top: 50%;
        right: 4px;
        font-size: 12px;
        content: '►';
        transform: translateY(-50%);
      }
    }
  }

  :deep(.el-dialog__body) {
    padding-top: 20px;
  }
</style>
