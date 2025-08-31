/**
 * Data formatting utilities
 */

// Convert timestamp to formatted time
export function timestampToTime(timestamp: number = Date.now(), isMs: boolean = true): string {
  const date = new Date(isMs ? timestamp : timestamp * 1000)
  return date.toISOString().replace('T', ' ').slice(0, 19)
}

// Number formatting (thousand separators)
export function commafy(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Generate a random integer in [min, max]
export function randomNum(min: number, max?: number): number {
  if (max === undefined) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Remove HTML tags
export function removeHtmlTags(str: string = ''): string {
  return str.replace(/<[^>]*>/g, '')
}
