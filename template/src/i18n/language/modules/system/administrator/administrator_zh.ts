/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:02:10
 */

interface AdministratorTranslations {
  searchName: string
  pleaseSelectDept: string
  avatar: string
  userName: string
  name: string
  email: string
  loginDate: string
  loginIp: string
  number: string
  remark: string
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
  searchName: '用户名/昵称',
  pleaseSelectDept: '请选择部门',
  avatar: '头像',
  userName: '用户名',
  name: '姓名',
  email: '邮箱',
  loginDate: '最近登录',
  loginIp: '上次登录IP',
  number: '编号',
  remark: '备注',
  telphone: '手机',
  department: '部门',
  role: '角色',
  useStatus: '是否启用',
  createTime: '创建时间',
  ifDelete: '确认删除？',
  tip: '提示',
  password: '密码',
  passwordSecond: '再次确认密码',
  empType: '员工类型',
  empTypeOption: ['销售', '客服', '司机', '系统'],
  userRole: '用户角色',
  open: '展开（非必填项）',
  userNameErr: '用户名格式不正确',
  psdNotSame: '新密码与确认密码不一致',
  phoneErr: '请输入正确的手机号',
  emailErr: '请输入正确的邮箱',
  nameErr: '请输入昵称',
  pleaseSelectEmpType: '请选择员工类型',
  accontsErr: '请输入帐号',
  psdErr: '请输入密码',
  psd2Err: '请输入确认密码',
  pleaseSelectRole: '请选择角色',
  ifOperate: '是否对此项进行操作',
}

export default administratorTranslations
