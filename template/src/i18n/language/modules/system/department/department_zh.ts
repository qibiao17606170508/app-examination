/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:02:57
 */

interface DepartmentTranslations {
  pleaseSelectStatus: string
  name: string
  personInCharge: string
  phone: string
  sort: string
  state: string
  remarks: string
  creationTime: string
  updateTime: string
  operation: string
  superiorDepartment: string
  remark: string
  authority: string
  nameError: string
  deleteWarning: string
  confirmTheOperation: string
}

const departmentTranslations: DepartmentTranslations = {
  pleaseSelectStatus: '请选择状态',
  name: '名称',
  personInCharge: '负责人',
  phone: '手机号',
  sort: '排序',
  state: '状态',
  remarks: '备注',
  creationTime: '创建时间',
  updateTime: '更新时间',
  operation: '操作',
  superiorDepartment: '上级部门',
  remark: '备注',
  authority: '请选择自定义数据权限',
  nameError: '请输入名称',
  deleteWarning: '确定删除该项吗？',
  confirmTheOperation: '确定该操作？',
}

export default departmentTranslations
