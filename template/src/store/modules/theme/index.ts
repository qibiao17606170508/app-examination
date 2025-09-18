/*
 * @Description:
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2021-04-02 18:59:43
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 15:41:17
 */
import { Module } from 'vuex'
import { lighten, darken } from '@/utils'
import {
  getTheme,
  setTheme,
  clearTheme,
  getThemeMode,
  setThemeMode,
  clearThemeMode,
} from '@/utils/storage'
import { ThemeMode } from '@/utils/dictionary' // 假设 ThemeMode 是一个常量对象

interface Theme {
  color: {
    primary: string
    success: string
    warning: string
    danger: string
    error: string
    info: string
  }
  text: {
    primary: string
    regular: string
    secondary: string
    placeholder: string
    disabled: string
  }
  menu: {
    backgroundColor: string
    textColor: string
    activeTextColor: string
  }
}

interface State {
  reload: boolean
  mode: (typeof ThemeMode)[keyof typeof ThemeMode] // 使用 typeof 和 keyof 获取 ThemeMode 的值类型
  theme: Theme
}

const defaultTheme: Theme = {
  color: {
    primary: '',
    success: '',
    warning: '',
    danger: '',
    error: '',
    info: '',
  },
  text: {
    primary: '',
    regular: '',
    secondary: '',
    placeholder: '',
    disabled: '',
  },
  menu: {
    backgroundColor: '',
    textColor: '',
    activeTextColor: '',
  },
}

const setThemeHandle = (theme: Theme): void => {
  const el = document.documentElement
  for (const key in theme.color) {
    if (theme.color.hasOwnProperty(key)) {
      el.style.setProperty(
        `--el-color-${key}`,
        theme.color[key as keyof Theme['color']]
      )
      for (let i = 1; i <= 9; i++) {
        el.style.setProperty(
          `--el-color-${key}-light-${i}`,
          lighten(theme.color[key as keyof Theme['color']], i / 10)
        )
        el.style.setProperty(
          `--el-color-${key}-dark-${i}`,
          darken(theme.color[key as keyof Theme['color']], i / 10)
        )
      }
    }
  }
  if (theme.menu.backgroundColor !== '#fff') {
    el.style.setProperty(
      `--gl-sidebar-background-color`,
      theme.menu.backgroundColor
    )
  }
}

const themeModule: Module<State, any> = {
  state: {
    reload: false,
    mode: ThemeMode.LIGHT, // 使用 ThemeMode 的值
    theme: defaultTheme,
  },
  getters: {},
  mutations: {
    SET_RELOAD(state: State, reload: boolean) {
      state.reload = reload
    },
    SET_THEME(state: State, theme: Theme) {
      state.theme = theme
    },
    SET_MODE(state: State, mode: (typeof ThemeMode)[keyof typeof ThemeMode]) {
      state.mode = mode
    },
  },
  actions: {
    setReload({ commit }, reload: boolean) {
      commit('SET_RELOAD', reload)
    },
    getTheme({ commit, dispatch }) {
      const theme = getTheme()
      const result: Theme = {
        color: { ...defaultTheme.color },
        text: { ...defaultTheme.text },
        menu: { ...defaultTheme.menu },
      }
      if (theme) {
        Object.assign(result, theme)
        setThemeHandle(result)
      } else {
        const el = document.querySelector(':root')
        if (el) {
          for (const key in defaultTheme.color) {
            result.color[key as keyof Theme['color']] = getComputedStyle(
              el
            ).getPropertyValue(`--el-color-${key}`)
          }
          result.menu.backgroundColor = getComputedStyle(el).getPropertyValue(
            `--gl-sidebar-background-color`
          )
        }
      }
      commit('SET_THEME', result)
      dispatch('setMode', getThemeMode() || ThemeMode.LIGHT)
    },
    setTheme({ commit, state }, theme: Theme) {
      commit('SET_THEME', theme)
      setTheme(state.theme)
      setThemeHandle(state.theme)
    },
    setMode({ commit }, mode: (typeof ThemeMode)[keyof typeof ThemeMode]) {
      mode === ThemeMode.DARK
        ? document.documentElement.classList.add(ThemeMode.DARK)
        : document.documentElement.classList.remove(ThemeMode.DARK)
      commit('SET_MODE', mode)
      setThemeMode(mode)
    },
    clear({ commit }) {
      clearThemeMode()
      clearTheme()
    },
  },
}

export default themeModule
