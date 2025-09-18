/*
 * @Description: 登录
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-13 15:06:30
 */
import service from '@/utils/request'
import i18n from '@/i18n'
import { LANG_EN, LANG_ZH } from '@/utils/constant'
var lang = localStorage.getItem('lang') || i18n.global.locale.value
import router from '@/router'

/**
 * @description: 登录
 * @param {*} params
 * @return {*}
 * @author: qibiao
 */
export function loginApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/login/login',
    method: 'post',
    data: params,
  })
}

/**
 * @description: 退出
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function logoutApi(): { data: string } {
  sessionStorage.clear()
  router.replace({
    name: 'login',
    params: { lang: lang == 'en' ? LANG_EN : LANG_ZH },
  })
  setTimeout(() => {
    location.reload()
  }, 500)
  return { data: 'success' }
}
/**
 * @description: 获取验证码
 * @return {*}
 * @author: qibiao
 */
export function captchaApi(): Promise<any> {
  return service({
    url: 'common/login/captcha',
    method: 'get',
    // responseType: 'blob',
  })
}
/**
 * @description: 注册 common/register/register
 * @return {*}
 * @author: Jack Qi
 */
export function registerApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/register/register',
    method: 'post',
    data: params,
  })
}
/**
 * @description: 获取学校 common/common/getSchool
 * @return {*}
 * @author: Jack Qi
 */
export function getSchoolApi(): Promise<any> {
  return service({
    url: 'common/common/getSchool',
    method: 'post',
  })
}
/**
 * @description: 获取学科 common/common/getSubject
 * @return {*}
 * @author: Jack Qi
 */
export function getSubjectApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/common/getSubject',
    method: 'post',
    data: params,
  })
}
/**
 * @description: 获取班级 common/common/getClass
 * @return {*}
 * @author: Jack Qi
 */
export function getClassApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/common/getClass',
    method: 'post',
    data: params,
  })
}
/**
 * @description: 忘记密码 common/register/forgotPassword
 * @return {*}
 * @author: Jack Qi
 */
export function forgotPasswordApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/register/forgotPassword',
    method: 'post',
    data: params,
  })
}
/**
 * @description: 获取手机验证码 common/register/sendCode
 * @return {*}
 * @author: Jack Qi
 */
export function sendCodeApi(params: Record<string, any>): Promise<any> {
  return service({
    url: 'common/register/sendCode',
    method: 'post',
    data: params,
  })
}
