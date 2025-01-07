import type { StronglyTypedRouteRecordRaw } from 'src/utils/route-utils'
import { PageNameBuiltins } from 'src/utils/route-utils'

// Add your page names here. Formatting:
// - Capitalize first letter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PageNames = [...PageNameBuiltins, 'Home', 'Token', 'Empty'] as const

export type RouteName = (typeof PageNames)[number] | '' | '/'
export type RoutePath = Lowercase<RouteName> | '' | '/'
export type RouteTo = `/${RoutePath}`

const routes: StronglyTypedRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Empty', redirect: 'home' },
      {
        path: 'home',
        name: 'Home',
        component: () => import('src/pages/HomePage.vue'),
      },
      {
        path: 'token',
        name: 'Token',
        component: () => import('src/pages/TokenPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
