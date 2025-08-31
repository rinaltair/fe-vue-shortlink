// scripts/clean-dev.ts
import fs from 'fs/promises'
import path from 'path'

// Modern color theme
const theme = {
  // Base colors
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  primary: '\x1b[38;5;75m', // bright blue
  success: '\x1b[38;5;82m', // bright green
  warning: '\x1b[38;5;220m', // bright yellow
  error: '\x1b[38;5;196m', // bright red
  info: '\x1b[38;5;159m', // cyan
  purple: '\x1b[38;5;141m', // purple
  orange: '\x1b[38;5;208m', // orange
  gray: '\x1b[38;5;245m', // gray
  white: '\x1b[38;5;255m', // white

  // Background colors
  bgDark: '\x1b[48;5;235m', // dark gray background
  bgBlue: '\x1b[48;5;24m', // blue background
  bgGreen: '\x1b[48;5;22m', // green background
  bgRed: '\x1b[48;5;52m' // red background
}

// Modern icon set
const icons = {
  rocket: '🚀',
  fire: '🔥',
  star: '⭐',
  gem: '💎',
  crown: '👑',
  magic: '✨',
  warning: '⚠️',
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  folder: '📁',
  file: '📄',
  image: '🖼️',
  code: '💻',
  data: '📊',
  globe: '🌐',
  map: '🗺️',
  chat: '💬',
  bolt: '⚡',
  shield: '🛡️',
  key: '🔑',
  link: '🔗',
  clean: '🧹',
  trash: '🗑️',
  check: '✓',
  cross: '✗',
  arrow: '→',
  loading: '⏳'
}

// Formatting utilities
const fmt = {
  title: (text: string) => `${theme.bold}${theme.primary}${text}${theme.reset}`,
  subtitle: (text: string) => `${theme.purple}${text}${theme.reset}`,
  success: (text: string) => `${theme.success}${text}${theme.reset}`,
  error: (text: string) => `${theme.error}${text}${theme.reset}`,
  warning: (text: string) => `${theme.warning}${text}${theme.reset}`,
  info: (text: string) => `${theme.info}${text}${theme.reset}`,
  highlight: (text: string) => `${theme.bold}${theme.white}${text}${theme.reset}`,
  dim: (text: string) => `${theme.dim}${theme.gray}${text}${theme.reset}`,
  orange: (text: string) => `${theme.orange}${text}${theme.reset}`,

  // Text with background
  badge: (text: string, bg: string = theme.bgBlue) =>
    `${bg}${theme.white}${theme.bold} ${text} ${theme.reset}`,

  // Gradient effect (simulated)
  gradient: (text: string) => {
    const colors = ['\x1b[38;5;75m', '\x1b[38;5;81m', '\x1b[38;5;87m', '\x1b[38;5;159m']
    const chars = text.split('')
    return chars.map((char, i) => `${colors[i % colors.length]}${char}`).join('') + theme.reset
  }
}

// Create modern banner
function createModernBanner() {
  console.log()
  console.log(
    fmt.gradient('  ╔══════════════════════════════════════════════════════════════════╗')
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    `  ║               ${icons.rocket} ${fmt.title('ART DESIGN PRO')} ${fmt.subtitle('· Code cleanup program')} ${icons.magic}                ║`
  )
  console.log(
    `  ║               ${fmt.dim('Remove demo data from the project and quickly switch to development mode')}             ║`
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    fmt.gradient('  ╚══════════════════════════════════════════════════════════════════╝')
  )
  console.log()
}

// Create divider
function createDivider(char = '─', color = theme.primary) {
  console.log(`${color}${'  ' + char.repeat(66)}${theme.reset}`)
}

// Create card container
function createCard(title: string, content: string[]) {
  console.log(`  ${fmt.badge('', theme.bgBlue)} ${fmt.title(title)}`)
  console.log()
  content.forEach((line) => {
    console.log(`     ${line}`)
  })
  console.log()
}

// Progress bar animation
function createProgressBar(current: number, total: number, text: string, width = 40) {
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round((current / total) * width)
  const empty = width - filled

  const filledBar = '█'.repeat(filled)
  const emptyBar = '░'.repeat(empty)

  process.stdout.write(
    `\r  ${fmt.info('Progress')} [${theme.success}${filledBar}${theme.gray}${emptyBar}${theme.reset}] ${fmt.highlight(percentage + '%')})}`
  )

  if (current === total) {
    console.log()
  }
}

// Statistics
const stats = {
  deletedFiles: 0,
  deletedPaths: 0,
  failedPaths: 0,
  startTime: Date.now(),
  totalFiles: 0
}

// Cleanup targets
const targets = [
  'README.md',
  'README.zh-CN.md',
  'src/views/change',
  'src/views/safeguard',
  'src/views/article',
  'src/views/examples',
  'src/views/system/nested',
  'src/views/widgets',
  'src/views/template',
  'src/views/dashboard/analysis',
  'src/views/dashboard/ecommerce',
  'src/mock/json',
  'src/mock/temp/articleList.ts',
  'src/mock/temp/commentDetail.ts',
  'src/mock/temp/commentList.ts',
  'src/assets/img/cover',
  'src/assets/img/safeguard',
  'src/assets/img/3d',
  'src/components/core/charts/art-map-chart',
  'src/components/custom/comment-widget'
]

// Recursively count files
async function countFiles(targetPath: string): Promise<number> {
  const fullPath = path.resolve(process.cwd(), targetPath)

  try {
    const stat = await fs.stat(fullPath)

    if (stat.isFile()) {
      return 1
    } else if (stat.isDirectory()) {
      const entries = await fs.readdir(fullPath)
      let count = 0

      for (const entry of entries) {
        const entryPath = path.join(targetPath, entry)
        count += await countFiles(entryPath)
      }

      return count
    }
  } catch {
    return 0
  }

  return 0
}

// Count total files for all targets
async function countAllFiles(): Promise<number> {
  let totalCount = 0

  for (const target of targets) {
    const count = await countFiles(target)
    totalCount += count
  }

  return totalCount
}

// Delete files and directories
async function remove(targetPath: string, index: number) {
  const fullPath = path.resolve(process.cwd(), targetPath)

  createProgressBar(index + 1, targets.length, targetPath)

  try {
    const fileCount = await countFiles(targetPath)
    await fs.rm(fullPath, { recursive: true, force: true })
    stats.deletedFiles += fileCount
    stats.deletedPaths++
    await new Promise((resolve) => setTimeout(resolve, 50))
  } catch (err) {
    stats.failedPaths++
    console.log()
    console.log(`     ${icons.error} ${fmt.error('Delete failed')}: ${fmt.highlight(targetPath)}`)
    console.log(`     ${fmt.dim('Error details: ' + err)}`)
  }
}

// Clean async routes
async function cleanAsyncRoutes() {
  const asyncRoutesPath = path.resolve(process.cwd(), 'src/router/routes/asyncRoutes.ts')

  try {
    const cleanedRoutes = `import { RoutesAlias } from '../routesAlias'
import { AppRouteRecord } from '@/types/router'

/**
 * Menu list, async routes
 *
 * Supports two modes:
 * Frontend static config - use routes defined in this file
 * Backend dynamic config - backend returns menu data, frontend parses to routes
 *
 * Menu title (title):
 * Can be an i18n key or a string, e.g., 'User List'
 *
 * RoutesAlias.Layout points to the layout component; in backend menu data,
 * the component field should point to /index/index
 * Route meta: async routes configured here; static routes in staticRoutes
 */
export const asyncRoutes: AppRouteRecord[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: 'menus.dashboard.console',
          keepAlive: false,
          fixedTab: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.system.title',
      icon: '&#xe7b9;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: RoutesAlias.User,
        meta: {
          title: 'menus.system.user',
          keepAlive: true,
          roles: ['R_SUPER', 'R_ADMIN']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: RoutesAlias.Role,
        meta: {
          title: 'menus.system.role',
          keepAlive: true,
          roles: ['R_SUPER']
        }
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        component: RoutesAlias.UserCenter,
        meta: {
          title: 'menus.system.userCenter',
          isHide: true,
          keepAlive: true,
          isHideTab: true
        }
      },
      {
        path: 'menu',
        name: 'Menus',
        component: RoutesAlias.Menu,
        meta: {
          title: 'menus.system.menu',
          keepAlive: true,
          roles: ['R_SUPER'],
          authList: [
            {
              title: 'Add',
              authMark: 'add'
            },
            {
              title: 'Edit',
              authMark: 'edit'
            },
            {
              title: 'Delete',
              authMark: 'delete'
            }
          ]
        }
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.result.title',
      icon: '&#xe715;'
    },
    children: [
      {
        path: 'success',
        name: 'ResultSuccess',
        component: RoutesAlias.Success,
        meta: {
          title: 'menus.result.success',
          keepAlive: true
        }
      },
      {
        path: 'fail',
        name: 'ResultFail',
        component: RoutesAlias.Fail,
        meta: {
          title: 'menus.result.fail',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.exception.title',
      icon: '&#xe820;'
    },
    children: [
      {
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: 'menus.exception.forbidden',
          keepAlive: true
        }
      },
      {
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true
        }
      },
      {
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: 'menus.exception.serverError',
          keepAlive: true
        }
      }
    ]
  }
]
`

    await fs.writeFile(asyncRoutesPath, cleanedRoutes, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('Rewrote async routes configuration')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('Failed to clean async routes')}`)
    console.log(`     ${fmt.dim('Error details: ' + err)}`)
  }
}

// Clean route aliases
async function cleanRoutesAlias() {
  const routesAliasPath = path.resolve(process.cwd(), 'src/router/routesAlias.ts')

  try {
    const cleanedAlias = `/**
* Route aliases to quickly locate pages and use for navigation
*/
export enum RoutesAlias {
  // Layout and Auth
  Layout = '/index/index', // layout container
  Login = '/auth/login', // login
  Register = '/auth/register', // register
  ForgetPassword = '/auth/forget-password', // forgot password

  // Exception pages
  Exception403 = '/exception/403', // 403
  Exception404 = '/exception/404', // 404
  Exception500 = '/exception/500', // 500

  // Result pages
  Success = '/result/success', // success
  Fail = '/result/fail', // fail

  // Dashboard
  Dashboard = '/dashboard/console', // workbench

  // System management
  User = '/system/user', // account
  Role = '/system/role', // role
  UserCenter = '/system/user-center', // user center
  Menu = '/system/menu' // menu
}
`

    await fs.writeFile(routesAliasPath, cleanedAlias, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('Rewrote route aliases configuration')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('Failed to clean route aliases')}`)
    console.log(`     ${fmt.dim('Error details: ' + err)}`)
  }
}

// Clean change log
async function cleanChangeLog() {
  const changeLogPath = path.resolve(process.cwd(), 'src/mock/upgrade/changeLog.ts')

  try {
    const cleanedChangeLog = `import { ref } from 'vue'

interface UpgradeLog {
  version: string // version
  title: string // update title
  date: string // update date
  detail?: string[] // update details
  requireReLogin?: boolean // require re-login
  remark?: string // remark
}

export const upgradeLogList = ref<UpgradeLog[]>([])
`

    await fs.writeFile(changeLogPath, cleanedChangeLog, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('Cleared change log data')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('Failed to clean change log')}`)
    console.log(`     ${fmt.dim('Error details: ' + err)}`)
  }
}

// Clean language files
async function cleanLanguageFiles() {
  const languageFiles = [
    { path: 'src/locales/langs/zh.json', name: 'Chinese language file' },
    { path: 'src/locales/langs/en.json', name: 'English language file' }
  ]

  for (const { path: langPath, name } of languageFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), langPath)
      const content = await fs.readFile(fullPath, 'utf-8')
      const langData = JSON.parse(content)

      const menusToRemove = [
        'widgets',
        'template',
        'article',
        'examples',
        'safeguard',
        'plan',
        'help'
      ]

      if (langData.menus) {
        menusToRemove.forEach((menuKey) => {
          if (langData.menus[menuKey]) {
            delete langData.menus[menuKey]
          }
        })

        if (langData.menus.dashboard) {
          if (langData.menus.dashboard.analysis) {
            delete langData.menus.dashboard.analysis
          }
          if (langData.menus.dashboard.ecommerce) {
            delete langData.menus.dashboard.ecommerce
          }
        }

        if (langData.menus.system) {
          const systemKeysToRemove = [
            'nested',
            'menu1',
            'menu2',
            'menu21',
            'menu3',
            'menu31',
            'menu32',
            'menu321'
          ]
          systemKeysToRemove.forEach((key) => {
            if (langData.menus.system[key]) {
              delete langData.menus.system[key]
            }
          })
        }
      }

      await fs.writeFile(fullPath, JSON.stringify(langData, null, 2), 'utf-8')
      console.log(`     ${icons.success} ${fmt.success(`Cleaned ${name} successfully`)}`)
    } catch (err) {
      console.log(`     ${icons.error} ${fmt.error(`Failed to clean ${name}`)}`)
      console.log(`     ${fmt.dim('Error details: ' + err)}`)
    }
  }
}

// Clean fast entry component
async function cleanFastEnterComponent() {
  const fastEnterPath = path.resolve(process.cwd(), 'src/config/fastEnter.ts')

  try {
    const cleanedFastEnter = `/**
* Fast entry configuration
* Includes: application list and quick links configuration
*/
import { RoutesAlias } from '@/router/routesAlias'
import { WEB_LINKS } from '@/utils/constants'
import type { FastEnterConfig } from '@/types/config'

const fastEnterConfig: FastEnterConfig = {
  // Display condition (screen width)
  minWidth: 1200,
  // Application list
  applications: [
    {
      name: 'Workbench',
      description: 'System overview and data statistics',
      icon: '&#xe721;',
      iconColor: '#377dff',
      path: RoutesAlias.Dashboard,
      enabled: true,
      order: 1
    },
    {
      name: 'Official Docs',
      description: 'User guide and development docs',
      icon: '&#xe788;',
      iconColor: '#ffb100',
      path: WEB_LINKS.DOCS,
      enabled: true,
      order: 2
    },
    {
      name: 'Technical Support',
      description: 'Tech support and issue feedback',
      icon: '&#xe86e;',
      iconColor: '#ff6b6b',
      path: WEB_LINKS.COMMUNITY,
      enabled: true,
      order: 3
    },
    {
      name: 'Bilibili',
      description: 'Tech sharing and communication',
      icon: '&#xe6b4;',
      iconColor: '#FB7299',
      path: WEB_LINKS.BILIBILI,
      enabled: true,
      order: 4
    }
  ],
  // Quick links
  quickLinks: [
    {
      name: 'Login',
      path: RoutesAlias.Login,
      enabled: true,
      order: 1
    },
    {
      name: 'Register',
      path: RoutesAlias.Register,
      enabled: true,
      order: 2
    },
    {
      name: 'Forgot Password',
      path: RoutesAlias.ForgetPassword,
      enabled: true,
      order: 3
    },
    {
      name: 'User Center',
      path: RoutesAlias.UserCenter,
      enabled: true,
      order: 4
    }
  ]
}

export default Object.freeze(fastEnterConfig)
`

    await fs.writeFile(fastEnterPath, cleanedFastEnter, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('Cleaned fast entry configuration')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('Failed to clean fast entry configuration')}`)
    console.log(`     ${fmt.dim('Error details: ' + err)}`)
  }
}

// User confirmation function
async function getUserConfirmation(): Promise<boolean> {
  const { createInterface } = await import('readline')

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log(
      `  ${fmt.highlight('Please type')} ${fmt.success('yes')} ${fmt.highlight('to confirm cleanup, or press Enter to cancel')}`
    )
    console.log()
    process.stdout.write(`  ${icons.arrow} `)

    rl.question('', (answer: string) => {
      rl.close()
      resolve(answer.toLowerCase().trim() === 'yes')
    })
  })
}

// Show cleanup warning
async function showCleanupWarning() {
  createCard('Security Warning', [
    `${fmt.warning('This action will permanently delete the following demo content and cannot be undone!')}`,
    `${fmt.dim('Please review the cleanup list carefully and confirm before proceeding')}`
  ])

  const cleanupItems = [
    {
      icon: icons.image,
      name: 'Image assets',
      desc: 'Demo cover images, 3D images, operation images, etc.',
      color: theme.orange
    },
    {
      icon: icons.file,
      name: 'Demo pages',
      desc: 'widgets, template, article, examples, safeguard, etc.',
      color: theme.purple
    },
    {
      icon: icons.code,
      name: 'Dynamic route files',
      desc: 'Rewrite asyncRoutes.ts, keep only core routes',
      color: theme.primary
    },
    {
      icon: icons.link,
      name: 'Route aliases',
      desc: 'Rewrite routesAlias.ts to remove demo aliases',
      color: theme.info
    },
    {
      icon: icons.data,
      name: 'Mock data',
      desc: 'Demo JSON data, article list, comment data, etc.',
      color: theme.success
    },
    {
      icon: icons.globe,
      name: 'I18n files',
      desc: 'Clean demo menu items from Chinese/English language packs',
      color: theme.warning
    },
    {
      icon: icons.map,
      name: 'Map component',
      desc: 'Remove art-map-chart component',
      color: theme.error
    },
    {
      icon: icons.chat,
      name: 'Comment component',
      desc: 'Remove comment-widget component',
      color: theme.orange
    },
    {
      icon: icons.bolt,
      name: 'Fast entry',
      desc: 'Remove analysis page, confetti effect, chat, change log, pricing, message management, etc.',
      color: theme.purple
    }
  ]

  console.log(`  ${fmt.badge('', theme.bgRed)} ${fmt.title('Items to be cleaned')}`)
  console.log()

  cleanupItems.forEach((item, index) => {
    console.log(`     ${item.color}${theme.reset} ${fmt.highlight(`${index + 1}. ${item.name}`)}`)
    console.log(`        ${fmt.dim(item.desc)}`)
  })

  console.log()
  console.log(`  ${fmt.badge('', theme.bgGreen)} ${fmt.title('Modules to keep')}`)
  console.log()

  const preservedModules = [
    { name: 'Dashboard', desc: 'Workbench page' },
    { name: 'System', desc: 'System management module' },
    { name: 'Result', desc: 'Result pages' },
    { name: 'Exception', desc: 'Exception pages' },
    { name: 'Auth', desc: 'Login/Register features' },
    { name: 'Core Components', desc: 'Core components library' }
  ]

  preservedModules.forEach((module) => {
    console.log(`     ${icons.check} ${fmt.success(module.name)} ${fmt.dim(`- ${module.desc}`)}`)
  })

  console.log()
  createDivider()
  console.log()
}

// Show statistics
async function showStats() {
  const duration = Date.now() - stats.startTime
  const seconds = (duration / 1000).toFixed(2)

  console.log()
  createCard('Cleanup stats', [
    `${fmt.success('Deleted successfully')}: ${fmt.highlight(stats.deletedFiles.toString())} files`,
    `${fmt.info('Affected paths')}: ${fmt.highlight(stats.deletedPaths.toString())} directories/files`,
    ...(stats.failedPaths > 0
      ? [
          `${icons.error} ${fmt.error('Delete failed')}: ${fmt.highlight(stats.failedPaths.toString())} paths`
        ]
      : []),
    `${fmt.info('Elapsed time')}: ${fmt.highlight(seconds)} s`
  ])
}

// Create success banner
function createSuccessBanner() {
  console.log()
  console.log(
    fmt.gradient('  ╔══════════════════════════════════════════════════════════════════╗')
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    `  ║                  ${icons.star} ${fmt.success('Cleanup completed! Project is ready')} ${icons.rocket}                  ║`
  )
  console.log(
    `  ║                    ${fmt.dim('You can start your development now!')}                  ║`
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    fmt.gradient('  ╚══════════════════════════════════════════════════════════════════╝')
  )
  console.log()
}

// Main function
async function main() {
  // Clear screen and show banner
  console.clear()
  createModernBanner()

  // Show cleanup warning
  await showCleanupWarning()

  // Count files
  console.log(`  ${fmt.info('Counting files...')}`)
  stats.totalFiles = await countAllFiles()

  console.log(
    `  ${fmt.info('About to clean')}: ${fmt.highlight(stats.totalFiles.toString())} files`
  )
  console.log(`  ${fmt.dim(`involving ${targets.length} directories/files`)}`)
  console.log()

  // User confirmation
  const confirmed = await getUserConfirmation()

  if (!confirmed) {
    console.log(`  ${fmt.warning('Operation cancelled, cleanup aborted')}`)
    console.log()
    return
  }

  console.log()
  console.log(`  ${icons.check} ${fmt.success('Confirmed, starting cleanup...')}`)
  console.log()

  // Start cleanup process
  console.log(`  ${fmt.badge('Step 1/6', theme.bgBlue)} ${fmt.title('Delete demo files')}`)
  console.log()
  for (let i = 0; i < targets.length; i++) {
    await remove(targets[i], i)
  }
  console.log()

  console.log(
    `  ${fmt.badge('Step 2/6', theme.bgBlue)} ${fmt.title('Rewrite route configuration')}`
  )
  console.log()
  await cleanAsyncRoutes()
  console.log()

  console.log(`  ${fmt.badge('Step 3/6', theme.bgBlue)} ${fmt.title('Rewrite route aliases')}`)
  console.log()
  await cleanRoutesAlias()
  console.log()

  console.log(`  ${fmt.badge('Step 4/6', theme.bgBlue)} ${fmt.title('Clear change log')}`)
  console.log()
  await cleanChangeLog()
  console.log()

  console.log(`  ${fmt.badge('Step 5/6', theme.bgBlue)} ${fmt.title('Clean language files')}`)
  console.log()
  await cleanLanguageFiles()
  console.log()

  console.log(`  ${fmt.badge('Step 6/6', theme.bgBlue)} ${fmt.title('Clean fast entry')}`)
  console.log()
  await cleanFastEnterComponent()

  // Show statistics
  await showStats()

  // Show success banner
  createSuccessBanner()
}

main().catch((err) => {
  console.log()
  console.log(`  ${icons.error} ${fmt.error('Cleanup script encountered an error')}`)
  console.log(`  ${fmt.dim('Error details: ' + err)}`)
  console.log()
  process.exit(1)
})
