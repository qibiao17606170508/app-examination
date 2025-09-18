/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:03:40
 */

interface MenuTranslations {
  chineseName: string
  englishName: string
  icon: string
  type: string
  sort: string
  updateTime: string
  operation: string
  superiorDepartment: string
  name: string
  personInCharge: string
  phone: string
  state: string
  remark: string
  chineseNameError: string
  englishNameError: string
  selectIcon: string
}

const menuTranslations: MenuTranslations = {
  chineseName: '中文名称',
  englishName: '英文名称',
  icon: '图标',
  type: '类型',
  sort: '排序',
  updateTime: '更新时间',
  operation: '操作',
  superiorDepartment: '上级部门',
  name: '名称',
  personInCharge: '负责人',
  phone: '手机号',
  state: '状态',
  remark: '备注',
  chineseNameError: '请输入中文名称',
  englishNameError: '请输入英文名称',
  selectIcon: '请选择图标',
}

export default menuTranslations
