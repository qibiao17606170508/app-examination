/*
 * @Description:
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2021-04-02 18:59:43
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:06:22
 */
import router from '@/router'

interface ITab {
  value: string
  label_cn: string
  label_en: string
  name: string
  path: string
  query: Record<string, any>
  params: Record<string, any>
  closable: boolean
  menuId: string
}

interface RouteMeta {
  id: string
  tab: boolean
  multiple: boolean
  title_cn: string
  title_en: string
  keepalive: boolean
}

interface Route {
  name: string
  path: string
  query: Record<string, any>
  params: Record<string, any>
  meta: RouteMeta
}

const defaultTabs: ITab[] = [
  {
    value: 'home-home-{}-{}',
    label_cn: '首页',
    label_en: 'Home',
    name: 'home',
    path: '/home',
    query: {}, // 路由参数
    params: {}, // 路由参数
    closable: false, // true：可以关闭
    menuId: 'home',
  },
]

export default {
  state: {
    active: '',
    tabs: [] as ITab[],
  },
  getters: {},
  mutations: {
    SET_ACTIVE: (state: { active: string }, active: string) => {
      state.active = active
    },
    SET_TABS: (state: { tabs: ITab[] }, tabs: ITab[]) => {
      state.tabs = tabs
    },
    ADD_TABS: (state: { tabs: ITab[] }, tab: ITab) => {
      state.tabs.push(tab)
    },
  },
  actions: {
    /**
     * 设置当前选中
     * @param {*} param0
     * @param {*} active
     * @returns
     */
    setActive({ commit }: { commit: Function }, active: string) {
      commit('SET_ACTIVE', active)
    },
    /**
     * 路由变化事件 设置当前选中、添加标签
     * @param {*} param0
     * @param {*} route
     */
    changeHandle(
      {
        commit,
        state,
      }: { commit: Function; state: { tabs: ITab[]; active: string } },
      route: Route
    ) {
      const meta = route.meta
      let val = `${route.name}-${meta.id}`
      if (meta.tab) {
        if (meta.multiple) {
          const queryStr = JSON.stringify(route.query)
          const paramsStr = JSON.stringify(route.params)
          val += `-${queryStr}-${paramsStr}`
        } else {
          val += `-{}-{}`
        }
        if (state.tabs.every((item) => item.value !== val)) {
          const tab: ITab = {
            value: val,
            menuId: meta.id,
            label_cn: meta.title_cn,
            label_en: meta.title_en,
            name: route.name,
            path: route.path,
            query: route.query,
            params: route.params,
            closable: true,
          }
          commit('ADD_TABS', tab)
        }
        if (state.tabs.some((item) => item.value === val)) {
          const tab = state.tabs.find((item) => item.value === val)
          if (tab) {
            if (JSON.stringify(tab.query) !== JSON.stringify(route.query)) {
              tab.query = route.query
            }
            if (JSON.stringify(tab.params) !== JSON.stringify(route.params)) {
              tab.params = route.params
            }
          }
        }
      }
      commit('SET_ACTIVE', val)
    },
    /**
     * 删除tabs
     * @param {*} param0
     * @param {*} values
     */
    removeHandle(
      {
        commit,
        state,
      }: { commit: Function; state: { tabs: ITab[]; active: string } },
      values: string[]
    ) {
      let tabs = state.tabs.filter((item) => {
        return values.indexOf(item.value) === -1
      })
      if (tabs.length === 0) {
        tabs = [state.tabs[0]]
      }
      if (tabs.every((item) => item.value !== state.active)) {
        const tab = tabs[tabs.length - 1]
        router.push({
          name: tab.name,
          query: tab.query,
          params: tab.params,
        })
      }
      commit('SET_TABS', JSON.parse(JSON.stringify(tabs)))
    },
    /**
     * 清除标签页
     * @param {*}
     */
    clear({ commit }: { commit: Function }) {
      commit('SET_ACTIVE', '')
      commit('SET_TABS', [])
    },
  },
}
