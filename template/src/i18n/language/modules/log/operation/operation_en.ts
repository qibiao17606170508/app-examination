/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:55:49
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
  operation: 'Operation',
  nickName: 'Nickname',
  browser: 'Browser',
  operationObject: 'Operation Object',
  operationTime: 'Operation Time',
  requestMethod: 'Request Method',
  requestUrl: 'Request Url',
  methodName: 'Method Name',
  requestParameters: 'Request Parameters',
  responseParameters: 'Response Parameters',
  operator: 'Operator',
}

export default translations
