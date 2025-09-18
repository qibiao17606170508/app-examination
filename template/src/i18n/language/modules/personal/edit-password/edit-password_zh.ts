/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:57:39
 */

interface PasswordMessages {
  originalPassword: string
  newPassword: string
  confirmPassword: string
  originalPasswordError: string
  newPasswordError: string
  confirmPasswordError: string
}

const passwordMessages: PasswordMessages = {
  originalPassword: '原密码',
  newPassword: '新密码',
  confirmPassword: '确认密码',
  originalPasswordError: '请输入原密码',
  newPasswordError: '请输入新密码',
  confirmPasswordError: '新密码与确认密码不一致',
}

export default passwordMessages
