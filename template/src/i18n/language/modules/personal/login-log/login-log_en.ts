/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: qibiao
 * @LastEditTime: 2023-02-27 18:01:05
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
  accountNumber: 'Account Number',
  loginInformation: 'Login Information',
  browser: 'Browser',
  operatingSystem: 'Operating System',
  operationInformation: 'Operation Information',
  operationTime: 'Operation Time',
}

export default loginLog
