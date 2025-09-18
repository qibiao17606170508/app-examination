'use strict'
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
import {
  CONTENT_TYPE,
  SUCCESS_CODE,
  TIME_OUT,
  TOKEN_KEY,
  LANG_EN,
  LANG_ZH,
  CLIENT,
  APP,
  LOGIN_TYPE,
} from '@/utils/constant'
import { ContentType } from '@/utils/dictionary'
import { getApiBaseUrl } from '@/utils'
import Prompt from '@/utils/prompt'
import i18n from '../i18n'
import { ElLoading } from 'element-plus'
import type { LoadingOptionsResolved } from 'element-plus/lib/components/loading/src/types'

var lang = localStorage.getItem('lang') || i18n.global.locale.value
var loading: ReturnType<typeof ElLoading.service> | null = null

// 定义类型
type PromptMessage = {
  message: string
  type: 'warning' | 'success' | 'info' | 'error'
  duration: number
}

type ApiResponse = {
  statusCode?: number
  msg?: string
  msgEN?: string
  data?: any
  headers: {
    [key: string]: string
  }
}

/**
 * @description: 异常消息提示
 * @param {string} string
 * @return {*}
 * @author: qibiao
 */
const prompt = (message: string): void => {
  new Prompt().warning({
    message: message,
    type: 'warning',
    duration: 3000,
  } as PromptMessage)
}

/**
 * @description: code处理
 * @param {number} code
 * @param {string} msg
 * @return {*}
 * @author: qibiao
 */
const codeHandle = (code: number, message: string): void => {
  switch (code) {
    case -3:
      prompt(
        lang == 'en'
          ? 'Login Timeout Please Login Again!'
          : '登录超时，请重新登录！'
      )
      router.replace({
        name: 'login',
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
      break
    case 4001:
      prompt(message)
      store.dispatch('logout')
      router.replace({
        name: 'login',
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
      break
    case 401:
      store.dispatch('logout')
      router.replace({
        name: 'login',
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
      break
    case 404:
      router.replace({
        name: '404',
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
      break
    case 500:
      prompt(message)
      // router.replace({
      //   name: '500'
      // })
      break
    default:
      prompt(message)
      break
  }
  if (loading) {
    loading.close()
  }
}

// 设置获取 baseURL
const baseURL = getApiBaseUrl()

/**
 * @description: axios创建
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
const service = axios.create({
  baseURL,
  withCredentials: false,
  timeout: TIME_OUT,
  headers: {
    'Content-Type': CONTENT_TYPE,
  },
})

/**
 * @description: axios请求拦截器
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
service.interceptors.request.use(
  (config: any) => {
    if (!config.unloading) {
      loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    // 判断config.url是否包含login
    const tokenVal = store.getters['administrator/tokenVal']
    if (!config.url.includes('account-do/login')) {
      if (tokenVal) {
        config.headers[TOKEN_KEY] = 'Bearer ' + tokenVal
      }
    }

    if (config.data) {
      if (config.headers['Content-Type'] === ContentType.FORM) {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

/**
 * @description: axios响应拦截器
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
service.interceptors.response.use(
  (response: ApiResponse) => {
    if (response.headers['content-type'] === ContentType.STREAM) {
      if (!response.data.statusCode) {
        return {
          blob: response.data,
          name: decodeURI(
            response.headers['content-disposition'].replace(
              'attachment;filename=',
              ''
            )
          ),
        }
      } else {
        return response.data || null
      }
    }
    const { code, msg, msgEN } = response.data
    if (msg == 'token过期') {
      router.replace({
        name: 'login',
        params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
      })
      prompt(
        lang == 'en'
          ? 'Login Timeout Please Login Again!'
          : '登录超时，请重新登录！'
      )
      return null
    }
    if (code && !SUCCESS_CODE.includes(code)) {
      codeHandle(code, lang == 'en' ? msgEN : msg)
      return null
    }

    if (loading) {
      loading.close()
    }
    return response.data || null
  },
  (error: any) => {
    if (error && error.response) {
      switch (error.response.statusCode) {
        case 400:
          break
        case 401:
          router.replace({
            name: 'login',
            params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
          })
          break
        case 403:
          break
        case 404:
          break
        case 405:
          break
        case 408:
          break
        case 411:
          break
        case 413:
          break
        case 414:
          break
        case 415:
          break
        case 500:
          break
        case 501:
          break
        case 502:
          break
        case 503:
          break
        case 504:
          break
        case 505:
          break
        default:
      }
    } else {
      // router.replace({
      //   name: '500',
      //   params: { lang: lang == 'en' ? LANG_EN : LANG_ZH }
      // })
    }
    if (loading) {
      loading.close()
    }
    return Promise.reject(error)
  }
)

export default service
