/**
 * Type definitions related to HTTP requests
 */

// Error message mode
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

// Request configuration options
export interface RequestOptions {
  // Whether to append params to URL
  joinParamsToUrl?: boolean
  // Whether to format dates
  formatDate?: boolean
  // Whether to transform response data
  isTransformResponse?: boolean
  // Whether to return the native response
  isReturnNativeResponse?: boolean
  // Whether to add URL prefix
  joinPrefix?: boolean
  // API URL
  apiUrl?: string
  // Error message mode
  errorMessageMode?: ErrorMessageMode
  // Whether to append a timestamp
  joinTime?: boolean
  // Whether to ignore cancel token
  ignoreCancelToken?: boolean
  // Whether to include token
  withToken?: boolean
}

// Request method type
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Request headers type
export interface RequestHeaders {
  [key: string]: string | number | boolean
}

// Base request config
export interface BaseRequestConfig {
  url: string
  method?: RequestMethod
  headers?: RequestHeaders
  params?: Record<string, any>
  data?: any
  timeout?: number
}
