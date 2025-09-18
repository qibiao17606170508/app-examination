/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:03:18
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
  chineseName: 'Chinese Name',
  englishName: 'English Name',
  icon: 'Icon',
  type: 'Type',
  sort: 'Sort',
  updateTime: 'Update Time',
  operation: 'Operation',
  superiorDepartment: 'Superior Department',
  name: 'Name',
  personInCharge: 'Person In Charge',
  phone: 'Cell Phone Number',
  state: 'State',
  remark: 'Remarks',
  chineseNameError: 'Please Enter A Chinese Name',
  englishNameError: 'Please Enter English Name',
  selectIcon: 'Please Select Icon',
}

export default menuTranslations
