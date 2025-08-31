import { useSettingStore } from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

/**
 * Color conversion result interface
 */
interface RgbaResult {
  red: number
  green: number
  blue: number
  rgba: string
}

/**
 * Get CSS variable value (alias)
 * @param name CSS variable name
 * @returns CSS variable value
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

/**
 * Validate hex color format
 * @param hex hex value
 * @returns Whether valid hex
 */
function isValidHexColor(hex: string): boolean {
  const cleanHex = hex.trim().replace(/^#/, '')
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)
}

/**
 * Validate RGB values
 * @param r red
 * @param g green
 * @param b blue
 * @returns Whether valid RGB
 */
function isValidRgbValue(r: number, g: number, b: number): boolean {
  const isValid = (value: number) => Number.isInteger(value) && value >= 0 && value <= 255
  return isValid(r) && isValid(g) && isValid(b)
}

/**
 * Convert hex to RGBA
 * @param hex hex value (#FFF or #FFFFFF)
 * @param opacity 0-1
 * @returns Object with RGB values and RGBA string
 */
export function hexToRgba(hex: string, opacity: number): RgbaResult {
  if (!isValidHexColor(hex)) {
    throw new Error('Invalid hex color format')
  }

  // Remove # prefix and uppercase
  let cleanHex = hex.trim().replace(/^#/, '').toUpperCase()

  // Expand shorthand (e.g., FFF)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  }

  // Parse RGB values
  const [red, green, blue] = cleanHex.match(/\w\w/g)!.map((x) => parseInt(x, 16))

  // Clamp opacity
  const validOpacity = Math.max(0, Math.min(1, opacity))

  // Build RGBA string
  const rgba = `rgba(${red}, ${green}, ${blue}, ${validOpacity.toFixed(2)})`

  return { red, green, blue, rgba }
}

/**
 * Convert hex to RGB array
 * @param hexColor hex value
 * @returns [r, g, b]
 */
export function hexToRgb(hexColor: string): number[] {
  if (!isValidHexColor(hexColor)) {
    ElMessage.warning('Invalid hex color value')
    throw new Error('Invalid hex color format')
  }

  const cleanHex = hexColor.replace(/^#/, '')
  let hex = cleanHex

  // Handle shorthand
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  }

  const hexPairs = hex.match(/../g)
  if (!hexPairs) {
    throw new Error('Invalid hex color format')
  }

  return hexPairs.map((hexPair) => parseInt(hexPair, 16))
}

/**
 * Convert RGB to hex
 * @param r red (0-255)
 * @param g green (0-255)
 * @param b blue (0-255)
 * @returns hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  if (!isValidRgbValue(r, g, b)) {
    ElMessage.warning('Invalid RGB color values')
    throw new Error('Invalid RGB color values')
  }

  const toHex = (value: number) => {
    const hex = value.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Color mix
 * @param color1 first color
 * @param color2 second color
 * @param ratio mix ratio (0-1)
 * @returns mixed color
 */
export function colourBlend(color1: string, color2: string, ratio: number): string {
  const validRatio = Math.max(0, Math.min(1, Number(ratio)))

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const blendedRgb = rgb1.map((value1, index) => {
    const value2 = rgb2[index]
    return Math.round(value1 * (1 - validRatio) + value2 * validRatio)
  })

  return rgbToHex(blendedRgb[0], blendedRgb[1], blendedRgb[2])
}

/**
 * Get lighter color
 * @param color base color
 * @param level lighten level (0-1)
 * @param isDark dark theme
 * @returns lighter color
 */
export function getLightColor(color: string, level: number, isDark: boolean = false): string {
  if (!isValidHexColor(color)) {
    ElMessage.warning('Invalid hex color value')
    throw new Error('Invalid hex color format')
  }

  if (isDark) {
    return getDarkColor(color, level)
  }

  const rgb = hexToRgb(color)
  const lightRgb = rgb.map((value) => Math.floor((255 - value) * level + value))

  return rgbToHex(lightRgb[0], lightRgb[1], lightRgb[2])
}

/**
 * Get darker color
 * @param color base color
 * @param level darken level (0-1)
 * @returns darker color
 */
export function getDarkColor(color: string, level: number): string {
  if (!isValidHexColor(color)) {
    ElMessage.warning('Invalid hex color value')
    throw new Error('Invalid hex color format')
  }

  const rgb = hexToRgb(color)
  const darkRgb = rgb.map((value) => Math.floor(value * (1 - level)))

  return rgbToHex(darkRgb[0], darkRgb[1], darkRgb[2])
}

/**
 * Handle Element Plus theme colors
 * @param theme primary color
 * @param isDark is dark theme
 */
export function handleElementThemeColor(theme: string, isDark: boolean = false): void {
  document.documentElement.style.setProperty('--el-color-primary', theme)

  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${i}`,
      getLightColor(theme, i / 10, isDark)
    )
  }

  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-dark-${i}`,
      getDarkColor(theme, i / 10)
    )
  }
}

/**
 * Set Element Plus theme color
 * @param color primary color
 */
export function setElementThemeColor(color: string): void {
  const mixColor = '#ffffff'
  const elStyle = document.documentElement.style

  elStyle.setProperty('--el-color-primary', color)
  handleElementThemeColor(color, useSettingStore().isDark)

  // Generate lighter custom shades
  for (let i = 1; i < 16; i++) {
    const itemColor = colourBlend(color, mixColor, i / 16)
    elStyle.setProperty(`--el-color-primary-custom-${i}`, itemColor)
  }
}
