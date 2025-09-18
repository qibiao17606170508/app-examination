/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:04:16
 */

interface RoleTranslations {
  roleName: string
  remark: string
  createTime: string
  authority: string
  tip: string
  ifDelete: string
}

const roleTranslations: RoleTranslations = {
  roleName: '角色名称',
  remark: '备注',
  createTime: '创建时间',
  authority: '权限',
  tip: '提示',
  ifDelete: '是否确认删除?',
}

export default roleTranslations
