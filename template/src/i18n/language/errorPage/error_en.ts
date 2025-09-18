/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:53:06
 */

interface ErrorMessages {
  error401Title: string;
  error401Desc: string;
  returnToTheFirstPage: string;
  return: string;
  homePage: string;
  signInAgain: string;
  error404Title: string;
  error500Title: string;
  contact: string;
  account: string;
  password: string;
  signIn: string;
  usernameError: string;
  passwordError: string;
}

const errorMessages: ErrorMessages = {
  error401Title: 'I M Sorry You Do Not Have Permission To Access This Page',
  error401Desc: 'If You Are Dissatisfied Please Contact Your Leader',
  returnToTheFirstPage: 'Automatically Return To The Home Page',
  return: 'Return',
  homePage: 'Home Page',
  signInAgain: 'Sign In Again',
  error404Title: 'I M Sorry The Page You Visited Is Lost',
  error500Title: 'I M Sorry The Page You Visited Has An Exception',
  contact: 'Please Contact The Administrator',
  account: 'Account',
  password: 'Password',
  signIn: 'Sign In',
  usernameError: 'Please Enter An Account',
  passwordError: 'Please Input A Password',
}

export default errorMessages
