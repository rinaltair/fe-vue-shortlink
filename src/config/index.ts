/**
 * System configuration
 * Includes: system info, system themes, menu themes, menu layouts, main colors, defaults, quick entry config, header bar config
 */
import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { SystemConfig } from '@/types/config'
import { configImages } from './assets/images'
import fastEnterConfig from './fastEnter'
import { headerBarConfig } from './headerBar'

const appConfig: SystemConfig = {
  // System info
  systemInfo: {
    name: 'Art Design Pro' // System name
  },
  // Element Plus theme
  elementPlusTheme: {
    primary: '#5D87FF'
  },
  // System themes
  systemThemeStyles: {
    [SystemThemeEnum.LIGHT]: { className: '' },
    [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
  },
  // System theme list
  settingThemeList: [
    {
      name: 'Light',
      theme: SystemThemeEnum.LIGHT,
      color: ['#fff', '#fff'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.themeStyles.light
    },
    {
      name: 'Dark',
      theme: SystemThemeEnum.DARK,
      color: ['#22252A'],
      leftLineColor: '#3F4257',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.dark
    },
    {
      name: 'System',
      theme: SystemThemeEnum.AUTO,
      color: ['#fff', '#22252A'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.system
    }
  ],
  // Menu layout list
  menuLayoutList: [
    { name: 'Left', value: MenuTypeEnum.LEFT, img: configImages.menuLayouts.vertical },
    { name: 'Top', value: MenuTypeEnum.TOP, img: configImages.menuLayouts.horizontal },
    { name: 'Mixed', value: MenuTypeEnum.TOP_LEFT, img: configImages.menuLayouts.mixed },
    { name: 'Dual Column', value: MenuTypeEnum.DUAL_MENU, img: configImages.menuLayouts.dualColumn }
  ],
  // Menu theme list
  themeList: [
    {
      theme: MenuThemeEnum.DESIGN,
      background: '#FFFFFF',
      systemNameColor: 'var(--art-text-gray-800)',
      iconColor: '#6B6B6B',
      textColor: '#29343D',
      textActiveColor: '#3F8CFF',
      iconActiveColor: '#333333',
      tabBarBackground: '#FAFBFC',
      systemBackground: '#FAFBFC',
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.menuStyles.design
    },
    {
      theme: MenuThemeEnum.DARK,
      background: '#191A23',
      systemNameColor: '#BABBBD',
      iconColor: '#BABBBD',
      textColor: '#BABBBD',
      textActiveColor: '#FFFFFF',
      iconActiveColor: '#FFFFFF',
      tabBarBackground: '#FFFFFF',
      systemBackground: '#F8F8F8',
      leftLineColor: '#3F4257',
      rightLineColor: '#EDEEF0',
      img: configImages.menuStyles.dark
    },
    {
      theme: MenuThemeEnum.LIGHT,
      background: '#ffffff',
      systemNameColor: '#68758E',
      iconColor: '#6B6B6B',
      textColor: '#29343D',
      textActiveColor: '#3F8CFF',
      iconActiveColor: '#333333',
      tabBarBackground: '#FFFFFF',
      systemBackground: '#F8F8F8',
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.menuStyles.light
    }
  ],

  darkMenuStyles: [
    {
      theme: MenuThemeEnum.DARK,
      background: '#161618',
      systemNameColor: '#DDDDDD',
      iconColor: '#BABBBD',
      textColor: 'rgba(#FFFFFF, 0.7)',
      textActiveColor: '',
      iconActiveColor: '#FFFFFF',
      tabBarBackground: '#FFFFFF',
      systemBackground: '#F8F8F8',
      leftLineColor: '#3F4257',
      rightLineColor: '#EDEEF0'
    }
  ],
  // System main colors
  systemMainColor: [
    '#5D87FF',
    '#B48DF3',
    '#1D84FF',
    '#60C041',
    '#38C0FC',
    '#F9901F',
    '#FF80C8'
  ] as const,
  // Other defaults
  systemSetting: {
    defaultMenuWidth: 240, // Menu width
    defaultCustomRadius: '0.75', // Custom border radius
    defaultTabStyle: 'tab-default' // Tab style
  },
  // Quick entry configuration
  fastEnter: fastEnterConfig,
  // Header bar configuration
  headerBar: headerBarConfig
}

export default Object.freeze(appConfig)
