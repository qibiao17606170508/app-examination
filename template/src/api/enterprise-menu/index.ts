/*
 * @Description: 菜单
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-14 17:32:37
 */
import service from '@/utils/request'

interface Params {
  [key: string]: any
}

/**
 * @description: 获取当前管理员 菜单 权限
 * @return {Promise<any>}
 */
export function selfInfoApi(): Promise<any> {
  let params = {}
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
 * @description: 获取当前下所有菜单
 * @return {Promise<any>}
 */
export function listApi(params: Params): Promise<any> {
  return service({
    url: '/admin/menu/lists',
    method: 'get',
    params,
  })
}

/**
 * @description: 修改企业菜单
 * @param {Params} params
 * @return {Promise<any>}
 */
export function updateApi(params: Params): Promise<any> {
  return service({
    url: 'admin/menu/save',
    method: 'post',
    data: params,
  })
}

/**
 * @description: 获取管理员在该企业下的菜单权限 非树形 只包括名称 id
 * @return {Promise<any>}
 */
export function selectListApi(): Promise<any> {
  return service({
    url: '/admin/menu/lists',
    method: 'get',
  })
}
