/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:01:46
 */

interface AdministratorTranslations {
  searchName: string
  pleaseSelectDept: string
  avatar: string
  userName: string
  name: string
  email: string
  number: string
  remark: string
  loginDate: string
  loginIp: string
  telphone: string
  department: string
  role: string
  useStatus: string
  createTime: string
  ifDelete: string
  tip: string
  password: string
  passwordSecond: string
  empType: string
  empTypeOption: string[]
  userRole: string
  open: string
  userNameErr: string
  psdNotSame: string
  phoneErr: string
  emailErr: string
  nameErr: string
  pleaseSelectEmpType: string
  accontsErr: string
  psdErr: string
  psd2Err: string
  pleaseSelectRole: string
  ifOperate: string
}

const administratorTranslations: AdministratorTranslations = {
  searchName: 'User name/Name',
  pleaseSelectDept: 'Please select department',
  avatar: 'Profile picture',
  userName: 'User name',
  name: 'Name',
  email: 'Email',
  number: 'Number',
  remark: 'Remarks',
  loginDate: 'Last login',
  loginIp: 'Last login IP',
  telphone: 'Telphone',
  department: 'Department',
  role: 'Role',
  useStatus: 'Is use',
  createTime: 'CreateTime',
  ifDelete: 'Are you sure to delete?',
  tip: 'tip',
  password: 'Password',
  passwordSecond: 'Re-enter password',
  empType: 'Employee type',
  empTypeOption: ['Salesperson', 'Customer service', 'Driver', 'System'],
  userRole: 'User Role',
  open: 'open(Not required)',
  userNameErr: 'Incorrect Username Format',
  psdNotSame: 'The new password is inconsistent with the confirmed password',
  phoneErr: 'Please enter the correct mobile number',
  emailErr: 'Please enter the correct mailbox',
  nameErr: 'Please enter a name',
  pleaseSelectEmpType: 'Please select employee type',
  accontsErr: 'Please enter the account',
  psdErr: 'Please input a password',
  psd2Err: 'Please enter the confirmation password',
  pleaseSelectRole: 'Please select a role',
  ifOperate: 'Do you want to operate on this item',
}
