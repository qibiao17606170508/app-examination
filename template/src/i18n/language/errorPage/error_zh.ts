/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:53:32
 */

interface ErrorMessages {
  error401Title: string
  error401Desc: string
  returnToTheFirstPage: string
  return: string
  homePage: string
  signInAgain: string
  error404Title: string
  error500Title: string
  contact: string
  account: string
  password: string
  signIn: string
  usernameError: string
  passwordError: string
}

const errorMessages: ErrorMessages = {
  error401Title: '抱歉！您没有权限访问该页面...',
  error401Desc: '如有不满请联系您的领导',
  returnToTheFirstPage: '秒后自动返回首页',
  return: '返回',
  homePage: '首页',
  signInAgain: '重新登录',
  error404Title: '抱歉！您访问的页面走丢啦...',
  error500Title: '抱歉！您访问的页面出现异常...',
  contact: '请联系管理员',
  account: '账户',
  password: '密码',
  signIn: '登录',
  usernameError: '请输入账户',
  passwordError: '请输入密码',
}

export default errorMessages
