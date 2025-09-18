/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 15:00:10
 */
import {
  getGet,
  setGet,
  clearGet,
  getMenuAndPermission,
  setMenuAndPermission,
  clearMenuAndPermission,
} from '@/utils/storage'
import { MENU_KEY, PERMISSION_KEY } from '@/utils/constant'
import { selfInfoApi } from '@/api/enterprise-menu'
import administrator from '../administrator'
// 初始化菜单 权限 数据
const data = getMenuAndPermission()
/**
 * @description: 递归筛选出 目录、菜单
 * @param {Array} list
 * @param {Number} mode 1-显示的 2-所有的
 * @return {*}
 * @author: qibiao
 */
function menuProcessing(list: Array<any> = [], mode: number = 1): Array<any> {
  const result: Array<any> = []
  list.forEach((item: any) => {
    if (item.type !== 2) {
      if (mode === 2 || item.is_show === 1) {
        const menu = {
          id: item.id,
          nameCn: item.title,
          icon: item.icon,
          type: item.type,
          url: item.url,
          path:
            item.type === 3
              ? `/i-${item.id}`
              : item.path ||
                (item.url ? `/${item.url.replace(/\//g, '-')}` : ''),
          name:
            item.type === 3
              ? `i-${item.id}`
              : item.name || (item.url ? item.url.replace(/\//g, '-') : ''),
          children: [] as Array<any>,
          status: item.status,
        }
        if (item.children && item.children.length > 0) {
          menu.children = menuProcessing(item.children, mode)
        }
        result.push(menu)
      }
    }
  })
  return result
}

interface State {
  get: boolean
  menus: Array<any>
  permissions: Array<any>
  active: string
  collapse: boolean
  administrator: any
}

export default {
  state: {
    get: false,
    menus: [] as Array<any>,
    permissions: [] as Array<any>,
    active: '',
    collapse: false,
    administrator: {},
  } as State,
  getters: {
    menus: (state: State): Array<any> => {
      return menuProcessing(state.menus)
    },
    pages: (state: State): Array<any> => {
      return menuProcessing(state.menus, 2)
    },
    permissions: (state: State): Array<any> => {
      return state.permissions
    },
  },
  mutations: {
    SET_ADMINISTRATOR: (state: State, administrator: any): void => {
      state.administrator = administrator
    },
    SET_GET: (state: State, get: boolean): void => {
      state.get = get
    },
    SET_MENUS: (state: State, menus: Array<any>): void => {
      state.menus = menus
    },
    SET_PERMISSIONS: (state: State, permissions: Array<any>): void => {
      state.permissions = permissions
    },
    SET_ACTIVE: (state: State, active: string): void => {
      state.active = active
    },
    SET_COLLAPSE: (state: State, collapse: boolean): void => {
      state.collapse = collapse
    },
  },
  actions: {
    /**
     * 设置是否获取过 菜单 权限
     * @param {*}
     * @returns
     */
    setGet({ commit }: { commit: Function }, val: boolean = true): void {
      setGet(val)
      commit('SET_GET', val)
    },
    /**
     * 获取当前管理员 菜单 权限
     * @param {*}
     * @returns
     */
    async getMenuAndPermission({
      state,
      commit,
      dispatch,
    }: {
      state: State
      commit: Function
      dispatch: Function
    }): Promise<any> {
      const { data } = await selfInfoApi()
      var result = data
      if (result) {
        result.menus = result.menuList
        result.permissions = result.buttons
        dispatch('setGet', true)
        setMenuAndPermission(result)
        commit('SET_MENUS', result.menus)
        commit('SET_ADMINISTRATOR', result)
        commit('SET_PERMISSIONS', result.permissions)
      }
      return result
    },
    /**
     * 设置选中菜单
     * @param {*}
     * @returns
     */
    setActive({ commit }: { commit: Function }, active: string): void {
      commit('SET_ACTIVE', active)
    },
    /**
     * 设置菜单是否折叠
     * @param {*}
     * @returns
     */
    setCollapse({ commit }: { commit: Function }, collapse: boolean): void {
      commit('SET_COLLAPSE', collapse)
    },
    /**
     * 清除菜单 权限 信息
     * @param {*}
     */
    clear({ commit }: { commit: Function }): void {
      clearGet()
      clearMenuAndPermission()
      commit('SET_GET', false)
      commit('SET_MENUS', [])
      commit('SET_PERMISSIONS', [])
    },
  },
}
