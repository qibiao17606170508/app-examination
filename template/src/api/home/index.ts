/*
 * @Description: 首页数据
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 16:35:47
 */
import service from '@/utils/request'

interface OrderListParams {
  // 根据实际参数定义
  [key: string]: any;
}

/**
 * @description: 获取订单列表
 * @return {Promise<any>}
 * @author: qibiao
 */
export function getOrderList(params: OrderListParams): Promise<any> {
  return service({
    url: '/MatchQc/listQcOrder',
    method: 'get',
    params,
  })
}
