/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: qibiao
 * @LastEditTime: 2023-02-28 10:32:25
 */

interface OperationTranslations {
  operation: string
  nickName: string
  browser: string
  operationObject: string
  operationTime: string
  requestMethod: string
  requestUrl: string
  methodName: string
  requestParameters: string
  responseParameters: string
  operator: string
}

const translations: OperationTranslations = {
  operation: '操作',
  nickName: '昵称',
  browser: '浏览器',
  operationObject: '操作对象',
  operationTime: '操作时间',
  requestMethod: '请求方法',
  requestUrl: '请求URL',
  methodName: '方法名',
  requestParameters: '请求参数',
  responseParameters: '响应参数',
  operator: '操作者',
}

export default translations
