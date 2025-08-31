import { AppRouteRecordRaw } from '../utils/utils'
import { RoutesAlias } from '../routesAlias'

/**
 * Static route configuration
 * Routes accessible without permissions
 *
 * Notes:
 * 1. Avoid conflicts between path/name and dynamic routes
 * 2. For public routes, set meta.noLogin = true
 */
export const staticRoutes: AppRouteRecordRaw[] = [
  // Example: route accessible without login
  // {
  //   path: '/welcome',
  //   name: 'WelcomeStatic',
  //   component: () => import('@views/dashboard/console/index.vue'),
  //   meta: { title: 'menus.dashboard.title', noLogin: true }
  // },
  {
    path: RoutesAlias.Login,
    name: 'Login',
    component: () => import('@views/auth/login/index.vue'),
    meta: { title: 'menus.login.title', isHideTab: true, setTheme: true }
  },
  {
    path: RoutesAlias.Register,
    name: 'Register',
    component: () => import('@views/auth/register/index.vue'),
    meta: { title: 'menus.register.title', isHideTab: true, noLogin: true, setTheme: true }
  },
  {
    path: RoutesAlias.ForgetPassword,
    name: 'ForgetPassword',
    component: () => import('@views/auth/forget-password/index.vue'),
    meta: { title: 'menus.forgetPassword.title', isHideTab: true, noLogin: true, setTheme: true }
  },
  {
    path: '/403',
    name: 'Exception403',
    component: () => import('@views/exception/403/index.vue'),
    meta: { title: '403', noLogin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Exception404',
    component: () => import('@views/exception/404/index.vue'),
    meta: { title: '404' }
  },
  {
    path: '/500',
    name: 'Exception500',
    component: () => import('@views/exception/500/index.vue'),
    meta: { title: '500', noLogin: true }
  },
  {
    path: '/outside',
    component: () => import('@views/index/index.vue'),
    name: 'Outside',
    meta: { title: 'menus.outside.title' },
    children: [
      {
        path: '/outside/iframe/:path',
        name: 'Iframe',
        component: () => import('@/views/outside/Iframe.vue'),
        meta: { title: 'iframe' }
      }
    ]
  }
]
