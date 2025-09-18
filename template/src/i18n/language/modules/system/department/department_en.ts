/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:02:43
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
  pleaseSelectStatus: 'Please Select Status',
  name: 'Name',
  personInCharge: 'Person In Charge',
  phone: 'Phone',
  sort: 'Sort',
  state: 'State',
  remarks: 'Remarks',
  creationTime: 'Creation Time',
  updateTime: 'Update Time',
  operation: 'Operation',
  superiorDepartment: 'Superior Department',
  remark: 'Remark',
  authority: 'Please Select Custom Data Permission',
  nameError: 'Please Enter A Name',
  deleteWarning: 'Are you sure you want to delete this item?',
  confirmTheOperation: 'Are You Sure To Do This?',
}

export default departmentTranslations
