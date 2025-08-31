/**
 * Festival configuration
 * Includes: fireworks effect and scrolling text
 */
// Image assets must be predefined in components/Ceremony/Fireworks
import { FestivalConfig } from '@/types/config'
import sd from '@imgs/ceremony/sd.png'
import yd from '@imgs/ceremony/yd.png'

export const festivalConfigList: FestivalConfig[] = [
  {
    date: '2025-01-01',
    name: 'New Year',
    image: yd,
    scrollText:
      'Happy New Year! Art Design Pro wishes you a prosperous 2025 with success, happiness, and good fortune!'
  },
  {
    date: '2024-12-25',
    name: 'Christmas',
    image: sd,
    scrollText:
      'Merry Christmas! Art Design Pro wishes you joy and blessings throughout the holidays!'
  }
]
