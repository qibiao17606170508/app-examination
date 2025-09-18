/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:00:17
 */

interface LoginLog {
  accountNumber: string
  loginInformation: string
  browser: string
  operatingSystem: string
  operationInformation: string
  operationTime: string
}

const loginLog: LoginLog = {
  accountNumber: '账号',
  loginInformation: '登录信息',
  browser: '浏览器',
  operatingSystem: '操作系统',
  operationInformation: '操作信息',
  operationTime: '操作时间',
}

export default loginLog
