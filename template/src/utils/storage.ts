/*
 * @Description: 凭证信息存取
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:38:48
 */
import cookie from 'js-cookie'
import {
  IS_GET_MENU_KEY,
  MENU_KEY,
  MENU_STORAGE,
  PERMISSION_KEY,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO,
  USER_INFO_STORAGE,
  THEME_KEY,
  THEME_MODE_KEY,
  THEME_STORAGE,
  LAYOUT_KEY,
  CHINACITY_KEY,
  CITY_STORAGE,
  GLOBALCITY_KEY,
} from '@/utils/constant'
import { StorageType } from '@/utils/dictionary'

/**
 * @description: 本地存储、获取、清除
 * @param {String} key 存储键值
 * @param {String} value 存储值
 * @param {String} storage 存储位置
 * @return {*}
 * @author: qibiao
 */
function set(key: string, value: string = '', storage: StorageType) {
  switch (storage) {
    case StorageType.COOKIE:
      // cookie.set(key, value)
      sessionStorage.setItem(key, value)
      break
    case StorageType.SESSION:
      sessionStorage.setItem(key, value)
      break
    case StorageType.LOCAL:
      localStorage.setItem(key, value)
      break
    default:
      // cookie.set(key, value)
      sessionStorage.setItem(key, value)
      break
  }
}
function get(key: string, storage: StorageType): string | null {
  let result: string | null
  switch (storage) {
    case StorageType.COOKIE:
      // result = cookie.get(key)
      result = sessionStorage.getItem(key)
      break
    case StorageType.SESSION:
      result = sessionStorage.getItem(key)
      break
    case StorageType.LOCAL:
      result = localStorage.getItem(key)
      break
    default:
      // result = cookie.get(key)
      result = localStorage.getItem(key)
      break
  }
  return result
}
function clear(key: string, storage: StorageType) {
  switch (storage) {
    case StorageType.COOKIE:
      // cookie.remove(key)
      sessionStorage.removeItem(key)
      break
    case StorageType.SESSION:
      sessionStorage.removeItem(key)
      break
    case StorageType.LOCAL:
      localStorage.removeItem(key)
      break
    default:
      // cookie.remove(key)
      localStorage.removeItem(key)
      break
  }
}

/**
 * @description: token-存储、获取、清除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getToken() {
  return JSON.parse(get(TOKEN_KEY, TOKEN_STORAGE) || '{}')
}
export function setToken(token: string) {
  set(TOKEN_KEY, token, TOKEN_STORAGE)
}
export function clearToken() {
  clear(TOKEN_KEY, TOKEN_STORAGE)
}
/**
 * @description: 用户信息存储
 * @return {*}
 * @author: qibiao
 */
export function getUserInfo() {
  const userInfo = get(USER_INFO, USER_INFO_STORAGE) || '{}'
  return JSON.parse(userInfo)
}
export function setUserInfo(userInfo: any) {
  set(USER_INFO, JSON.stringify(userInfo), USER_INFO_STORAGE)
}
export function clearUserInfo() {
  clear(USER_INFO, USER_INFO_STORAGE)
}
/**
 * @description: 菜单、权限-存储、获取、清除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getMenuAndPermission() {
  return {
    menus: JSON.parse(get(MENU_KEY, MENU_STORAGE) || '[]') || [],
    permissions: JSON.parse(get(PERMISSION_KEY, MENU_STORAGE) || '[]') || [],
  }
}
export function setMenuAndPermission(data: {
  menus: any[]
  permissions: any[]
}) {
  set(MENU_KEY, JSON.stringify(data.menus), MENU_STORAGE)
  set(PERMISSION_KEY, JSON.stringify(data.permissions), MENU_STORAGE)
}
export function clearMenuAndPermission() {
  clear(MENU_KEY, MENU_STORAGE)
  clear(PERMISSION_KEY, MENU_STORAGE)
}
export function getGet() {
  return get(IS_GET_MENU_KEY, MENU_STORAGE) === 'true'
}
export function setGet(val = true) {
  set(IS_GET_MENU_KEY, val.toString(), MENU_STORAGE) // 将布尔值转换为字符串
}
export function clearGet() {
  clear(IS_GET_MENU_KEY, MENU_STORAGE)
}

/**
 * @description: 主题颜色-存储、获取、清除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getTheme() {
  const theme = get(THEME_KEY, THEME_STORAGE)
  return theme ? JSON.parse(theme) : null
}
export function setTheme(theme: any) {
  set(THEME_KEY, JSON.stringify(theme), THEME_STORAGE)
}
export function clearTheme() {
  clear(THEME_KEY, THEME_STORAGE)
}

/**
 * @description: 主题模式-存储、获取、清除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getThemeMode() {
  const mode = get(THEME_MODE_KEY, THEME_STORAGE)
  return mode || null
}
export function setThemeMode(mode: string) {
  set(THEME_MODE_KEY, mode, THEME_STORAGE)
}
export function clearThemeMode() {
  clear(THEME_MODE_KEY, THEME_STORAGE)
}
/**
 * @description: 国内国外省市区获取
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getChinaCityMode() {
  const chinaCity = get(CHINACITY_KEY, CITY_STORAGE)
  return chinaCity || []
}
export function getGlobalCityMode() {
  const globalCity = get(GLOBALCITY_KEY, CITY_STORAGE)
  return globalCity || []
}
export function setChinaCityMode(mode: string) {
  set(CHINACITY_KEY, mode, CITY_STORAGE)
}
export function setGlobalCityMode(mode: string) {
  set(GLOBALCITY_KEY, mode, CITY_STORAGE)
}
export function clearCityMode() {
  clear(CHINACITY_KEY, CITY_STORAGE)
  clear(GLOBALCITY_KEY, CITY_STORAGE)
}
/**
 * @description: 布局-存储、获取、清除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function getLayout() {
  const layout = get(LAYOUT_KEY, THEME_STORAGE)
  return layout ? JSON.parse(layout) : null
}
export function setLayout(layout: any) {
  set(LAYOUT_KEY, JSON.stringify(layout), THEME_STORAGE)
}
export function clearLayout() {
  clear(LAYOUT_KEY, THEME_STORAGE)
}
