/**
 * Common type definitions
 */

// Status type
export type Status = 0 | 1 // 0: Disabled, 1: Enabled

// Gender type
export type Gender = 'male' | 'female' | 'unknown'

// Sort direction
export type SortOrder = 'ascending' | 'descending'

// Operation type
export type ActionType = 'create' | 'update' | 'delete' | 'view'

// Optional record-like type
export type Recordable<T = any> = Record<string, T>

// Key-value item type
export type KeyValue<T = any> = {
  key: string
  value: T
  label?: string
}

// Time range type
export interface TimeRange {
  startTime: string
  endTime: string
}

// File info type
export interface FileInfo {
  name: string
  url: string
  size: number
  type: string
  lastModified?: number
}

// Coordinate type
export interface Position {
  x: number
  y: number
}

// Size type
export interface Size {
  width: number
  height: number
}

// Responsive breakpoint type
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Theme mode
export type ThemeMode = 'light' | 'dark' | 'auto'

// Language type
export type Language = 'zh-CN' | 'en-US'

// Environment type
export type Environment = 'development' | 'production' | 'test'
