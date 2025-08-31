/**
 * Form validation utilities
 * Provides common field validators
 */

/**
 * Password strength levels enum
 */
export enum PasswordStrength {
  WEAK = 'Weak',
  MEDIUM = 'Medium',
  STRONG = 'Strong'
}

/**
 * Trim string
 * @param value Input string
 * @returns Trimmed string
 */
export function trimSpaces(value: string): string {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim()
}

/**
 * Validate mobile number (Mainland China)
 * @param value Phone number string
 * @returns Validation result
 */
export function validatePhone(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // Mainland China: starts with 1, second digit 3-9, 11 digits
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value.trim())
}

/**
 * Validate landline (Mainland China)
 * @param value Phone number string
 * @returns Validation result
 */
export function validateTelPhone(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // Formats: area-code-number e.g. 010-12345678, 0755-1234567
  const telRegex = /^0\d{2,3}-?\d{7,8}$/
  return telRegex.test(value.trim().replace(/\s+/g, ''))
}

/**
 * Validate username
 * @param value Username string
 * @returns Validation result
 * @description Rules: starts with a letter, 5-20 chars, letters/numbers/underscore
 */
export function validateAccount(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // Starts with letter, 5-20, letters/numbers/underscore
  const accountRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/
  return accountRegex.test(value.trim())
}

/**
 * Validate password
 * @param value Password string
 * @returns Validation result
 * @description Rules: 6-20 chars, must include letters and numbers
 */
export function validatePassword(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // Length check
  if (trimmedValue.length < 6 || trimmedValue.length > 20) {
    return false
  }

  // Must include letters and numbers
  const hasLetter = /[a-zA-Z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)

  return hasLetter && hasNumber
}

/**
 * Validate strong password
 * @param value Password string
 * @returns Validation result
 * @description Rules: 8-20 chars, includes uppercase, lowercase, number, special
 */
export function validateStrongPassword(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // Length check
  if (trimmedValue.length < 8 || trimmedValue.length > 20) {
    return false
  }

  // Must include: uppercase, lowercase, number, special char
  const hasUpperCase = /[A-Z]/.test(trimmedValue)
  const hasLowerCase = /[a-z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmedValue)

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}

/**
 * Get password strength
 * @param value Password string
 * @returns Strength: Weak/Medium/Strong
 * @description Weak: single type; Medium: two types; Strong: three or more types
 */
export function getPasswordStrength(value: string): PasswordStrength {
  if (!value || typeof value !== 'string') {
    return PasswordStrength.WEAK
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length < 6) {
    return PasswordStrength.WEAK
  }

  const hasUpperCase = /[A-Z]/.test(trimmedValue)
  const hasLowerCase = /[a-z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmedValue)

  const typeCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

  if (typeCount >= 3) {
    return PasswordStrength.STRONG
  } else if (typeCount >= 2) {
    return PasswordStrength.MEDIUM
  } else {
    return PasswordStrength.WEAK
  }
}

/**
 * Validate IPv4 address
 * @param value IP string
 * @returns Validation result
 */
export function validateIPv4Address(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()
  const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

  if (!ipRegex.test(trimmedValue)) {
    return false
  }

  // Extra check for each segment range
  const segments = trimmedValue.split('.')
  return segments.every((segment) => {
    const num = parseInt(segment, 10)
    return num >= 0 && num <= 255
  })
}

/**
 * Validate email address
 * @param value Email string
 * @returns Validation result
 */
export function validateEmail(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // Simplified RFC 5322 email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  return emailRegex.test(trimmedValue) && trimmedValue.length <= 254
}

/**
 * Validate URL
 * @param value URL string
 * @returns Validation result
 */
export function validateURL(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  try {
    new URL(value.trim())
    return true
  } catch {
    return false
  }
}

/**
 * Validate Chinese ID card (Mainland China)
 * @param value ID string
 * @returns Validation result
 */
export function validateChineseIDCard(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // 18-digit Chinese ID number regex
  const idCardRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

  if (!idCardRegex.test(trimmedValue)) {
    return false
  }

  // Validate checksum
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(trimmedValue[i]) * weights[i]
  }

  const checkCode = checkCodes[sum % 11]
  return trimmedValue[17].toUpperCase() === checkCode
}

/**
 * Validate bank card number
 * @param value Bank card number string
 * @returns Returns validation result; true indicates a valid format
 */
export function validateBankCard(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim().replace(/\s+/g, '')

  // Bank card numbers are usually 13–19 digits
  if (!/^\d{13,19}$/.test(trimmedValue)) {
    return false
  }

  // Luhn algorithm validation
  let sum = 0
  let shouldDouble = false

  for (let i = trimmedValue.length - 1; i >= 0; i--) {
    let digit = parseInt(trimmedValue[i])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit = (digit % 10) + 1
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}
