/**
 * Array utility functions
 */

// Remove duplicates from array
export function noRepeat<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

// Find max value in array
export function arrayMax(arr: number[]): number {
  if (!arr.length) throw new Error('Array is empty')
  return Math.max(...arr)
}

// Find min value in array
export function arrayMin(arr: number[]): number {
  if (!arr.length) throw new Error('Array is empty')
  return Math.min(...arr)
}

// Split array into chunks
export function chunk<T>(arr: T[], size: number = 1): T[][] {
  if (size <= 0) return [arr.slice()]
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

// Count occurrences of a value
export function countOccurrences<T>(arr: T[], value: T): number {
  return arr.reduce((count, current) => (current === value ? count + 1 : count), 0)
}

// Flatten array
export function flatten<T>(arr: any[], depth: number = Infinity): T[] {
  return arr.flat(depth)
}

// Difference of two arrays (A - B)
export function difference<T>(arrA: T[], arrB: T[]): T[] {
  const setB = new Set(arrB)
  return arrA.filter((item) => !setB.has(item))
}

// Intersection of two arrays
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter((item) => set2.has(item))
}

// Drop n elements from the right
export function dropRight<T>(arr: T[], n: number = 0): T[] {
  return arr.slice(0, Math.max(0, arr.length - n))
}

// Return every nth element
export function everyNth<T>(arr: T[], nth: number): T[] {
  if (nth <= 0) return []
  return arr.filter((_, i) => i % nth === nth - 1)
}

// Return the nth element (supports negative index)
export function nthElement<T>(arr: T[], n: number = 0): T | undefined {
  const index = n >= 0 ? n : arr.length + n
  return arr[index]
}

// Shuffle array (Fisher–Yates)
export function shuffle<T>(arr: T[]): T[] {
  const array = [...arr] // create a copy to avoid mutating original
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
