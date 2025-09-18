/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:58:10
 */

interface PersonalInfo {
  basic: string
  changePassword: string
  recentLoginLog: string
  recentOperationLog: string
  female: string
  male: string
  unknown: string
}

const personalInfo: PersonalInfo = {
  basic: 'Essential Information',
  changePassword: 'Change Password',
  recentLoginLog: 'Recent Login Log',
  recentOperationLog: 'Recent Operation Log',
  female: 'Female',
  male: 'Male',
  unknown: 'Unknown',
}

export default personalInfo
