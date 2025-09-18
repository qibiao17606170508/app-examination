/*
 * @Description: 企业角色
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:29:04
 */
import service from '@/utils/request'

interface Params {
  [key: string]: any
}

/**
 * @description: 超级管理员获取当前企业下的所有角色 否则 获取当前管理员创建的角色
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function pageApi(params: Params) {
  return service({
    url: '/admin/role/lists',
    method: 'get',
    params,
  })
}

/**
 * @description: 信息
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function infoApi(params: Params) {
  return service({
    url: `/admin/role/info`,
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
export function addApi(data: Params) {
  return service({
    url: '/admin/role/save',
    method: 'post',
    data,
  })
}

/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function editApi(data: Params) {
  return service({
    url: 'admin/role/save',
    method: 'post',
    data,
  })
}

/**
 * @description: 删除
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function deleteApi(params: Params) {
  return service({
    url: `/admin/role/del`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 获取管理员创建的角色 超级管理员获取企业下所有的角色
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function selectListApi(params: Params) {
  return service({
    url: '/admin/role/lists',
    method: 'get',
    params: params,
  })
}
