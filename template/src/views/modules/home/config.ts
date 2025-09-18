/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-10 17:02:53
 */

interface ListConfigItem {
  label: string
  label_en: string
  name: string
  width?: string | number
  options?: any
  type?: string
}

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

export const listConfig: ListConfigItem[] = [
  {
    label: '系统订单号',
    label_en: 'System Order Number',
    name: 'orderSn',
    width: '140',
  },
  {
    label: '用户',
    label_en: 'User',
    name: 'companyName',
    width: '230',
  },
  {
    label: '产品分类',
    label_en: 'Product Classification',
    name: 'industryName',
    width: '140',
  },
  {
    label: '工厂',
    label_en: 'Factory',
    name: 'factoryName',
    width: '240',
  },
  {
    label: '服务日期',
    label_en: 'Service Date',
    name: 'bookTime',
    width: '120',
  },
  {
    label: '联系人',
    label_en: 'Contacts',
    name: 'factoryContacts',
    width: '80',
  },
  {
    label: '总人天数',
    label_en: 'Total Person Days',
    name: 'manDay',
    width: '120',
  },
  {
    label: '总价格',
    label_en: 'Total Price',
    name: 'totalAmount',
    width: '160',
  },
  {
    label: '支付状态',
    label_en: 'Payment Status',
    name: 'payState',
    width: '120',
  },
  {
    label: '订单状态',
    label_en: 'Order Status',
    name: 'orderState',
    width: '120',
    type: 'color',
  },
]

export const listConfig1: ListConfigItem[] = [
  {
    label: '系统订单号',
    label_en: 'Order number',
    name: 'order_sn',
  },
  {
    label: '下单日期',
    label_en: 'Order date',
    name: 'ctime',
    width: 200,
  },
  {
    label: '服务日期',
    label_en: 'Service date',
    name: 'book_time',
  },
  {
    label: '用户',
    label_en: 'User',
    name: 'company_name',
  },
  {
    label: '工厂',
    label_en: 'Factory',
    name: 'factory_name',
    width: 240,
  },
  {
    label: '服务',
    label_en: 'Service',
    name: 'myqc_type',
    type: 'select',
  },
  {
    label: '人天/防伪标识数',
    label_en: 'Person days/anti-counterfeit identification number',
    name: 'man_day',
    type: 'numFixed',
  },
  {
    label: '客服',
    label_en: 'Customer service',
    name: 'name',
  },
  {
    label: '草稿报告状态',
    label_en: 'Draft report status',
    name: 'is_whole',
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
