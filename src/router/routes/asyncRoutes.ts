import { RoutesAlias } from '../routesAlias'
import { AppRouteRecord } from '@/types/router'
import { WEB_LINKS } from '@/utils/constants'

/**
 * Menu list (async routes)
 *
 * Supports two modes:
 * - Frontend static config: use the routes defined in this file
 * - Backend dynamic config: backend returns menu data, frontend parses and generates routes
 *
 * Menu title (meta.title):
 * - Can be an i18n key or a plain string, e.g., 'User List'
 *
 * Notes:
 * 1) RoutesAlias.Layout points to the layout container; backend menu component should point to /index/index
 * 2) Avoid conflicts with dynamic routes in path/name to prevent access issues
 */
export const asyncRoutes: AppRouteRecord[] = [
  // Example of a top-level home menu config:
  // {
  //   name: 'Home',
  //   path: '/home',
  //   component: RoutesAlias.Dashboard,
  //   meta: {
  //     title: 'menus.dashboard.console',
  //     icon: '&#xe733;',
  //     keepAlive: false
  //   }
  // },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      roles: ['R_SUPER', 'R_ADMIN'] // Role-based access (frontend control mode; only users with these roles can access)
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
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: RoutesAlias.Analysis,
        meta: {
          title: 'menus.dashboard.analysis',
          keepAlive: false
        }
      },
      {
        path: 'ecommerce',
        name: 'Ecommerce',
        component: RoutesAlias.Ecommerce,
        meta: {
          title: 'menus.dashboard.ecommerce',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/template',
    name: 'Template',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.template.title',
      icon: '&#xe860;'
    },
    children: [
      {
        path: 'cards',
        name: 'Cards',
        component: RoutesAlias.Cards,
        meta: {
          title: 'menus.template.cards',
          keepAlive: false
        }
      },
      {
        path: 'banners',
        name: 'Banners',
        component: RoutesAlias.Banners,
        meta: {
          title: 'menus.template.banners',
          keepAlive: false
        }
      },
      {
        path: 'charts',
        name: 'Charts',
        component: RoutesAlias.Charts,
        meta: {
          title: 'menus.template.charts',
          keepAlive: false
        }
      },
      {
        path: 'map',
        name: 'Map',
        component: RoutesAlias.Map,
        meta: {
          title: 'menus.template.map',
          keepAlive: true
        }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: RoutesAlias.Chat,
        meta: {
          title: 'menus.template.chat',
          keepAlive: true
        }
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: RoutesAlias.Calendar,
        meta: {
          title: 'menus.template.calendar',
          keepAlive: true
        }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: RoutesAlias.Pricing,
        meta: {
          title: 'menus.template.pricing',
          keepAlive: true,
          isFullPage: true // Show in full page
        }
      }
    ]
  },
  {
    path: '/widgets',
    name: 'Widgets',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.widgets.title',
      icon: '&#xe81a;'
    },
    children: [
      {
        path: 'icon-list',
        name: 'IconList',
        component: RoutesAlias.IconList,
        meta: {
          title: 'menus.widgets.iconList',
          keepAlive: true
        }
      },
      {
        path: 'icon-selector',
        name: 'IconSelector',
        component: RoutesAlias.IconSelector,
        meta: {
          title: 'menus.widgets.iconSelector',
          keepAlive: true
        }
      },
      {
        path: 'image-crop',
        name: 'ImageCrop',
        component: RoutesAlias.ImageCrop,
        meta: {
          title: 'menus.widgets.imageCrop',
          keepAlive: true
        }
      },
      {
        path: 'excel',
        name: 'Excel',
        component: RoutesAlias.Excel,
        meta: {
          title: 'menus.widgets.excel',
          keepAlive: true
        }
      },
      {
        path: 'video',
        name: 'Video',
        component: RoutesAlias.Video,
        meta: {
          title: 'menus.widgets.video',
          keepAlive: true
        }
      },
      {
        path: 'count-to',
        name: 'CountTo',
        component: RoutesAlias.CountTo,
        meta: {
          title: 'menus.widgets.countTo',
          keepAlive: false
        }
      },
      {
        path: 'wang-editor',
        name: 'WangEditor',
        component: RoutesAlias.WangEditor,
        meta: {
          title: 'menus.widgets.wangEditor',
          keepAlive: true
        }
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: RoutesAlias.Watermark,
        meta: {
          title: 'menus.widgets.watermark',
          keepAlive: true
        }
      },
      {
        path: 'context-menu',
        name: 'ContextMenu',
        component: RoutesAlias.ContextMenu,
        meta: {
          title: 'menus.widgets.contextMenu',
          keepAlive: true
        }
      },
      {
        path: 'qrcode',
        name: 'Qrcode',
        component: RoutesAlias.Qrcode,
        meta: {
          title: 'menus.widgets.qrcode',
          keepAlive: true
        }
      },
      {
        path: 'drag',
        name: 'Drag',
        component: RoutesAlias.Drag,
        meta: {
          title: 'menus.widgets.drag',
          keepAlive: true
        }
      },
      {
        path: 'text-scroll',
        name: 'TextScroll',
        component: RoutesAlias.TextScroll,
        meta: {
          title: 'menus.widgets.textScroll',
          keepAlive: true
        }
      },
      {
        path: 'fireworks',
        name: 'Fireworks',
        component: RoutesAlias.Fireworks,
        meta: {
          title: 'menus.widgets.fireworks',
          keepAlive: true,
          showTextBadge: 'Hot'
        }
      },
      {
        path: '/outside/iframe/elementui',
        name: 'ElementUI',
        component: '',
        meta: {
          title: 'menus.widgets.elementUI',
          keepAlive: false,
          link: 'https://element-plus.org/zh-CN/component/overview.html',
          isIframe: true,
          showBadge: true
        }
      }
    ]
  },
  {
    path: '/examples',
    name: 'Examples',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.examples.title',
      icon: '&#xe8d4;',
      showBadge: true
    },
    children: [
      {
        path: 'tabs',
        name: 'Tabs',
        component: RoutesAlias.ExamplesTabs,
        meta: {
          title: 'menus.examples.tabs'
        }
      },
      {
        path: 'tables/basic',
        name: 'TablesBasic',
        component: RoutesAlias.ExamplesTablesBasic,
        meta: {
          title: 'menus.examples.tablesBasic',
          keepAlive: true
        }
      },
      {
        path: 'tables',
        name: 'Tables',
        component: RoutesAlias.ExamplesTables,
        meta: {
          title: 'menus.examples.tables',
          keepAlive: true,
          showBadge: true
        }
      },
      {
        path: 'form/search-bar',
        name: 'SearchBar',
        component: RoutesAlias.ExamplesSearchBar,
        meta: {
          title: 'menus.examples.searchBar',
          keepAlive: true,
          showTextBadge: 'New'
        }
      },
      {
        path: 'tables/tree',
        name: 'TablesTree',
        component: RoutesAlias.ExamplesTablesTree,
        meta: {
          title: 'menus.examples.tablesTree',
          keepAlive: true
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
      },
      {
        path: 'nested',
        name: 'Nested',
        component: '',
        meta: {
          title: 'menus.system.nested',
          keepAlive: true
        },
        children: [
          {
            path: 'menu1',
            name: 'NestedMenu1',
            component: RoutesAlias.NestedMenu1,
            meta: {
              title: 'menus.system.menu1',
              icon: '&#xe676;',
              keepAlive: true
            }
          },
          {
            path: 'menu2',
            name: 'NestedMenu2',
            component: '',
            meta: {
              title: 'menus.system.menu2',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                path: 'menu2-1',
                name: 'NestedMenu2-1',
                component: RoutesAlias.NestedMenu21,
                meta: {
                  title: 'menus.system.menu21',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: 'menu3',
            name: 'NestedMenu3',
            component: '',
            meta: {
              title: 'menus.system.menu3',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                path: 'menu3-1',
                name: 'NestedMenu3-1',
                component: RoutesAlias.NestedMenu31,
                meta: {
                  title: 'menus.system.menu31',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              },
              {
                path: 'menu3-2',
                name: 'NestedMenu3-2',
                component: '',
                meta: {
                  title: 'menus.system.menu32',
                  icon: '&#xe676;',
                  keepAlive: true
                },
                children: [
                  {
                    path: 'menu3-2-1',
                    name: 'NestedMenu3-2-1',
                    component: RoutesAlias.NestedMenu321,
                    meta: {
                      title: 'menus.system.menu321',
                      icon: '&#xe676;',
                      keepAlive: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/article',
    name: 'Article',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.article.title',
      icon: '&#xe7ae;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: RoutesAlias.ArticleList,
        meta: {
          title: 'menus.article.articleList',
          keepAlive: true,
          authList: [
            {
              title: 'Add',
              authMark: 'add'
            },
            {
              title: 'Edit',
              authMark: 'edit'
            }
          ]
        }
      },

      {
        path: 'detail',
        name: 'ArticleDetail',
        component: RoutesAlias.ArticleDetail,
        meta: {
          title: 'menus.article.articleDetail',
          isHide: true,
          keepAlive: true,
          activePath: '/article/article-list' // Active menu path
        }
      },
      {
        path: 'comment',
        name: 'ArticleComment',
        component: RoutesAlias.Comment,
        meta: {
          title: 'menus.article.comment',
          keepAlive: true
        }
      },
      {
        path: 'publish',
        name: 'ArticlePublish',
        component: RoutesAlias.ArticlePublish,
        meta: {
          title: 'menus.article.articlePublish',
          keepAlive: true,
          authList: [{ title: 'Publish', authMark: 'article/article-publish/add' }]
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
          keepAlive: true,
          isFullPage: true
        }
      },
      {
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true,
          isFullPage: true
        }
      },
      {
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: 'menus.exception.serverError',
          keepAlive: true,
          isFullPage: true
        }
      }
    ]
  },

  {
    path: '/safeguard',
    name: 'Safeguard',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.safeguard.title',
      icon: '&#xe816;',
      keepAlive: false
    },
    children: [
      {
        path: 'server',
        name: 'SafeguardServer',
        component: RoutesAlias.Server,
        meta: {
          title: 'menus.safeguard.server',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Document',
    path: '',
    component: RoutesAlias.ChangeLog,
    meta: {
      title: 'menus.help.document',
      icon: '&#xe73e;',
      link: WEB_LINKS.DOCS,
      isIframe: false,
      keepAlive: false
    }
  },
  // Top-level menu
  {
    name: 'ChangeLog',
    path: '/change/log',
    component: RoutesAlias.ChangeLog,
    meta: {
      title: 'menus.plan.log',
      showTextBadge: `v${__APP_VERSION__}`,
      icon: '&#xe712;',
      keepAlive: false
    }
  }
]
