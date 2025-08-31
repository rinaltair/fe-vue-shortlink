import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TableSizeEnum } from '@/enums/formEnum'

// Table store
export const useTableStore = defineStore(
  'tableStore',
  () => {
    // Table size
    const tableSize = ref(TableSizeEnum.DEFAULT)
    // Zebra stripes
    const isZebra = ref(false)
    // Borders
    const isBorder = ref(false)
    // Header background
    const isHeaderBackground = ref(false)

    // Fullscreen state
    const isFullScreen = ref(false)

    /**
     * Set table size
     * @param size Table size enum
     */
    const setTableSize = (size: TableSizeEnum) => (tableSize.value = size)

    /**
     * Set zebra stripe visibility
     * @param value Whether to show zebra stripes
     */
    const setIsZebra = (value: boolean) => (isZebra.value = value)

    /**
     * Set table border visibility
     * @param value Whether to show borders
     */
    const setIsBorder = (value: boolean) => (isBorder.value = value)

    /**
     * Set header background visibility
     * @param value Whether to show header background
     */
    const setIsHeaderBackground = (value: boolean) => (isHeaderBackground.value = value)

    /**
     * Set fullscreen state
     * @param value Whether fullscreen
     */
    const setIsFullScreen = (value: boolean) => (isFullScreen.value = value)

    return {
      tableSize,
      isZebra,
      isBorder,
      isHeaderBackground,
      setTableSize,
      setIsZebra,
      setIsBorder,
      setIsHeaderBackground,
      isFullScreen,
      setIsFullScreen
    }
  },
  {
    persist: {
      key: 'table',
      storage: localStorage
    }
  }
)
