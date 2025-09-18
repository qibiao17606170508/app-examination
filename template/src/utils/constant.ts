/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 17:33:03
 */
import {
  ContentType,
  TokenKey,
  StorageType,
  SuccessCode,
  RequestMapping,
  ModelBinding,
} from '@/utils/dictionary'

// 项目名称
export const PROJECT_NAME_EN: string = '智启AI'
export const PROJECT_NAME_CN: string = '智启AI'

// 登录类型
export const LOGIN_TYPE: string = 'CMS'
export const MAPPING: string = ''

// 七牛云地址
export const QINIU_IMAGE_SERVER: string = 'https://upload.tradeaider.com/'
export const IMAGE_SERVER: string = 'https://upload.tradeaider.com/'
export const QINIU_TOKEN: string =
  'https://api.tradeaider.com/mddcommon/qiniu/token'

// 请求数据类型
export const CONTENT_TYPE: typeof ContentType.JSON = ContentType.JSON

// 请求超时时长
export const TIME_OUT: number = 60000 * 30

// 访问秘钥 存储
export const TOKEN_KEY: typeof TokenKey.TOKEN = TokenKey.TOKEN

// 访问身份 存储
export const CLIENT: typeof TokenKey.CLIENT = TokenKey.CLIENT
export const APP: typeof TokenKey.APP = TokenKey.APP

// 秘钥本地存储类型
export const TOKEN_STORAGE: typeof StorageType.LOCAL = StorageType.LOCAL

// 菜单本地存储类型
export const MENU_STORAGE: typeof StorageType.SESSION = StorageType.SESSION
export const USER_INFO_STORAGE: typeof StorageType.SESSION = StorageType.SESSION
export const USER_INFO: string = 'userInfo'
export const IS_GET_MENU_KEY: string = 'isGet'
export const MENU_KEY: string = 'menus'
export const PERMISSION_KEY: string = 'permissions'
// 城市本地存储类型
export const CITY_STORAGE: typeof StorageType.LOCAL = StorageType.LOCAL
export const GLOBALCITY_KEY: string = 'GlobalCity'
export const CHINACITY_KEY: string = 'ChinaCity'

// 主题本地存储类型
export const THEME_STORAGE: typeof StorageType.LOCAL = StorageType.LOCAL
export const THEME_KEY: string = 'theme'
export const THEME_MODE_KEY: string = 'themeMode'
export const LAYOUT_KEY: string = 'layout'

// 请求成功响应code
export const SUCCESS_CODE: Array<
  typeof SuccessCode.ZERO | typeof SuccessCode.TWO_HUNDRED
> = [SuccessCode.ZERO, SuccessCode.TWO_HUNDRED]

// 双向绑定方法名
export const MODEL_NAME: string = 'modelValue'
export const UPDATE_MODEL_EVENT: typeof ModelBinding.MODEL_VALUE =
  ModelBinding.MODEL_VALUE

// 中英文切换字段
export const LANG_ZH: string = 'zh-CN'
export const LANG_EN: string = 'en-US'
