/**
 * Fast entry configuration
 * Includes: application list and quick links
 */
import { RoutesAlias } from '@/router/routesAlias'
import { WEB_LINKS } from '@/utils/constants'
import type { FastEnterConfig } from '@/types/config'

const fastEnterConfig: FastEnterConfig = {
  // Display condition (screen width)
  minWidth: 1200,
  // Applications list
  applications: [
    {
      name: 'Workplace',
      description: 'System overview and stats',
      icon: '&#xe721;',
      iconColor: '#377dff',
      path: RoutesAlias.Dashboard,
      enabled: true,
      order: 1
    },
    {
      name: 'Analysis',
      description: 'Data analysis and visualization',
      icon: '&#xe812;',
      iconColor: '#ff3b30',
      path: RoutesAlias.Analysis,
      enabled: true,
      order: 2
    },
    {
      name: 'Fireworks',
      description: 'Animation effect showcase',
      icon: '&#xe7ed;',
      iconColor: '#7A7FFF',
      path: RoutesAlias.Fireworks,
      enabled: true,
      order: 3
    },
    {
      name: 'Chat',
      description: 'Instant messaging',
      icon: '&#xe70a;',
      iconColor: '#13DEB9',
      path: RoutesAlias.Chat,
      enabled: true,
      order: 4
    },
    {
      name: 'Docs',
      description: 'User guide and developer docs',
      icon: '&#xe788;',
      iconColor: '#ffb100',
      path: WEB_LINKS.DOCS,
      enabled: true,
      order: 5
    },
    {
      name: 'Support',
      description: 'Tech support and feedback',
      icon: '&#xe86e;',
      iconColor: '#ff6b6b',
      path: WEB_LINKS.COMMUNITY,
      enabled: true,
      order: 6
    },
    {
      name: 'Changelog',
      description: 'Version updates and changes',
      icon: '&#xe81c;',
      iconColor: '#38C0FC',
      path: RoutesAlias.ChangeLog,
      enabled: true,
      order: 7
    },
    {
      name: 'Bilibili',
      description: 'Tech sharing and discussion',
      icon: '&#xe6b4;',
      iconColor: '#FB7299',
      path: WEB_LINKS.BILIBILI,
      enabled: true,
      order: 8
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
      name: 'Forgot password',
      path: RoutesAlias.ForgetPassword,
      enabled: true,
      order: 3
    },
    {
      name: 'Pricing',
      path: RoutesAlias.Pricing,
      enabled: true,
      order: 4
    },
    {
      name: 'User center',
      path: RoutesAlias.UserCenter,
      enabled: true,
      order: 5
    },
    {
      name: 'Comment management',
      path: RoutesAlias.Comment,
      enabled: true,
      order: 6
    }
  ]
}

export default Object.freeze(fastEnterConfig)
