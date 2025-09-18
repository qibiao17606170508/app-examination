/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-22 15:49:09
 */

interface FormConfigItem {
  searchType: string
  searchName: string
  label: string
  placeholder?: string
  selectOptions?: any
  picker?: string
  'start-placeholder'?: string
  'end-placeholder'?: string
}

export const listConfig = [
  {
    label: '试卷名称',
    name: 'name',
  },
  {
    label: '考试时间',
    name: 'time',
    sortable: 'custom',
  },
  {
    label: '状态',
    name: 'status',
    options: [
      {
        label: '未提交',
        value: 0,
        textType: 'red',
      },
      {
        label: '已提交',
        value: 1,
      },
    ],
  },
]

export const listConfig1 = [
  {
    label: '题目编号',
    name: 'number',
  },
  {
    label: '题目',
    name: 'title_content',
  },
]

export const formConfig: FormConfigItem[] = [
  {
    searchType: 'input',
    searchName: 'keywords',
    label: '搜索',
    placeholder: '用户/工厂/系统订单号',
  },
  {
    searchType: 'select',
    searchName: 'orderState',
    label: '订单状态',
    placeholder: '请选择订单状态',
  },
  {
    searchType: 'date',
    searchName: 'dateTime',
    picker: 'daterange',
    label: '服务日期',
    'start-placeholder': '服务开始日期',
    'end-placeholder': '服务结束日期',
  },
]
