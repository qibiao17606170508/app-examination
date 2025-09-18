/*
 * @Description: 菜单
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:25:56
 */
import service from '@/utils/request'

interface Params {
  key?: string
  [key: string]: any
}

/**
 * @description: 开发配置里获取所有菜单权限
 * @return {Promise<any>}
 */
export function selectListApi(): Promise<any> {
  return service({
    url: '/admin/menu/lists',
    method: 'get',
  })
}

/**
 * @description: 信息
 * @param {string} id
 * @return {Promise<any>}
 */
export function infoApi(params: Params): Promise<any> {
  return service({
    url: `/admin/menu/lists`,
    method: 'get',
    params,
  })
}

/**
 * @description: 新增
 * @param {Params} params
 * @return {Promise<any>}
 */
export function addApi(params: Params): Promise<any> {
  return service({
    url: `/admin/menu/save`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 编辑
 * @param {Params} params
 * @return {Promise<any>}
 */
export function editApi(params: Params): Promise<any> {
  return service({
    url: `/admin/menu/save`,
    method: 'post',
    data: params,
  })
}

/**
 * @description: 删除
 * @param {Params} params
 * @return {Promise<any>}
 */
export function deleteApi(params: Params): Promise<any> {
  let paramsObj = {
    id: params.key,
  }
  return service({
    url: `/admin/menu/del`,
    method: 'post',
    data: paramsObj,
  })
}

/**
 * @description: 拖动排序
 * @param {Params} params
 * @return {Promise<any>}
 */
export function dragApi(params: Params): Promise<any> {
  return service({
    url: `/admin/menu/setSort`,
    method: 'post',
    data: params,
  })
}
