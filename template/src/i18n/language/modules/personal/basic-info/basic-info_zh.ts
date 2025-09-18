/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:56:58
 */

interface BasicInfo {
  headPortrait: string
  nickname: string
  phoneError: string
  emailError: string
  AccountError: string
}

const basicInfo: BasicInfo = {
  headPortrait: '头像',
  nickname: '姓名',
  phoneError: '请输入正确的手机号',
  emailError: '请输入正确的邮箱',
  AccountError: '请输入帐号',
}

export default basicInfo
