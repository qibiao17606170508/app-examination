/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:04:01
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
  roleName: 'Role name',
  remark: 'remark',
  createTime: 'createTime',
  authority: 'authority',
  tip: 'tip',
  ifDelete: 'Are you sure to delete?',
}

export default roleTranslations
