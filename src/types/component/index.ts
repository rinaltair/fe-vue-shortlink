/**
 * Type definitions related to components
 */

// Search component type
export type SearchComponentType =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange'
  | 'week'
  | 'time'
  | 'timerange'

// Search input change parameters
export interface SearchChangeParams {
  prop: string
  val: unknown
}

// Table column configuration interface
export interface ColumnOption<T = any> {
  // Column type
  type?: 'selection' | 'expand' | 'index' | 'globalIndex'
  // Column prop name
  prop?: string
  // Column label
  label?: string
  // Column width
  width?: string | number
  // Minimum column width
  minWidth?: string | number
  // Fixed column
  fixed?: boolean | 'left' | 'right'
  // Sortable
  sortable?: boolean
  // Filter options
  filters?: any[]
  // Filter method
  filterMethod?: (value: any, row: any) => boolean
  // Filter placement
  filterPlacement?: string
  // Disabled
  disabled?: boolean
  // Selected (can be used to hide column)
  checked?: boolean
  // Custom render function
  formatter?: (row: T) => any
  // Slot-related configuration
  // Whether to render content via slot
  useSlot?: boolean
  // Slot name (defaults to prop value)
  slotName?: string
  // Whether to use header slot
  useHeaderSlot?: boolean
  // Header slot name (defaults to `${prop}-header`)
  headerSlotName?: string
  // Other properties
  [key: string]: any
}

// Pagination configuration
export interface PaginationConfig {
  // Current page
  currentPage: number
  // Page size
  pageSize: number
  // Total items
  total: number
  // Page size options
  pageSizes?: number[]
  // Component layout
  layout?: string
  // Small pagination
  small?: boolean
}

// Form rules
export interface FormRule {
  // Required
  required?: boolean
  // Error message
  message?: string
  // Trigger
  trigger?: string | string[]
  // Minimum length
  min?: number
  // Maximum length
  max?: number
  // Regular expression
  pattern?: RegExp
  // Custom validator
  validator?: (rule: any, value: any, callback: any) => void
}

// Dialog configuration
export interface DialogConfig {
  // Title
  title: string
  // Visible
  visible: boolean
  // Width
  width?: string | number
  // Close by clicking modal
  closeOnClickModal?: boolean
  // Close by pressing ESC
  closeOnPressEscape?: boolean
  // Show close button
  showClose?: boolean
  // Lock body scroll when Dialog appears
  lockScroll?: boolean
  // Show modal overlay
  modal?: boolean
  // Custom class name
  customClass?: string
}
