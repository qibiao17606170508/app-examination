/*
 * @Description: 数据字典
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:19:03
 */
import service from '@/utils/request'

interface Params {
  // 根据实际参数定义类型
  [key: string]: any
}

/**
 * @description: 列表
 * @param {Params} params - 请求参数
 * @return {Promise<any>} - 返回一个Promise对象
 */
export function subSelectListApi(params: Params): Promise<any> {
  return service({
    url: `admin/menu/getMenuCate`,
    method: 'get',
    params, // 添加请求参数
  })
}
