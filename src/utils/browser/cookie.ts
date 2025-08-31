/**
 * Cookie utilities
 */

// Set a cookie
export function setCookie(key: string, value: string, expireDays: number): void {
  const date = new Date()
  date.setDate(date.getDate() + expireDays)
  document.cookie = `${key}=${encodeURIComponent(value)}${
    expireDays ? `;expires=${date.toUTCString()}` : ''
  }`
}

// Delete a cookie
export function delCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

// Get a cookie
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
