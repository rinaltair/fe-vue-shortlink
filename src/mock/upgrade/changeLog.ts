interface UpgradeLog {
  version: string // Version number
  title: string // Update title
  date: string // Update date
  detail?: string[] // Update details
  requireReLogin?: boolean // Whether re-login is required
  remark?: string // Remarks
}

export const upgradeLogList = ref<UpgradeLog[]>([
  {
    version: 'v2.5.5',
    title: 'Bug fixes and UX improvements',
    date: '2025-08-17',
    detail: [],
    requireReLogin: true
  },
  {
    version: 'v2.3.6',
    title: 'Simplify config folder structure',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.5',
    title: 'Upgrade prettier, stylelint, lint-staged, cz-git',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.4',
    title: 'Adjust views directory structure',
    date: '2025-06-03',
    requireReLogin: true
  },
  {
    version: 'v2.3.3',
    title: 'Use Apifox Mock data for user list',
    date: '2025-06-03'
  },
  {
    version: 'v2.3.2',
    title: 'Settings center code refactor',
    date: '2025-05-30'
  },
  {
    version: 'v2.3.1',
    title: 'Fix theme style initialization bug in v2.3.0',
    date: '2025-05-30'
  },
  {
    version: 'v2.3.0',
    title: 'Local storage refactor',
    date: '2025-05-29',
    detail: [],
    requireReLogin: true
  },
  {
    version: 'v2.2.85',
    title: 'Add system logo component',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.84',
    title: 'Fix ring chart label style issue',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.83',
    title: 'Optimize Checkbox component styles',
    date: '2025-05-21'
  },
  {
    version: 'v2.2.82',
    title: 'Visual experience optimizations',
    date: '2025-05-18'
  },
  {
    version: 'v2.2.81',
    title: 'Fix top-level menu layout bug',
    date: '2025-05-18'
  },
  {
    version: 'v2.2.80',
    title: 'Add frontend role control mode',
    date: '2025-05-17',
    requireReLogin: true
  }
])
