/*
 * @Description: 管理员
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-14 17:32:22
 */
import service from '@/utils/request'
import { download } from '@/utils'

interface Params {
  [key: string]: any
}

/**
 * @description: 获取当前管理员
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function selfInfoApi() {
  return service({
    url:
      sessionStorage.getItem('type') === 'student'
        ? 'student/user/getInfo'
        : sessionStorage.getItem('type') === 'teacher'
        ? 'teacher/user/getInfo'
        : 'web/user/getInfo',
    method: 'post',
  })
}

/**
 * @description: 编辑基础信息
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function editBasicApi(params: Params) {
  return service({
    url: `admin/admin/save`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 编辑密码
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function editPasswordApi(params: Params) {
  return service({
    url: `admin/admin/updatePassword`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 获取系统用户
 * @return {*}
 * @author: qibiao
 */
export function getSystemUserApi(params: Params) {
  return service({
    url: '/admin/admin/adminLists',
    method: 'get',
    params: params,
  })
}

/**
 * @description: 获取用户详情
 * @return {*}
 * @author: qibiao
 */
export function getUserInfoApi(params: Params) {
  return service({
    url: `/admin/admin/info`,
    method: 'get',
    params,
  })
}

/**
 * @description: 新增
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function addApi(params: Params) {
  return service({
    url: `/admin/admin/save`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function editApi(params: Params) {
  return service({
    url: `/admin/admin/save`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 删除用户
 * @return {*}
 * @author: qibiao
 */
export function deleteUserApi(params: Params) {
  return service({
    url: `/admin/admin/del`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 设置是否启用
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function setStatusApi(params: { key: string }) {
  return service({
    url: `/admin/admin/change`,
    method: 'post',
    data: params,
  })
}
