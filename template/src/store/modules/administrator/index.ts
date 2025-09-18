/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 14:59:51
 */

import { clearJson } from '@/utils/index'
import {
  clearToken,
  getToken,
  setToken,
  setMenuAndPermission,
  setChinaCityMode,
  setGlobalCityMode,
  getChinaCityMode,
  getGlobalCityMode,
  setUserInfo,
} from '@/utils/storage'
import { loginApi, logoutApi } from '@/api/login'
import { selfInfoApi } from '@/api/administrator'
import { CHINACITY_KEY, GLOBALCITY_KEY } from '@/utils/constant'
import menu from '../menu'
export default {
  state: {
    administrator: {} as Record<string, any>,
    token: getToken() as string | null,
    chinaCity: getChinaCityMode() as string | null,
    globalCity: getGlobalCityMode() as string | null,
  },
  getters: {
    tokenVal: (state: { token: string | null }) => {
      return state.token
    },
  },
  mutations: {
    SET_ADMINISTRATOR: (
      state: { administrator: Record<string, any> },
      administrator: Record<string, any>
    ) => {
      state.administrator = administrator
    },
    SET_TOKEN: (state: { token: string | null }, token: string) => {
      state.token = token
    },
    SET_CHINACITY: (state: { chinaCity: string | null }, chinaCity: string) => {
      state.chinaCity = chinaCity
    },
    SET_GLOBALCITY: (
      state: { globalCity: string | null },
      globalCity: string
    ) => {
      state.globalCity = globalCity
    },
    CLEAR_ADMINISTRATOR: (state: { administrator: Record<string, any> }) => {
      clearJson(state.administrator)
    },
    CLEAR_TOKEN: (state: { token: string | null }) => {
      if (state.token) {
        clearJson({ token: state.token }) // 将 token 包装成对象传递
      }
    },
  },
  actions: {
    /**
     * 登录
     * @param {*} params
     * @returns
     */

    async login({ commit }: { commit: Function }, params: any) {
      const r = await loginApi(params)
      sessionStorage.setItem('type', params.type)
      await setToken(JSON.stringify(r.data.token))
      // await setMenuAndPermission()
      await commit('SET_TOKEN', r.data.token)
      return r
    },
    /**
     * 获取当前用户信息
     * @returns
     */
    // async getAdministrator({ commit }) {
    //   // const r = await selfInfoApi()
    //   // if (r) {
    //   // commit('SET_ADMINISTRATOR', menu.state.administrator)
    //   // }
    //   return menu.state.administrator
    // },
    /**
     * 退出当前账户
     * @returns
     */
    async logout() {
      const r = await logoutApi()
      return r
    },
    /**
     * 清除登录用户信息
     * @param {*} param0
     * @param {*} flag
     */
    clearAdministrator({ commit }: { commit: Function }) {
      commit('CLEAR_ADMINISTRATOR')
    },
    /**
     * 清除登录用户凭证
     * @param {*} param0
     * @param {*} flag
     */
    clearToken({ commit }: { commit: Function }) {
      commit('CLEAR_TOKEN')
      clearToken()
    },
  },
}
