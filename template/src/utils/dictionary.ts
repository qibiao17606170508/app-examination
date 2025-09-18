/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-14 17:17:36
 */

// 请求头-内容类型
export const ContentType: { [key: string]: string } = {
  JSON: 'application/json;charset=UTF-8',
  FORM: 'application/x-www-form-urlencoded;charset=UTF-8',
  UPLOAD: 'multipart/form-data',
  STREAM: 'application/octet-stream;charset=UTF-8',
}

// 令牌键值
export enum TokenKey {
  TOKEN = 'Authorization',
  Authorization = 'Authorization',
  ACCESS = 'access',
  CLIENT = 'WEB',
  APP = 'DEFAULT',
}

// 本地存储类型
export enum StorageType {
  COOKIE = 'COOKIE',
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
}

// 请求成功状态码
export enum SuccessCode {
  ZERO = 0,
  TWO_HUNDRED = 200,
}

// 请求 mapping
export enum RequestMapping {
  SLIPPER = '/slipper',
  API = '/api',
}

// 双向绑定名
export enum ModelBinding {
  MODEL_VALUE = 'update:modelValue',
  MODEL_EVENT = 'update:modelEvent',
}

// 主题模式
export enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
}
