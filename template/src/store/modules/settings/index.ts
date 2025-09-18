/*
 * @Description:
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2021-04-02 18:59:43
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-10 10:42:53
 */
import { getLayout, setLayout, clearLayout } from '@/utils/storage'

/**
 * 存储layout处理
 * @param {*} state
 */
const setLayoutHandle = (state: {
  sidebarMode: number
  navigationMode: number
  contanierMode: number
  panelMode: number
  showTabs: boolean
}) => {
  setLayout({
    sidebarMode: state.sidebarMode,
    navigationMode: state.navigationMode,
    contanierMode: state.contanierMode,
    panelMode: state.panelMode,
    showTabs: state.showTabs,
  })
}

export default {
  state: {
    /**
     * 侧边菜单栏模式
     * 1：传统模式
     * 2：分栏模式
     */
    sidebarMode: 1,
    /**
     * 导航模式
     * 1：固定导航
     * 2：不固定导航
     */
    navigationMode: 1,
    /**
     * 主内容容器布局
     * 1：大小随内容变化
     * 2：大小100%, 在容器组件默认插槽内滚动 // todo: 只有导航模式固定的情况下生效
     */
    contanierMode: 2,
    /**
     * 面板模式
     * 1: 头部 主要内容 脚部 左侧 分离
     * 2: 左右面板分离
     * 3: 整个容器为面板
     */
    panelMode: 1,
    /**
     * 是否显示标签页
     */
    showTabs: false,
    /**
     * 是否全屏
     */
    fullScreen: false,
    /**
     * 用于主内容部分刷新
     */
    refresh: false,
    /**
     * 语言切换
     */
    lang: localStorage.getItem('lang') || 'zh',
  },
  getters: {},
  mutations: {
    SET_SIDEBAR_MODE: (state: any, sidebarMode: number) => {
      state.sidebarMode = sidebarMode
    },

    SET_NAVIGATION_MODE: (state: any, navigationMode: number) => {
      state.navigationMode = navigationMode
    },
    SET_CONTANIER_MODE: (state: any, contanierMode: number) => {
      state.contanierMode = contanierMode
    },
    SET_PANEL_MODE: (state: any, panelMode: number) => {
      state.panelMode = panelMode
    },
    SET_SHOW_TABS: (state: any, show: boolean) => {
      state.showTabs = show
    },
    SET_FULL_SCREEN: (state: any, fullScreen: boolean) => {
      state.fullScreen = fullScreen
    },
    SET_REFRESH: (state: any, refresh: boolean) => {
      state.refresh = refresh
    },
    SET_LANG(state: any, lang: string) {
      state.lang = lang
    },
  },
  actions: {
    /**
     * 获取布局
     * @param {*} param0
     */
    getLayout({ commit }: { commit: Function }) {
      const layout = getLayout()
      if (layout) {
        const {
          sidebarMode,
          navigationMode,
          contanierMode,
          panelMode,
          showTabs,
        } = layout
        commit('SET_SIDEBAR_MODE', sidebarMode || 1)
        commit('SET_NAVIGATION_MODE', navigationMode || 1)
        commit('SET_CONTANIER_MODE', contanierMode || 2)
        commit('SET_PANEL_MODE', panelMode || 1)
        commit('SET_SHOW_TABS', showTabs !== undefined ? showTabs : false)
      }
    },
    /**
     * 设置导航模式
     * @returns
     */
    setSidebarMode(
      { commit, state }: { commit: Function; state: any },
      sidebarMode: number
    ) {
      commit('SET_SIDEBAR_MODE', sidebarMode)
      setLayoutHandle(state)
    },

    /**
     * 设置导航模式
     * @returns
     */
    setNavigationMode(
      { commit, state }: { commit: Function; state: any },
      navigationMode: number
    ) {
      commit('SET_NAVIGATION_MODE', navigationMode)
      setLayoutHandle(state)
    },
    /**
     * 设置主内容容器布局
     * @returns
     */
    setContanierMode(
      { commit, state }: { commit: Function; state: any },
      contanierMode: number
    ) {
      commit('SET_CONTANIER_MODE', contanierMode)
      setLayoutHandle(state)
    },
    /**
     * 设置面板模式
     * @returns
     */
    setPanelMode(
      { commit, state }: { commit: Function; state: any },
      panelMode: number
    ) {
      commit('SET_PANEL_MODE', panelMode)
      setLayoutHandle(state)
    },
    /**
     * 是否显示标签页
     * @returns
     */
    setShowTabs(
      { commit, state }: { commit: Function; state: any },
      show: boolean
    ) {
      commit('SET_SHOW_TABS', show)
      setLayoutHandle(state)
    },
    /**
     * 设置是否全屏
     * @returns
     */
    setFullScreen({ commit }: { commit: Function }, fullScreen: boolean) {
      commit('SET_FULL_SCREEN', fullScreen)
    },
    /**
     * 设置刷新
     * @returns
     */
    setRefresh({ commit }: { commit: Function }, refresh: boolean) {
      commit('SET_REFRESH', refresh)
    },
    /**
     * 清除布局模式
     * @param {*}
     */
    clear({ commit }: { commit: Function }) {
      clearLayout()
    },
    /**
     * 设置语言
     * @returns
     */
    setLang({ commit }: { commit: Function }, lang: string) {
      commit('SET_LANG', lang)
    },
  },
}
