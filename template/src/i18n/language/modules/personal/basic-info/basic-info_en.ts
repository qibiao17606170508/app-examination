/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:56:45
 */

interface BasicInfo {
  headPortrait: string
  nickname: string
  phoneError: string
  emailError: string
  AccountError: string
}

const basicInfo: BasicInfo = {
  headPortrait: 'Profile Photo',
  nickname: 'Nickname',
  phoneError: 'Please Enter The Correct Mobile Number',
  emailError: 'Please Enter The Correct Mailbox',
  AccountError: 'Please Enter The Account Number',
}

export default basicInfo
