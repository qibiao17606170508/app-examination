/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:01:10
 */

interface LanguageModule {
  submit: string;
  operationSucceeded: string;
  phone: string;
  gender: string;
  man: string;
  woman: string;
  unknown: string;
  keywords: string;
  search: string;
  reset: string;
  add: string;
  edit: string;
  view: string;
  delete: string;
  noData: string;
  confirm: string;
  cancel: string;
  pleaseSelect: string;
  pleaseInput: string;
  operation: string;
  serial: string;
  putAway: string;
  open: string;
  selectUpload: string;
  export: string;
  tips: string;
}

const languageModule: LanguageModule = {
  submit: '保存',
  operationSucceeded: '操作成功!',
  phone: '手机号',
  gender: '性别',
  man: '男',
  woman: '女',
  unknown: '未知',
  keywords: '请输入关键字',
  search: '搜索',
  reset: '重置',
  add: '新增',
  edit: '编辑',
  view: '查看',
  delete: '删除',
  noData: '暂无数据',
  confirm: '确定',
  cancel: '取消',
  pleaseSelect: '请选择',
  pleaseInput: '请输入',
  operation: '操作',
  serial: '序号',
  putAway: '收起',
  open: '展开',
  selectUpload: '选择上传',
  export: '导出',
  tips: '提示',
}

export default languageModule
