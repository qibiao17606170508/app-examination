/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 11:56:37
 */
import {
  createRouter,
  createWebHashHistory,
  useRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
} from 'vue-router'
import { defineComponent, h, nextTick, computed } from 'vue'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { parseStr2Date } from '@/utils'
import { ElMessage } from 'element-plus'
import {
  LANG_EN,
  LANG_ZH,
  PROJECT_NAME_EN,
  PROJECT_NAME_CN,
} from '@/utils/constant'
import i18n from '../i18n'
let refresh = true
var lang = localStorage.getItem('lang') || i18n.global.locale.value
const routerTo = useRouter()
const constant: Array<RouteRecordRaw> = [
  // { path: '/', redirect: { name: 'login' }, meta: { title_cn: '重定向', title_en: 'Redirect' } },
  {
    path: '/:lang/',
    redirect: { name: 'login' },
    meta: { title_cn: '重定向', title_en: 'Redirect' },
  },
  {
    path: '/:lang/login',
    name: 'login',
    component: () => import('@/views/constant/login.vue'),
    meta: { title_cn: '登录', title_en: 'Login' },
  },
  {
    path: '/:lang/401',
    name: '401',
    component: () => import('@/views/constant/401.vue'),
    meta: { title_cn: '401', title_en: '401' },
  },
  {
    path: '/:lang/404',
    name: '404',
    component: () => import('@/views/constant/404.vue'),
    meta: { title_cn: '404', title_en: '404' },
  },
  {
    path: '/:lang/500',
    name: '500',
    component: () => import('@/views/constant/500.vue'),
    meta: { title_cn: '500', title_en: '500' },
  },
  {
    path: '/:lang/register',
    name: 'register',
    component: () => import('@/views/constant/register.vue'),
    meta: { title_cn: '注册', title_en: 'Register' },
  },
  {
    path: '/:lang/forgot',
    name: 'forgot',
    component: () => import('@/views/constant/forgot.vue'),
    meta: { title_cn: '忘记密码', title_en: 'Forgot Password' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/constant/404.vue'),
  },
]

const main: RouteRecordRaw = {
  path: '/:lang/layout',
  name: 'layout',
  component: () => import('@/views/layout/index.vue'),
  meta: {
    title_cn: '主入口整体布局',
    title_en: 'Overall layout of main entrance',
  },
  children: [
    // todo 动态路由未注册之前 直接 push 会报错 所以使用了个中间件
    {
      path: '/:lang/redirect',
      name: 'redirect',
      component: defineComponent({ render: () => h('div') }),
      meta: {},
    },
  ],
  async beforeEnter(to, _from, next) {
    const token: string = store.getters['administrator/tokenVal']
    if (!token || !/\S/u.test(token)) {
      // eslint-disable-next-line no-use-before-define
      clearRouter()
      store.dispatch('logout')
      next({ name: 'login', replace: true })
    } else {
      if (to.name != 'redirect' && to.name != 'login') {
        // 菜单权限
        await store.dispatch('menu/getMenuAndPermission')
      }
      if (to.name === 'redirect') {
        const exists =
          main.children?.filter((item) => item.name !== 'redirect') || []
        const name = exists.length ? exists[0].name : '404'
        store.dispatch('menu/setActive', name)
        next({ name, replace: true })
      } else {
        next()
      }
    }
  },
}

const routes: Array<RouteRecordRaw> = constant.concat(main)

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL || '/'),
  routes,
})

/**
 * @description: 判断当前路由类型, constant: 常量路由, main: 主入口路由
 * @param {RouteLocationNormalized} route
 * @param {Array} constantRoutes
 * @return {*}
 * @author: qibiao
 */
function currentRouteType(
  route: RouteLocationNormalized,
  constantRoutes: Array<RouteRecordRaw> = []
): string {
  let temp: Array<RouteRecordRaw> = [] // 明确声明类型
  for (let i = 0; i < constantRoutes.length; i++) {
    const children = constantRoutes[i].children
    if (
      route.name === constantRoutes[i].name &&
      typeof route.name !== 'undefined'
    ) {
      return 'constant'
    } else if (
      children &&
      children.length >= 1 &&
      typeof route.name !== 'undefined'
    ) {
      temp = temp.concat(children)
    }
  }
  return temp.length >= 1 ? currentRouteType(route, temp) : 'main'
}

/**
 * @description: 动态添加路由
 * @param {Array} menus
 * @param {Array} routeList
 * @return {*}
 * @author: qibiao
 */
function addRoutes(
  menus: Array<any> = [],
  routeList: Array<RouteRecordRaw> = []
): void {
  let list: Array<any> = [] // 明确声明类型
  menus.forEach((item, _index) => {
    if (item.children && item.children.length > 0) {
      list = list.concat(item.children)
    }
    let route: RouteRecordRaw | undefined
    switch (item.type) {
      case 3:
        route = {
          path: `/:lang/i-${item.id}`,
          name: `i-${item.id}`,
          component: () => import(`@/views/modules/iframe/index.vue`),
          meta: {
            id: item.id,
            title_cn: item.title,
            title_en: item.title,
            type: item.type,
            url: item.url,
            dynamic: true,
            tab: item.tab === 1,
            keepalive: item.keepalive === 1,
            multiple: item.multiple === 1,
            status: item.status,
          },
        }
        break
      case 0:
        break
      case 4:
        break
      default:
        if (item.url && /\S/u.test(item.url)) {
          route = {
            path: '/:lang' + item.path || `/${item.url.replace(/\//g, '-')}`,
            name: item.name || item.url.replace(/\//g, '-'),
            component: () => import(`@/views/modules/${item.url}.vue`) || null,
            meta: {
              id: item.id,
              title_cn: item.title,
              title_en: item.title,
              type: item.type,
              url: item.url,
              dynamic: true,
              tab: item.tab === 1,
              keepalive: item.keepalive === 1,
              multiple: item.multiple === 1,
              status: item.status,
            },
          }
        }
        break
    }
    if (route) {
      routeList.push(route)
    }
  })
  if (list.length >= 1) {
    addRoutes(list, routeList)
  } else {
    main.children = (main.children || []).concat(routeList) // 确保 main.children 不为 undefined
    router.addRoute(main)
  }
}

/**
 * @description: 清除动态添加的路由
 * @param {Array} menus
 * @param {Array} routeList
 * @return {*}
 * @author: qibiao
 */
function clearRouter(): void {
  const routers = router.getRoutes().filter((item) => item.meta.isDynamic)
  routers.forEach((item) => {
    if (item.name) {
      router.removeRoute(item.name)
    }
  })
  if (main.children) {
    main.children = main.children.filter(
      (item) => item.meta && !item.meta.dynamic
    )
  }
}

router.beforeEach(async (to, _from, next) => {
  // if (to.meta.permissionStatus == 0) {
  //   next(_from.path)
  //   return ElMessage.error('您没有权限访问')
  // }
  // if (to.meta.keepalive === false) {
  //   // const tabs = computed(() => store.state.tabs.tabs)
  //   // const tab = tabs.value.find((item) => item.name === to.name)
  //   // if (tab) {
  //   //   store.dispatch('tabs/removeHandle', [tab.value])
  //   // }
  // }
  // setTimeout(async () => {
  // 标题控制
  if (to.meta.title_cn || to.meta.title_en) {
    document.title =
      (lang == 'en'
        ? PROJECT_NAME_EN + '—' + to.meta.title_en
        : PROJECT_NAME_CN + '—' + to.meta.title_cn) || document.title
  }
  // 跳转到登录页如果 token 还未过期则调整到系统内部
  if (to.name === 'login') {
    const { expired_at }: { expired_at: string } =
      store.state.administrator.token
    const now = +new Date()
    const expired = expired_at ? +parseStr2Date(expired_at) : 0
    if (expired > now) {
      next({
        name: 'redirect',
        replace: true,
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
    }
  }
  NProgress.start()
  if (to.path === '/' && typeof to.name == 'undefined') {
    next({
      name: 'login',
      replace: true,
      params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
    })
    return
  }
  // 处理动态路由页 刷新跳转 401 问题
  if (refresh) {
    // 添加 401 重定向
    router.addRoute({
      path: '/:pathMatch(.*)',
      redirect: { name: '401' },
    })
  }
  // todo: 动态添加路由
  const isCommon = currentRouteType(to, constant) === 'constant'
  const toFlag = to.path.includes('zh') || to.path.includes('en')
  if (isCommon) {
    if (toFlag) {
      next()
    } else {
      next({ params: { lang: lang == 'en' ? LANG_EN : LANG_ZH } })
    }
  } else {
    const isGet = store.state['menu'].get
    if (isGet) {
      if (!refresh) {
        if (toFlag) {
          next()
        } else {
          next({ params: { lang: lang == 'en' ? LANG_EN : LANG_ZH } })
        }
        return
      }
    } else {
      const menus = await store.dispatch('menu/getMenuAndPermission')
      if (!menus) {
        if (toFlag) {
          next()
        } else {
          next({ params: { lang: lang == 'en' ? LANG_EN : LANG_ZH } })
        }
        return
      }
    }
    refresh = false
    const menus = store.state.menu.menus
    if (!menus || menus.length === 0) {
      store.dispatch('menu/setGet', false)
      next({
        name: '404',
        replace: true,
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
    } else {
      addRoutes(menus)
      next({ ...to, replace: true })
    }
  }
  // if (to.path.includes(LANG_ZH)) {
  //   i18n.locale = 'zh'
  //   to.params.lang = i18n.locale
  // } else if (to.path.includes(LANG_EN)) {
  //   i18n.locale = 'en'
  //   to.params.lang = i18n.locale
  // }
  // }, 100)
})

router.afterEach((_to, _from) => {
  NProgress.done()
})

// 添加异常处理
const originalPush = router.push
router.push = (to: any) => {
  try {
    return originalPush(to)
  } catch (error) {
    return originalPush({
      name: '404',
      params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
    })
  }
}

export default router
