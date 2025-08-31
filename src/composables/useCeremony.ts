import { useTimeoutFn, useIntervalFn } from '@vueuse/core'
import { useDateFormat } from '@vueuse/core'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { mittBus } from '@/utils/sys'
import { festivalConfigList } from '@/config/festival'

// Festival celebration related config
export function useCeremony() {
  const settingStore = useSettingStore()
  const { holidayFireworksLoaded, isShowFireworks } = storeToRefs(settingStore)

  // Firework interval ref for cleanup
  let fireworksInterval: { pause: () => void } | null = null

  // Check if current date is a festival
  const currentFestivalData = computed(() => {
    const currentDate = useDateFormat(new Date(), 'YYYY-MM-DD').value
    return festivalConfigList.find((item) => item.date === currentDate)
  })

  // Celebration configuration
  const FESTIVAL_CONFIG = {
    INITIAL_DELAY: 300, // Initial delay in ms
    FIREWORK_INTERVAL: 1000, // Firework trigger interval in ms
    TEXT_DELAY: 2000, // Text reveal delay in ms
    MAX_TRIGGERS: 6 // Max trigger times
  } as const

  // Show festival wishes according to configuration
  const openFestival = () => {
    // No festival data, do not show
    if (!currentFestivalData.value) return
    // Fireworks ended, do not show
    if (!isShowFireworks.value) return

    let triggers = 0

    const { start: startFireworks } = useTimeoutFn(() => {
      const { pause } = useIntervalFn(() => {
        // console.log(currentFestivalData.value?.image)
        mittBus.emit('triggerFireworks', currentFestivalData.value?.image)
        triggers++

        if (triggers >= FESTIVAL_CONFIG.MAX_TRIGGERS) {
          pause()
          settingStore.setholidayFireworksLoaded(true)

          // Show festival text on homepage
          useTimeoutFn(() => {
            settingStore.setShowFestivalText(true)
            setFestivalDate()
          }, FESTIVAL_CONFIG.TEXT_DELAY)
        }
      }, FESTIVAL_CONFIG.FIREWORK_INTERVAL)

      fireworksInterval = { pause }
    }, FESTIVAL_CONFIG.INITIAL_DELAY)

    startFireworks()
  }

  // Cleanup
  const cleanup = () => {
    if (fireworksInterval) {
      fireworksInterval.pause()
      settingStore.setShowFestivalText(false)
      setFestivalDate()
    }
  }

  // Set festival date
  const setFestivalDate = () => {
    settingStore.setFestivalDate(currentFestivalData.value?.date || '')
  }

  return {
    openFestival,
    cleanup,
    holidayFireworksLoaded,
    currentFestivalData,
    isShowFireworks
  }
}
