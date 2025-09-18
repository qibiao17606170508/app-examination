/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:57:26
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
  originalPassword: 'Original Password',
  newPassword: 'New Password',
  confirmPassword: 'Confirm Password',
  originalPasswordError: 'Please Enter The Original Password',
  newPasswordError: 'Please Enter A New Password',
  confirmPasswordError:
    'The New Password Is Inconsistent With The Confirmed Password',
}

export default passwordMessages
