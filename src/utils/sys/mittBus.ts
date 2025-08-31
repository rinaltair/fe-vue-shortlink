/**
 * Global event bus for publish/subscribe
 * Usage:
 * mittBus.on('event', callback)
 * mittBus.emit('event', data)
 */
import mitt, { type Emitter } from 'mitt'

// Event type mapping
type Events = {
  // Fireworks effect - optional image URL
  triggerFireworks: string | undefined
  // Open settings panel - no args
  openSetting: void
  // Open search dialog - no args
  openSearchDialog: void
  // Open chat window - no args
  openChat: void
  // Open lock screen - no args
  openLockScreen: void
}

// Create a type-safe event bus
const mittBus: Emitter<Events> = mitt<Events>()

export default mittBus
